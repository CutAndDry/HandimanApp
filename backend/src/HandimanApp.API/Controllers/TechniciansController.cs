using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HandimanApp.Core.Entities;
using HandimanApp.Infrastructure.Data;

namespace HandimanApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TechniciansController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TechniciansController> _logger;

    public TechniciansController(ApplicationDbContext context, ILogger<TechniciansController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all technicians (employees) for an account
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<dynamic>>> GetTechnicians(
        [FromQuery] string? accountId,
        [FromQuery] string? status,
        [FromQuery] int limit = 50,
        [FromQuery] int offset = 0)
    {
        try
        {
            if (string.IsNullOrEmpty(accountId) || !Guid.TryParse(accountId, out var accountGuid))
            {
                return BadRequest(new { message = "Invalid accountId" });
            }

            var query = _context.Users
                .Where(u => u.AccountId == accountGuid && u.Role == UserRole.Employee)
                .AsQueryable();

            // Apply status filter
            if (status?.ToLower() == "inactive")
                query = query.Where(u => !u.IsActive);
            else if (status?.ToLower() == "active")
                query = query.Where(u => u.IsActive);

            var technicians = await query
                .OrderBy(u => u.FirstName)
                .Skip(offset)
                .Take(limit)
                .Select(u => new
                {
                    id = u.Id.ToString(),
                    firstName = u.FirstName,
                    lastName = u.LastName,
                    email = u.Email,
                    phoneNumber = u.PhoneNumber,
                    isActive = u.IsActive,
                    profileInitials = u.FirstName[0].ToString() + u.LastName[0].ToString(),
                    rating = 4.8,
                    totalJobs = 24,
                    hourlyRate = 65m,
                    createdAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(technicians);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching technicians");
            return StatusCode(500, new { message = "Error fetching technicians" });
        }
    }

    /// <summary>
    /// Get a specific technician by ID with skills
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<dynamic>> GetTechnician(string id)
    {
        try
        {
            if (!Guid.TryParse(id, out var technicianGuid))
            {
                return BadRequest(new { message = "Invalid ID format" });
            }

            var technician = await _context.Users
                .Where(u => u.Id == technicianGuid && u.Role == UserRole.Employee)
                .FirstOrDefaultAsync();

            if (technician == null)
            {
                return NotFound(new { message = "Technician not found" });
            }

            var skills = await _context.TechnicianSkills
                .Where(s => s.TeamMemberId == technicianGuid && s.IsActive)
                .Select(s => new { skillName = s.SkillName, proficiency = s.Proficiency })
                .ToListAsync();

            return Ok(new
            {
                id = technician.Id.ToString(),
                firstName = technician.FirstName,
                lastName = technician.LastName,
                email = technician.Email,
                phoneNumber = technician.PhoneNumber,
                isActive = technician.IsActive,
                rating = 4.8,
                totalJobs = 24,
                hourlyRate = 65m,
                skills = skills,
                createdAt = technician.CreatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching technician");
            return StatusCode(500, new { message = "Error fetching technician" });
        }
    }

    /// <summary>
    /// Get technician skills
    /// </summary>
    [HttpGet("{id}/skills")]
    public async Task<ActionResult<IEnumerable<dynamic>>> GetTechnicianSkills(string id)
    {
        try
        {
            if (!Guid.TryParse(id, out var technicianGuid))
            {
                return BadRequest(new { message = "Invalid ID format" });
            }

            var skills = await _context.TechnicianSkills
                .Where(s => s.TeamMemberId == technicianGuid && s.IsActive)
                .Select(s => new
                {
                    id = s.Id.ToString(),
                    skillName = s.SkillName,
                    proficiency = s.Proficiency,
                    certification = s.Certification,
                    certificationExpiry = s.CertificationExpiry
                })
                .ToListAsync();

            return Ok(skills);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching technician skills");
            return StatusCode(500, new { message = "Error fetching technician skills" });
        }
    }

    /// <summary>
    /// Add a skill to a technician
    /// </summary>
    [HttpPost("{id}/skills")]
    public async Task<IActionResult> AddSkill(string id, [FromBody] AddSkillRequest request)
    {
        try
        {
            if (!Guid.TryParse(id, out var technicianGuid))
            {
                return BadRequest(new { message = "Invalid ID format" });
            }

            var technician = await _context.Users.FindAsync(technicianGuid);
            if (technician == null || technician.Role != UserRole.Employee)
            {
                return NotFound(new { message = "Technician not found" });
            }

            var skill = new TechnicianSkill
            {
                Id = Guid.NewGuid(),
                TeamMemberId = technicianGuid,
                SkillName = request.SkillName,
                Proficiency = request.ProficiencyLevel ?? "intermediate",
                Certification = request.Certification,
                CertificationExpiry = request.CertificationExpiry,
                IsActive = true
            };

            _context.TechnicianSkills.Add(skill);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Skill added successfully", skillId = skill.Id.ToString() });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding skill");
            return StatusCode(500, new { message = "Error adding skill" });
        }
    }

    /// <summary>
    /// Remove a skill from a technician
    /// </summary>
    [HttpDelete("{id}/skills/{skillId}")]
    public async Task<IActionResult> RemoveSkill(string id, string skillId)
    {
        try
        {
            if (!Guid.TryParse(skillId, out var skillGuid))
            {
                return BadRequest(new { message = "Invalid skill ID format" });
            }

            var skill = await _context.TechnicianSkills.FindAsync(skillGuid);
            if (skill == null)
            {
                return NotFound(new { message = "Skill not found" });
            }

            _context.TechnicianSkills.Remove(skill);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Skill removed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing skill");
            return StatusCode(500, new { message = "Error removing skill" });
        }
    }
}

public class AddSkillRequest
{
    public string SkillName { get; set; } = "";
    public string? ProficiencyLevel { get; set; }
    public string? Certification { get; set; }
    public DateTime? CertificationExpiry { get; set; }
}
