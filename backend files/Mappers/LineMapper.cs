using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using WebApplication1.Dtos;
using WebApplication1.Models;

namespace WebApplication1.Mappers
{
    public static class LineMapper
    {
        public static LineResponseDto ToDto(LineEntity line)
        {
            return new LineResponseDto
            {
                Id = line.Id,
                Name = line.Name,
                GeomWkt = line.Geom?.AsText()
            };
        }

        public static List<LineResponseDto> ToDtoList(List<LineEntity> lines)
        {
            return lines.Select(ToDto).ToList();
        }

        public static LineEntity FromCreateDto(CreateLineDto dto)
        {
            var reader = new WKTReader(NetTopologySuite.NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326));
            var geometry = reader.Read(dto.Wkt);

            if (geometry is not LineString lineGeometry)
                throw new ArgumentException("WKT formatı geçersiz veya LineString değil.");

            return new LineEntity
            {
                Name = dto.Name,
                Geom = lineGeometry
            };
        }

        public static void UpdateEntityFromDto(LineEntity entity, UpdateLineDto dto)
        {
            if (!string.IsNullOrWhiteSpace(dto.Name))
                entity.Name = dto.Name;

            if (!string.IsNullOrWhiteSpace(dto.Wkt))
            {
                var reader = new WKTReader(NetTopologySuite.NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326));
                var geometry = reader.Read(dto.Wkt);

                if (geometry is not LineString lineGeometry)
                    throw new ArgumentException("WKT formatı geçersiz veya LineString değil.");

                entity.Geom = lineGeometry;
            }
        }
    }
}
