using System.Globalization;

namespace WebApplication1.Dtos
{
    public class CreateLineDto
    {
        public string Name { get; set; }

        public List<CoordinateDto> Coordinates { get; set; } = new();

        // LINESTRING(x1 y1, x2 y2, ...)
        public string Wkt =>
            Coordinates != null && Coordinates.Any()
                ? $"LINESTRING({string.Join(", ", Coordinates.Select(c => $"{c.X.ToString(CultureInfo.InvariantCulture)} {c.Y.ToString(CultureInfo.InvariantCulture)}"))})"
                : null;
    }
}
