using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;
using System.Collections.Generic;
using System.Linq;

namespace WebApplication1.Repositories
{
    public class LineRepository : GenericRepository<LineEntity>, ILineRepository
    {
        public LineRepository(AppDbContext context) : base(context)
        {
        }

        // Özel metot eklenebilir
    }
}
