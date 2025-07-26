using System.Resources;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Dtos;
using WebApplication1.Interfaces;
using WebApplication1.Mappers;
using WebApplication1.Models;
using WebApplication1.Resources;

[Route("api/[controller]")]
[ApiController]
public class PointController : ControllerBase
{
    private readonly IApiService<Point, CreatePointDto, UpdatePointDto> _pointService;

    public PointController(IApiService<Point, CreatePointDto, UpdatePointDto> pointService)
    {
        _pointService = pointService;
    }

    [HttpGet]
    public ActionResult<List<PointResponseDto>> GetAll()
    {
        try
        {
            var points = _pointService.GetAll();
            return Ok(PointMapper.ToDtoList(points));
        }
        catch (Exception ex)
        {
            return StatusCode(500, string.Format(Resources.Error_InternalServer, ex.Message));
        }
    }

    [HttpGet("paged")]
    public async Task<ActionResult<object>> GetPaged([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        if (pageNumber <= 0 || pageSize <= 0)
            return BadRequest("Sayfa numarası ve sayfa boyutu 0'dan büyük olmalıdır.");

        try
        {
            var (items, totalCount) = await _pointService.GetPagedAsync(pageNumber, pageSize);
            var dtoList = PointMapper.ToDtoList(items);

            return Ok(new
            {
                Items = dtoList,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, string.Format(Resources.Error_InternalServer, ex.Message));
        }
    }

    [HttpGet("{id}")]
    public ActionResult<PointResponseDto> GetById(int id)
    {
        if (id <= 0)
            return BadRequest(Resources.Error_IdMustBeGreaterThanZero);

        try
        {
            var point = _pointService.GetById(id);
            if (point == null)
                return NotFound(string.Format(Resources.Error_PointNotFound, id));

            return Ok(PointMapper.ToDto(point));
        }
        catch (Exception ex)
        {
            return StatusCode(500, string.Format(Resources.Error_InternalServer, ex.Message));
        }
    }

    [HttpPost]
    public ActionResult<PointResponseDto> Create(CreatePointDto dto)
    {
        try
        {
            var createdPoint = _pointService.Create(dto);
            var createdDto = PointMapper.ToDto(createdPoint);

            return CreatedAtAction(nameof(GetById), new { id = createdPoint.Id }, createdDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, string.Format(Resources.Error_InternalServer, ex.Message));
        }
    }

    [HttpGet("search")]
    public ActionResult<List<PointResponseDto>> Search([FromQuery] string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
            return BadRequest("Arama anahtarı boş olamaz.");

        try
        {
            var allPoints = _pointService.GetAll();
            var filtered = allPoints
                .Where(p => p.Name != null && p.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase))
                .ToList();

            return Ok(PointMapper.ToDtoList(filtered));
        }
        catch (Exception ex)
        {
            return StatusCode(500, string.Format(Resources.Error_InternalServer, ex.Message));
        }
    }

    [HttpPatch]
    public ActionResult<PointResponseDto> Update(UpdatePointDto dto)
    {
        try
        {
            var updatedPoint = _pointService.Update(dto);
            if (updatedPoint == null)
                return NotFound(string.Format(Resources.Error_PointNotFound, dto.Id));

            return Ok(PointMapper.ToDto(updatedPoint));
        }
        catch (Exception ex)
        {
            return StatusCode(500, string.Format(Resources.Error_InternalServer, ex.Message));
        }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        if (id <= 0)
            return BadRequest(Resources.Error_IdMustBeGreaterThanZero);

        try
        {
            var deleted = _pointService.Delete(id);
            if (!deleted)
                return NotFound(string.Format(Resources.Error_PointNotFound, id));

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, string.Format(Resources.Error_InternalServer, ex.Message));
        }
    }

    [HttpGet("{id}/name")]
    public ActionResult<string> GetNameById(int id)
    {
        if (id <= 0)
            return BadRequest(Resources.Error_IdMustBeGreaterThanZero);

        try
        {
            var name = _pointService.GetNameById(id);
            if (string.IsNullOrEmpty(name))
                return NotFound(string.Format(Resources.Error_PointNotFound, id));

            return Ok(name);
        }
        catch (Exception ex)
        {
            return StatusCode(500, string.Format(Resources.Error_InternalServer, ex.Message));
        }
    }
}
