using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    private readonly AppDbContext _context;
    private readonly DbSet<T> _dbSet;

    public GenericRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public List<T> GetAll()
    {
        return _dbSet.ToList();
    }

    public T? GetById(int id)
    {
        return _dbSet.Find(id);
    }

    public void Add(T entity)
    {
        _dbSet.Add(entity);
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public void Save()
    {
        _context.SaveChanges();
    }

    public async Task<(List<T> Items, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize)
    {
        var totalCount = await _dbSet.CountAsync();
        var items = await _dbSet
            .OrderBy(e => EF.Property<int>(e, "Id"))  
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
    public async Task<List<T>> SearchAsync(string query)
    {
        var entityType = typeof(T);
        var nameProp = entityType.GetProperty("Name");
        if (nameProp == null)
            throw new InvalidOperationException("Search işlemi için entity'de 'Name' özelliği bulunmalıdır.");

        return await _dbSet
            .Where(e => EF.Functions.ILike(EF.Property<string>(e, "Name"), $"{query}%"))
            .ToListAsync();
    }

}
