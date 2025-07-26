using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;
using System.Linq;

namespace WebApplication1.Repositories
{
    public class PointRepository : GenericRepository<Point>, IPointRepository
    {
        private readonly AppDbContext _context;

        public PointRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public string? GetNameById(int id)
        {
            return _context.Points
                .Where(p => p.Id == id)
                .Select(p => p.Name)
                .FirstOrDefault();
        }
    }
}
