using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IPointRepository : IGenericRepository<Point>
    {
        string? GetNameById(int id); // Point’e özgü ekstra metot
    }
}
