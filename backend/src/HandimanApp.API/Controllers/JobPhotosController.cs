using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System.Security.Claims;

namespace HandimanApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobPhotosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<JobPhotosController> _logger;

        public JobPhotosController(ApplicationDbContext context, ILogger<JobPhotosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("job/{jobId}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetJobPhotos(Guid jobId, [FromQuery] string? photoType)
        {
            try
            {
                var query = _context.JobPhotos
                    .Where(p => p.JobId == jobId)
                    .AsNoTracking();

                if (!string.IsNullOrEmpty(photoType))
                {
                    query = query.Where(p => p.PhotoType == photoType);
                }

                var photos = await query
                    .OrderBy(p => p.CreatedAt)
                    .Select(p => new
                    {
                        p.Id,
                        p.JobId,
                        p.PhotoUrl,
                        p.PhotoType,
                        p.Description,
                        p.CreatedAt
                    })
                    .ToListAsync();

                return Ok(photos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching job photos: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching photos" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetPhoto(Guid id)
        {
            try
            {
                var photo = await _context.JobPhotos
                    .Where(p => p.Id == id)
                    .AsNoTracking()
                    .Select(p => new
                    {
                        p.Id,
                        p.JobId,
                        p.PhotoUrl,
                        p.PhotoType,
                        p.Description,
                        p.CreatedAt
                    })
                    .FirstOrDefaultAsync();

                if (photo == null)
                {
                    return NotFound(new { message = "Photo not found" });
                }

                return Ok(photo);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching photo: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching photo" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreatePhoto([FromBody] CreatePhotoRequest request)
        {
            try
            {
                var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == request.JobId);
                if (job == null)
                {
                    return NotFound(new { message = "Job not found" });
                }

                var validTypes = new[] { "before", "during", "after", "damage", "inspection" };
                if (!validTypes.Contains(request.PhotoType.ToLower()))
                {
                    return BadRequest(new { message = "Invalid photo type. Must be: before, during, after, damage, or inspection" });
                }

                var photo = new JobPhoto
                {
                    Id = Guid.NewGuid(),
                    JobId = request.JobId,
                    PhotoUrl = request.PhotoUrl,
                    PhotoType = request.PhotoType.ToLower(),
                    Description = request.Description,
                    CreatedAt = DateTime.UtcNow
                };

                _context.JobPhotos.Add(photo);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPhoto), new { id = photo.Id }, new
                {
                    photo.Id,
                    photo.JobId,
                    photo.PhotoUrl,
                    photo.PhotoType,
                    photo.Description,
                    photo.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating photo: {ex.Message}");
                return StatusCode(500, new { message = "Error creating photo" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePhoto(Guid id, [FromBody] UpdatePhotoRequest request)
        {
            try
            {
                var photo = await _context.JobPhotos.FirstOrDefaultAsync(p => p.Id == id);
                if (photo == null)
                {
                    return NotFound(new { message = "Photo not found" });
                }

                if (!string.IsNullOrWhiteSpace(request.Description))
                {
                    photo.Description = request.Description;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Photo updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating photo: {ex.Message}");
                return StatusCode(500, new { message = "Error updating photo" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePhoto(Guid id)
        {
            try
            {
                var photo = await _context.JobPhotos.FirstOrDefaultAsync(p => p.Id == id);
                if (photo == null)
                {
                    return NotFound(new { message = "Photo not found" });
                }

                _context.JobPhotos.Remove(photo);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Photo deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting photo: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting photo" });
            }
        }

        [HttpGet("statistics/summary")]
        public async Task<ActionResult> GetStatistics()
        {
            try
            {
                var photos = await _context.JobPhotos
                    .AsNoTracking()
                    .ToListAsync();

                var stats = new
                {
                    TotalPhotos = photos.Count,
                    PhotosByType = photos
                        .GroupBy(p => p.PhotoType)
                        .Select(g => new
                        {
                            Type = g.Key,
                            Count = g.Count()
                        })
                        .ToList(),
                    JobsWithPhotos = photos.Select(p => p.JobId).Distinct().Count(),
                    PhotoTypeBreakdown = new
                    {
                        Before = photos.Count(p => p.PhotoType == "before"),
                        During = photos.Count(p => p.PhotoType == "during"),
                        After = photos.Count(p => p.PhotoType == "after"),
                        Damage = photos.Count(p => p.PhotoType == "damage"),
                        Inspection = photos.Count(p => p.PhotoType == "inspection")
                    }
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching photo statistics: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching statistics" });
            }
        }
    }

    public class CreatePhotoRequest
    {
        public Guid JobId { get; set; }
        public string PhotoUrl { get; set; } = string.Empty;
        public string PhotoType { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class UpdatePhotoRequest
    {
        public string? Description { get; set; }
    }
}
