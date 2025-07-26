using WebApplication1.Data;
using WebApplication1.Dtos;
using WebApplication1.Interfaces;
using WebApplication1.Mappers;
using WebApplication1.Models;

public class LineService : GenericService<LineEntity, CreateLineDto, UpdateLineDto>
{
    public LineService(IUnitOfWork uow)
        : base(uow, uow.Lines, LineMapper.FromCreateDto, LineMapper.UpdateEntityFromDto)
    {
    }
}
