using Microsoft.AspNetCore.Mvc;
using WebApplication1.Dtos;
using WebApplication1.Interfaces;
using WebApplication1.Mappers;
using WebApplication1.Models;

[Route("api/[controller]")]
[ApiController]
public class LineController : ControllerBase
{
    private readonly IApiService<LineEntity, CreateLineDto, UpdateLineDto> _lineService;

    public LineController(IApiService<LineEntity, CreateLineDto, UpdateLineDto> lineService)
    {
        _lineService = lineService;
    }

    [HttpGet]
    public ActionResult<List<LineResponseDto>> GetAll()
    {
        try
        {
            var lines = _lineService.GetAll();
            var dtoList = LineMapper.ToDtoList(lines);
            return Ok(dtoList);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("paged")]
    public async Task<ActionResult<object>> GetPaged([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        if (pageNumber <= 0 || pageSize <= 0)
            return BadRequest("Sayfa numarası ve sayfa boyutu 0'dan büyük olmalıdır.");

        try
        {
            var (items, totalCount) = await _lineService.GetPagedAsync(pageNumber, pageSize);
            var dtoList = items.Select(LineMapper.ToDto).ToList();

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
    public ActionResult<LineResponseDto> GetById(int id)
    {
        if (id <= 0)
            return BadRequest("Id must be greater than zero.");

        try
        {
            var line = _lineService.GetById(id);
            if (line == null)
                return NotFound($"Line with id {id} not found.");

            return Ok(LineMapper.ToDto(line));
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
            var name = _lineService.GetNameById(id);
            if (string.IsNullOrEmpty(name))
                return NotFound($"Line with id {id} not found.");

            return Ok(name);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost]
    public ActionResult<LineResponseDto> Create(CreateLineDto dto)
    {
        try
        {
            var createdLine = _lineService.Create(dto);
            var createdDto = LineMapper.ToDto(createdLine);
            return CreatedAtAction(nameof(GetById), new { id = createdLine.Id }, createdDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("search")]
    public async Task<ActionResult<List<LineResponseDto>>> Search([FromQuery] string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
            return BadRequest("Arama anahtarı boş olamaz.");

        var results = await _lineService.SearchAsync(keyword);
        var dtoList = results.Select(LineMapper.ToDto).ToList();
        return Ok(dtoList);
    }


    [HttpPatch]
    public ActionResult<LineResponseDto> Update(UpdateLineDto dto)
    {
        try
        {
            var updatedLine = _lineService.Update(dto);
            if (updatedLine == null)
                return NotFound($"Line with id {dto.Id} not found.");

            var updatedDto = LineMapper.ToDto(updatedLine);
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
            var deleted = _lineService.Delete(id);
            if (!deleted)
                return NotFound($"Line with id {id} not found.");

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
