using WebApplication1.Data;
using WebApplication1.Dtos;
using WebApplication1.Mappers;

public class PolygonService : GenericService<PolygonEntity, CreatePolygonDto, UpdatePolygonDto>
{
    private readonly IUnitOfWork _unitOfWork;

    public PolygonService(IUnitOfWork uow)
        : base(uow, uow.Polygons, PolygonMapper.FromCreateDto, PolygonMapper.UpdateEntityFromDto)
    {
        _unitOfWork = uow;
    }

    public string? GetNameById(int id)
    {
        var polygon = _unitOfWork.Polygons.GetById(id);
        return polygon?.Name;
    }
}
