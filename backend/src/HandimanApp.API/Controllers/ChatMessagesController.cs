using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System.Security.Claims;

namespace HandimanApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatMessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ChatMessagesController> _logger;

        public ChatMessagesController(ApplicationDbContext context, ILogger<ChatMessagesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("job/{jobId}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetJobMessages(Guid jobId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 50)
        {
            try
            {
                var customerId = GetCurrentUserId();
                var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == jobId && j.CustomerId == customerId);

                if (job == null)
                {
                    return NotFound(new { message = "Job not found" });
                }

                var messages = await _context.ChatMessages
                    .Where(m => m.JobId == jobId)
                    .AsNoTracking()
                    .OrderBy(m => m.CreatedAt)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(m => new
                    {
                        m.Id,
                        m.Message,
                        m.SenderType,
                        m.AttachmentUrl,
                        m.CreatedAt,
                        CustomerName = m.Customer != null ? $"{m.Customer.FirstName} {m.Customer.LastName}".Trim() : "Unknown",
                        TechnicianEmail = m.TeamMember != null ? m.TeamMember.Email : null
                    })
                    .ToListAsync();

                return Ok(messages);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching messages: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching messages" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == request.JobId && j.CustomerId == userId);

                if (job == null)
                {
                    return NotFound(new { message = "Job not found" });
                }

                var message = new ChatMessage
                {
                    Id = Guid.NewGuid(),
                    CustomerId = userId,
                    JobId = request.JobId,
                    TeamMemberId = request.TeamMemberId,
                    Message = request.Message,
                    SenderType = request.SenderType ?? "customer",
                    AttachmentUrl = request.AttachmentUrl,
                    CreatedAt = DateTime.UtcNow
                };

                _context.ChatMessages.Add(message);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetJobMessages), new { jobId = message.JobId }, new
                {
                    message.Id,
                    message.Message,
                    message.SenderType,
                    message.AttachmentUrl,
                    message.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error sending message: {ex.Message}");
                return StatusCode(500, new { message = "Error sending message" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(Guid id)
        {
            try
            {
                var customerId = GetCurrentUserId();
                var message = await _context.ChatMessages
                    .FirstOrDefaultAsync(m => m.Id == id && m.CustomerId == customerId);

                if (message == null)
                {
                    return NotFound(new { message = "Message not found" });
                }

                _context.ChatMessages.Remove(message);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Message deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting message: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting message" });
            }
        }

        [HttpGet("statistics/summary")]
        public async Task<ActionResult> GetStatistics()
        {
            try
            {
                var customerId = GetCurrentUserId();
                var messages = await _context.ChatMessages
                    .Where(m => m.CustomerId == customerId)
                    .AsNoTracking()
                    .ToListAsync();

                var stats = new
                {
                    TotalMessages = messages.Count,
                    SentMessages = messages.Count(m => m.SenderType == "customer"),
                    ReceivedMessages = messages.Count(m => m.SenderType == "technician"),
                    SystemMessages = messages.Count(m => m.SenderType == "system"),
                    JobsWithMessages = messages.Select(m => m.JobId).Distinct().Count(),
                    AverageMessagesPerJob = messages.Count > 0 ? Math.Round((double)messages.Count / messages.Select(m => m.JobId).Distinct().Count(), 2) : 0
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching message statistics: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching statistics" });
            }
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }
            return Guid.Empty;
        }
    }

    public class SendMessageRequest
    {
        public Guid JobId { get; set; }
        public Guid? TeamMemberId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? SenderType { get; set; }
        public string? AttachmentUrl { get; set; }
    }
}
