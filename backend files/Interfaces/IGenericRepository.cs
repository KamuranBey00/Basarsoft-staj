using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApplication1.Interfaces
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        List<TEntity> GetAll();
        TEntity? GetById(int id);
        void Add(TEntity entity);
        void Update(TEntity entity);
        void Delete(TEntity entity);
        void Save();

        Task<(List<TEntity> Items, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize);
        Task<List<TEntity>> SearchAsync(string query);

    }
}
