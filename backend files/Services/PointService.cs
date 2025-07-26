using WebApplication1.Data;
using WebApplication1.Dtos;
using WebApplication1.Interfaces;
using WebApplication1.Mappers;
using WebApplication1.Models;
using WebApplication1.Repositories;

public class PointService : GenericService<Point, CreatePointDto, UpdatePointDto>
{
    public PointService(IUnitOfWork uow)
        : base(uow, uow.Points, PointMapper.FromCreateDto, PointMapper.UpdateEntityFromDto)
    {
    }

    public override string? GetNameById(int id)
    {
        return _repository is IPointRepository pr ? pr.GetNameById(id) : null;
    }
}
