using WebApplication1.Data;
using WebApplication1.Interfaces;

public class GenericService<TEntity, TCreateDto, TUpdateDto> : IApiService<TEntity, TCreateDto, TUpdateDto>
    where TEntity : class
    where TCreateDto : class
    where TUpdateDto : class
{
    protected readonly IUnitOfWork _uow;
    protected readonly IGenericRepository<TEntity> _repository;
    protected readonly Func<TCreateDto, TEntity> _fromCreateDto;
    protected readonly Action<TEntity, TUpdateDto> _updateEntityFromDto;

    public GenericService(
        IUnitOfWork uow,
        IGenericRepository<TEntity> repository,
        Func<TCreateDto, TEntity> fromCreateDto,
        Action<TEntity, TUpdateDto> updateEntityFromDto)
    {
        _uow = uow;
        _repository = repository;
        _fromCreateDto = fromCreateDto;
        _updateEntityFromDto = updateEntityFromDto;
    }

    public virtual List<TEntity> GetAll() => _repository.GetAll();

    public virtual TEntity? GetById(int id) => _repository.GetById(id);

    public virtual string? GetNameById(int id)
    {
        // Eğer tüm entitylerde 'Name' varsa, özel olarak override edilmezse null döner
        return null;
    }

    public virtual TEntity Create(TCreateDto dto)
    {
        var entity = _fromCreateDto(dto);
        _repository.Add(entity);
        _repository.Save();
        return entity;
    }

    public virtual TEntity? Update(TUpdateDto dto)
    {
        var idProperty = typeof(TUpdateDto).GetProperty("Id");
        if (idProperty == null)
            throw new InvalidOperationException("Update DTO must have an Id property.");

        var id = (int)(idProperty.GetValue(dto) ?? 0);
        var entity = _repository.GetById(id);
        if (entity == null) return null;

        _updateEntityFromDto(entity, dto);
        _repository.Update(entity);
        _repository.Save();
        return entity;
    }

    public virtual bool Delete(int id)
    {
        var entity = _repository.GetById(id);
        if (entity == null) return false;

        _repository.Delete(entity);
        _repository.Save();
        return true;
    }

    // Lazy loading 
    public virtual async Task<(List<TEntity> Items, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize)
    {
        return await _repository.GetPagedAsync(pageNumber, pageSize);
    }
    public virtual async Task<List<TEntity>> SearchAsync(string query)
    {
        var entityType = typeof(TEntity);
        var nameProp = entityType.GetProperty("Name");
        if (nameProp == null)
            throw new InvalidOperationException("Search işlemi için entity'de 'Name' özelliği bulunmalıdır.");

        return await _repository.SearchAsync(query);
    }

}
