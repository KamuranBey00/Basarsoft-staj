using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;

            Points = new PointRepository(_context);
            Lines = new LineRepository(_context);
            Polygons = new PolygonRepository(_context);
        }

        public IPointRepository Points { get; private set; }
        public ILineRepository Lines { get; private set; }
        public IPolygonRepository Polygons { get; private set; }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
