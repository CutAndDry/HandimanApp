using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;
using System.Security.Claims;

namespace HandimanApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(ApplicationDbContext context, ILogger<ReviewsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetReviews([FromQuery] int minRating = 0)
        {
            try
            {
                var customerId = GetCurrentUserId();
                
                var reviews = await _context.CustomerReviews
                    .Where(r => r.CustomerId == customerId && r.Rating >= minRating)
                    .AsNoTracking()
                    .OrderByDescending(r => r.CreatedAt)
                    .Select(r => new
                    {
                        r.Id,
                        r.JobId,
                        r.Rating,
                        r.Review,
                        r.IsPublished,
                        r.CreatedAt
                    })
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching reviews: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching reviews" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetReview(Guid id)
        {
            try
            {
                var customerId = GetCurrentUserId();
                var review = await _context.CustomerReviews
                    .Where(r => r.Id == id && r.CustomerId == customerId)
                    .AsNoTracking()
                    .Select(r => new
                    {
                        r.Id,
                        r.JobId,
                        r.Rating,
                        r.Review,
                        r.IsPublished,
                        r.CreatedAt,
                        r.TechnicianId
                    })
                    .FirstOrDefaultAsync();

                if (review == null)
                {
                    return NotFound(new { message = "Review not found" });
                }

                return Ok(review);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching review: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching review" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateReview([FromBody] CreateReviewRequest request)
        {
            try
            {
                if (request.Rating < 1 || request.Rating > 5)
                {
                    return BadRequest(new { message = "Rating must be between 1 and 5" });
                }

                var customerId = GetCurrentUserId();
                var review = new CustomerReview
                {
                    Id = Guid.NewGuid(),
                    CustomerId = customerId,
                    JobId = request.JobId,
                    TechnicianId = request.TechnicianId,
                    Rating = request.Rating,
                    Review = request.Review,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.CustomerReviews.Add(review);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetReview), new { id = review.Id }, new
                {
                    review.Id,
                    review.JobId,
                    review.Rating,
                    review.Review,
                    review.IsPublished,
                    review.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating review: {ex.Message}");
                return StatusCode(500, new { message = "Error creating review" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateReview(Guid id, [FromBody] UpdateReviewRequest request)
        {
            try
            {
                var customerId = GetCurrentUserId();
                var review = await _context.CustomerReviews
                    .FirstOrDefaultAsync(r => r.Id == id && r.CustomerId == customerId);

                if (review == null)
                {
                    return NotFound(new { message = "Review not found" });
                }

                if (request.Rating.HasValue)
                {
                    if (request.Rating < 1 || request.Rating > 5)
                    {
                        return BadRequest(new { message = "Rating must be between 1 and 5" });
                    }
                    review.Rating = request.Rating.Value;
                }

                if (!string.IsNullOrWhiteSpace(request.Review))
                {
                    review.Review = request.Review;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Review updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating review: {ex.Message}");
                return StatusCode(500, new { message = "Error updating review" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteReview(Guid id)
        {
            try
            {
                var customerId = GetCurrentUserId();
                var review = await _context.CustomerReviews
                    .FirstOrDefaultAsync(r => r.Id == id && r.CustomerId == customerId);

                if (review == null)
                {
                    return NotFound(new { message = "Review not found" });
                }

                _context.CustomerReviews.Remove(review);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Review deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting review: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting review" });
            }
        }

        [HttpGet("statistics/summary")]
        public async Task<ActionResult> GetStatistics()
        {
            try
            {
                var customerId = GetCurrentUserId();
                var reviews = await _context.CustomerReviews
                    .Where(r => r.CustomerId == customerId)
                    .AsNoTracking()
                    .ToListAsync();

                var stats = new
                {
                    TotalReviews = reviews.Count,
                    AverageRating = reviews.Count > 0 ? Math.Round(reviews.Average(r => r.Rating), 2) : 0,
                    FiveStarCount = reviews.Count(r => r.Rating == 5),
                    FourStarCount = reviews.Count(r => r.Rating == 4),
                    ThreeStarCount = reviews.Count(r => r.Rating == 3),
                    TwoStarCount = reviews.Count(r => r.Rating == 2),
                    OneStarCount = reviews.Count(r => r.Rating == 1),
                    RatingDistribution = reviews
                        .GroupBy(r => r.Rating)
                        .Select(g => new
                        {
                            Rating = g.Key,
                            Count = g.Count()
                        })
                        .OrderByDescending(d => d.Rating)
                        .ToList()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching review statistics: {ex.Message}");
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

    public class CreateReviewRequest
    {
        public Guid JobId { get; set; }
        public Guid? TechnicianId { get; set; }
        public int Rating { get; set; }
        public string Review { get; set; } = string.Empty;
    }

    public class UpdateReviewRequest
    {
        public int? Rating { get; set; }
        public string? Review { get; set; }
    }
}
