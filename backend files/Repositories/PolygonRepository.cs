using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;
using System.Collections.Generic;
using System.Linq;

namespace WebApplication1.Repositories
{
    public class PolygonRepository : GenericRepository<PolygonEntity>, IPolygonRepository
    {
        public PolygonRepository(AppDbContext context) : base(context)
        {
        }

        // Özel metot eklenebilir
    }
}
