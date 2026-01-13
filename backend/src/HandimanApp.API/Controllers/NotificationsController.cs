using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System.Security.Claims;

namespace HandimanApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<NotificationsController> _logger;

        public NotificationsController(ApplicationDbContext context, ILogger<NotificationsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetNotifications([FromQuery] bool unreadOnly = false)
        {
            try
            {
                var customerId = GetCurrentUserId();
                
                var query = _context.Notifications
                    .Where(n => n.CustomerId == customerId)
                    .AsNoTracking();

                if (unreadOnly)
                {
                    query = query.Where(n => !n.IsRead);
                }

                var notifications = await query
                    .OrderByDescending(n => n.CreatedAt)
                    .Select(n => new
                    {
                        n.Id,
                        n.Type,
                        n.Message,
                        n.IsRead,
                        n.CreatedAt,
                        n.SentAt,
                        n.JobId
                    })
                    .ToListAsync();

                return Ok(notifications);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching notifications: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching notifications" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetNotification(Guid id)
        {
            try
            {
                var customerId = GetCurrentUserId();
                var notification = await _context.Notifications
                    .Where(n => n.Id == id && n.CustomerId == customerId)
                    .Select(n => new
                    {
                        n.Id,
                        n.Type,
                        n.Message,
                        n.IsRead,
                        n.CreatedAt,
                        n.SentAt,
                        n.JobId
                    })
                    .FirstOrDefaultAsync();

                if (notification == null)
                {
                    return NotFound(new { message = "Notification not found" });
                }

                return Ok(notification);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching notification: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching notification" });
            }
        }

        [HttpPut("{id}/read")]
        public async Task<ActionResult> MarkAsRead(Guid id)
        {
            try
            {
                var customerId = GetCurrentUserId();
                var notification = await _context.Notifications
                    .FirstOrDefaultAsync(n => n.Id == id && n.CustomerId == customerId);

                if (notification == null)
                {
                    return NotFound(new { message = "Notification not found" });
                }

                notification.IsRead = true;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Notification marked as read" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error marking notification as read: {ex.Message}");
                return StatusCode(500, new { message = "Error updating notification" });
            }
        }

        [HttpPut("read-all")]
        public async Task<ActionResult> MarkAllAsRead()
        {
            try
            {
                var customerId = GetCurrentUserId();
                var notifications = await _context.Notifications
                    .Where(n => n.CustomerId == customerId && !n.IsRead)
                    .ToListAsync();

                foreach (var notification in notifications)
                {
                    notification.IsRead = true;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = $"Marked {notifications.Count} notifications as read" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error marking all notifications as read: {ex.Message}");
                return StatusCode(500, new { message = "Error updating notifications" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteNotification(Guid id)
        {
            try
            {
                var customerId = GetCurrentUserId();
                var notification = await _context.Notifications
                    .FirstOrDefaultAsync(n => n.Id == id && n.CustomerId == customerId);

                if (notification == null)
                {
                    return NotFound(new { message = "Notification not found" });
                }

                _context.Notifications.Remove(notification);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Notification deleted" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting notification: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting notification" });
            }
        }

        [HttpGet("statistics/summary")]
        public async Task<ActionResult> GetStatistics()
        {
            try
            {
                var customerId = GetCurrentUserId();
                var notifications = await _context.Notifications
                    .Where(n => n.CustomerId == customerId)
                    .AsNoTracking()
                    .ToListAsync();

                var stats = new
                {
                    TotalNotifications = notifications.Count,
                    UnreadCount = notifications.Count(n => !n.IsRead),
                    ReadCount = notifications.Count(n => n.IsRead),
                    TypeBreakdown = notifications
                        .GroupBy(n => n.Type)
                        .Select(g => new
                        {
                            Type = g.Key,
                            Count = g.Count(),
                            UnreadCount = g.Count(n => !n.IsRead)
                        })
                        .ToList()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching notification statistics: {ex.Message}");
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
}
