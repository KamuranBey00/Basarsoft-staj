using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using WebApplication1.Dtos;
using WebApplication1.Models;

namespace WebApplication1.Mappers
{
    public static class PolygonMapper
    {
        public static PolygonResponseDto ToDto(PolygonEntity polygon)
        {
            return new PolygonResponseDto
            {
                Id = polygon.Id,
                Name = polygon.Name,
                GeomWkt = polygon.Geom?.AsText()
            };
        }

        public static List<PolygonResponseDto> ToDtoList(List<PolygonEntity> polygons)
        {
            return polygons.Select(ToDto).ToList();
        }

        public static PolygonEntity FromCreateDto(CreatePolygonDto dto)
        {
            try
            {
                var reader = new WKTReader(NetTopologySuite.NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326));
                var geometry = reader.Read(dto.Wkt);

                if (geometry is not Polygon polygonGeometry)
                    throw new ArgumentException("WKT formatı geçersiz veya Polygon değil.");

                return new PolygonEntity
                {
                    Name = dto.Name,
                    Geom = polygonGeometry
                };
            }
            catch (Exception ex)
            {
                throw new ArgumentException($"WKT okunamadı: {ex.Message}", ex);
            }
        }


        public static void UpdateEntityFromDto(PolygonEntity entity, UpdatePolygonDto dto)
        {
            if (!string.IsNullOrWhiteSpace(dto.Name))
                entity.Name = dto.Name;

            if (!string.IsNullOrWhiteSpace(dto.Wkt))
            {
                var reader = new WKTReader(NetTopologySuite.NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326));
                var geometry = reader.Read(dto.Wkt);

                if (geometry is not Polygon polygonGeometry)
                    throw new ArgumentException("WKT formatı geçersiz veya Polygon değil.");

                entity.Geom = polygonGeometry;
            }
        }
    }
}
