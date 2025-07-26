using System.Globalization;
using System.Collections.Generic;
using System.Linq;

namespace WebApplication1.Dtos
{
    public class UpdatePolygonDto
    {
        public int Id { get; set; }  // Güncellenecek polygon'un id'si

        public string? Name { get; set; }
        public List<CoordinateDtoPolygon>? Coordinates { get; set; }

        public string? Wkt
        {
            get
            {
                if (Coordinates == null || Coordinates.Count == 0)
                    return null;

                var parsedCoords = new List<(double X, double Y)>();

                foreach (var coord in Coordinates)
                {
                    if (double.TryParse(coord.X, NumberStyles.Any, CultureInfo.InvariantCulture, out var x) &&
                        double.TryParse(coord.Y, NumberStyles.Any, CultureInfo.InvariantCulture, out var y))
                    {
                        parsedCoords.Add((x, y));
                    }
                    else
                    {
                        return null; // Geçersiz koordinat var
                    }
                }

                // Polygon’da ilk ve son nokta aynı olmalı, değilse kapatıyoruz
                if (parsedCoords.First() != parsedCoords.Last())
                    parsedCoords.Add(parsedCoords.First());

                var coordText = string.Join(", ", parsedCoords.Select(c =>
                    $"{c.X.ToString(CultureInfo.InvariantCulture)} {c.Y.ToString(CultureInfo.InvariantCulture)}"));

                return $"POLYGON(({coordText}))";
            }
        }
    }
}
