using System.Globalization;

namespace WebApplication1.Dtos
{
    public class CreatePolygonDto
    {
        public string Name { get; set; }
        public List<CoordinateDto> Coordinates { get; set; } = new();

        // İlk ve son nokta aynı olmalı, değilse tamamlıyoruz.
        public string Wkt
        {
            get
            {
                if (Coordinates == null || Coordinates.Count == 0)
                    return null;

                var closedCoords = new List<CoordinateDto>(Coordinates);
                if (!closedCoords.First().Equals(closedCoords.Last()))
                {
                    closedCoords.Add(closedCoords.First());
                }
                var coordText = string.Join(", ", closedCoords.Select(c =>
                    $"{c.X.ToString(CultureInfo.InvariantCulture)} {c.Y.ToString(CultureInfo.InvariantCulture)}"));
                return $"POLYGON(({coordText}))";
            }
        }
    }

    public class CoordinateDto
    {
        public double X { get; set; }
        public double Y { get; set; }

        public override bool Equals(object? obj)
        {
            if (obj is not CoordinateDto other) return false;
            return X == other.X && Y == other.Y;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(X, Y);
        }
    }
}
