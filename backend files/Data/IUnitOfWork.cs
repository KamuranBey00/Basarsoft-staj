using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public interface IUnitOfWork
    {
        IPointRepository Points { get; }
        ILineRepository Lines { get; }
        IPolygonRepository Polygons { get; }
        void Save();
    }
}
