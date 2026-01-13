using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;

namespace HandimanApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<InventoryController> _logger;

        public InventoryController(ApplicationDbContext context, ILogger<InventoryController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetInventory([FromQuery] string? category, [FromQuery] bool? lowStockOnly)
        {
            try
            {
                var query = _context.InventoryItems
                    .AsNoTracking();

                if (!string.IsNullOrEmpty(category))
                {
                    query = query.Where(i => i.Category == category);
                }

                if (lowStockOnly.HasValue && lowStockOnly.Value)
                {
                    query = query.Where(i => i.QuantityOnHand <= i.ReorderLevel);
                }

                var items = await query
                    .OrderBy(i => i.Category)
                    .ThenBy(i => i.Name)
                    .Select(i => new
                    {
                        i.Id,
                        i.Name,
                        i.Category,
                        i.Description,
                        i.QuantityOnHand,
                        i.ReorderLevel,
                        i.UnitPrice,
                        i.Unit,
                        TotalValue = i.QuantityOnHand * i.UnitPrice,
                        IsLowStock = i.QuantityOnHand <= i.ReorderLevel,
                        i.IsActive
                    })
                    .ToListAsync();

                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching inventory: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching inventory" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetInventoryItem(Guid id)
        {
            try
            {
                var item = await _context.InventoryItems
                    .Where(i => i.Id == id)
                    .AsNoTracking()
                    .Select(i => new
                    {
                        i.Id,
                        i.Name,
                        i.Category,
                        i.Description,
                        i.QuantityOnHand,
                        i.ReorderLevel,
                        i.UnitPrice,
                        i.Unit,
                        TotalValue = i.QuantityOnHand * i.UnitPrice,
                        IsLowStock = i.QuantityOnHand <= i.ReorderLevel,
                        i.IsActive
                    })
                    .FirstOrDefaultAsync();

                if (item == null)
                {
                    return NotFound(new { message = "Inventory item not found" });
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching inventory item: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching item" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateInventoryItem([FromBody] CreateInventoryRequest request)
        {
            try
            {
                var item = new InventoryItem
                {
                    Id = Guid.NewGuid(),
                    AccountId = Guid.NewGuid(),
                    Name = request.Name,
                    Category = request.Category,
                    Description = request.Description ?? string.Empty,
                    QuantityOnHand = request.QuantityOnHand,
                    ReorderLevel = request.ReorderLevel,
                    UnitPrice = request.UnitPrice,
                    Unit = request.Unit ?? "pcs",
                    IsActive = true
                };

                _context.InventoryItems.Add(item);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetInventoryItem), new { id = item.Id }, new
                {
                    item.Id,
                    item.Name,
                    item.Category,
                    item.Description,
                    item.QuantityOnHand,
                    item.ReorderLevel,
                    item.UnitPrice,
                    item.Unit,
                    TotalValue = item.QuantityOnHand * item.UnitPrice
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating inventory item: {ex.Message}");
                return StatusCode(500, new { message = "Error creating item" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateInventoryItem(Guid id, [FromBody] UpdateInventoryRequest request)
        {
            try
            {
                var item = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Id == id);
                if (item == null)
                {
                    return NotFound(new { message = "Inventory item not found" });
                }

                if (!string.IsNullOrWhiteSpace(request.Name))
                {
                    item.Name = request.Name;
                }

                if (!string.IsNullOrWhiteSpace(request.Category))
                {
                    item.Category = request.Category;
                }

                if (!string.IsNullOrWhiteSpace(request.Description))
                {
                    item.Description = request.Description;
                }

                if (request.QuantityOnHand.HasValue)
                {
                    item.QuantityOnHand = request.QuantityOnHand.Value;
                }

                if (request.ReorderLevel.HasValue)
                {
                    item.ReorderLevel = request.ReorderLevel.Value;
                }

                if (request.UnitPrice.HasValue)
                {
                    item.UnitPrice = request.UnitPrice.Value;
                }

                if (!string.IsNullOrWhiteSpace(request.Unit))
                {
                    item.Unit = request.Unit;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Inventory item updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating inventory item: {ex.Message}");
                return StatusCode(500, new { message = "Error updating item" });
            }
        }

        [HttpPost("{id}/adjust")]
        public async Task<ActionResult> AdjustQuantity(Guid id, [FromBody] AdjustQuantityRequest request)
        {
            try
            {
                var item = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Id == id);
                if (item == null)
                {
                    return NotFound(new { message = "Inventory item not found" });
                }

                var newQuantity = item.QuantityOnHand + request.AdjustmentQuantity;
                if (newQuantity < 0)
                {
                    return BadRequest(new { message = "Adjustment would result in negative quantity" });
                }

                item.QuantityOnHand = newQuantity;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Quantity adjusted by {request.AdjustmentQuantity}",
                    newQuantity = item.QuantityOnHand
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error adjusting quantity: {ex.Message}");
                return StatusCode(500, new { message = "Error adjusting quantity" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteInventoryItem(Guid id)
        {
            try
            {
                var item = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Id == id);
                if (item == null)
                {
                    return NotFound(new { message = "Inventory item not found" });
                }

                _context.InventoryItems.Remove(item);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Inventory item deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting inventory item: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting item" });
            }
        }

        [HttpGet("statistics/summary")]
        public async Task<ActionResult> GetStatistics()
        {
            try
            {
                var items = await _context.InventoryItems
                    .Where(i => i.IsActive)
                    .AsNoTracking()
                    .ToListAsync();

                var stats = new
                {
                    TotalItems = items.Count,
                    TotalValue = Math.Round(items.Sum(i => i.QuantityOnHand * i.UnitPrice), 2),
                    AverageItemValue = items.Count > 0 ? Math.Round(items.Average(i => i.QuantityOnHand * i.UnitPrice), 2) : 0,
                    LowStockCount = items.Count(i => i.QuantityOnHand <= i.ReorderLevel),
                    CategoriesCount = items.Select(i => i.Category).Distinct().Count(),
                    CategoryBreakdown = items
                        .GroupBy(i => i.Category)
                        .Select(g => new
                        {
                            Category = g.Key,
                            ItemCount = g.Count(),
                            TotalValue = Math.Round(g.Sum(i => i.QuantityOnHand * i.UnitPrice), 2)
                        })
                        .OrderByDescending(c => c.TotalValue)
                        .ToList(),
                    TopItems = items
                        .OrderByDescending(i => i.QuantityOnHand * i.UnitPrice)
                        .Take(5)
                        .Select(i => new
                        {
                            i.Name,
                            i.Category,
                            i.QuantityOnHand,
                            Value = Math.Round(i.QuantityOnHand * i.UnitPrice, 2)
                        })
                        .ToList()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching inventory statistics: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching statistics" });
            }
        }
    }

    public class CreateInventoryRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int QuantityOnHand { get; set; }
        public int ReorderLevel { get; set; }
        public decimal UnitPrice { get; set; }
        public string? Unit { get; set; }
    }

    public class UpdateInventoryRequest
    {
        public string? Name { get; set; }
        public string? Category { get; set; }
        public string? Description { get; set; }
        public int? QuantityOnHand { get; set; }
        public int? ReorderLevel { get; set; }
        public decimal? UnitPrice { get; set; }
        public string? Unit { get; set; }
    }

    public class AdjustQuantityRequest
    {
        public int AdjustmentQuantity { get; set; }
    }
}
