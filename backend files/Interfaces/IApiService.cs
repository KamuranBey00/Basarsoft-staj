namespace WebApplication1.Interfaces
{
    public interface IApiService<TEntity, TCreateDto, TUpdateDto>
        where TEntity : class
        where TCreateDto : class
        where TUpdateDto : class
    {
        List<TEntity> GetAll();
        TEntity? GetById(int id);
        string? GetNameById(int id);
        TEntity Create(TCreateDto dto);
        TEntity? Update(TUpdateDto dto);
        bool Delete(int id);
        //Lazy load
        Task<(List<TEntity> Items, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize);
        Task<List<TEntity>> SearchAsync(string query);
    }
}
