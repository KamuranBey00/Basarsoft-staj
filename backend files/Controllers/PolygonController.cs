using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Dtos;
using WebApplication1.Interfaces;
using WebApplication1.Mappers;
using WebApplication1.Models;

[Route("api/[controller]")]
[ApiController]
public class PolygonController : ControllerBase
{
    private readonly IApiService<PolygonEntity, CreatePolygonDto, UpdatePolygonDto> _polygonService;

    public PolygonController(IApiService<PolygonEntity, CreatePolygonDto, UpdatePolygonDto> polygonService)
    {
        _polygonService = polygonService;
    }

    [HttpGet]
    public ActionResult<List<PolygonResponseDto>> GetAll()
    {
        try
        {
            var polygons = _polygonService.GetAll();
            var dtoList = PolygonMapper.ToDtoList(polygons);
            return Ok(dtoList);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("paged")]
    public async Task<ActionResult<object>> GetPaged(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        if (pageNumber <= 0 || pageSize <= 0)
            return BadRequest("Sayfa numarası ve sayfa boyutu 0'dan büyük olmalıdır.");

        try
        {
            var (items, totalCount) = await _polygonService.GetPagedAsync(pageNumber, pageSize);
            var dtoList = items.Select(PolygonMapper.ToDto).ToList();

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
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("{id}")]
    public ActionResult<PolygonResponseDto> GetById(int id)
    {
        if (id <= 0)
            return BadRequest("Id must be greater than zero.");

        try
        {
            var polygon = _polygonService.GetById(id);
            if (polygon == null)
                return NotFound($"Polygon with id {id} not found.");

            return Ok(PolygonMapper.ToDto(polygon));
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("{id}/name")]
    public ActionResult<string> GetNameById(int id)
    {
        if (id <= 0)
            return BadRequest("Id must be greater than zero.");

        try
        {
            var name = _polygonService.GetNameById(id);
            if (string.IsNullOrEmpty(name))
                return NotFound($"Polygon with id {id} not found.");

            return Ok(name);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost]
    public ActionResult<PolygonResponseDto> Create(CreatePolygonDto dto)
    {
        try
        {
            var createdPolygon = _polygonService.Create(dto);
            var createdDto = PolygonMapper.ToDto(createdPolygon);
            return CreatedAtAction(nameof(GetById), new { id = createdPolygon.Id }, createdDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("search")]
    public ActionResult<List<PolygonResponseDto>> Search([FromQuery] string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
            return BadRequest("Arama anahtarı boş olamaz.");

        try
        {
            var allPolygons = _polygonService.GetAll();
            var filtered = allPolygons
                .Where(p => p.Name != null && p.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase))
                .ToList();

            return Ok(PolygonMapper.ToDtoList(filtered));
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPatch]
    public ActionResult<PolygonResponseDto> Update(UpdatePolygonDto dto)
    {
        try
        {
            var updatedPolygon = _polygonService.Update(dto);
            if (updatedPolygon == null)
                return NotFound($"Polygon with id {dto.Id} not found.");

            var updatedDto = PolygonMapper.ToDto(updatedPolygon);
            return Ok(updatedDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        if (id <= 0)
            return BadRequest("Id must be greater than zero.");

        try
        {
            var deleted = _polygonService.Delete(id);
            if (!deleted)
                return NotFound($"Polygon with id {id} not found.");

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
