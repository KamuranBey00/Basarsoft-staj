using NetTopologySuite;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using WebApplication1.Dtos;
using WebApplication1.Models;

namespace WebApplication1.Mappers
{
    public static class PointMapper
    {
        private static readonly GeometryFactory _geometryFactory =
            NetTopologySuite.NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326);

        private static readonly WKTReader _reader = new WKTReader(_geometryFactory);


        public static PointResponseDto ToDto(Point point)
        {
            return new PointResponseDto
            {
                Id = point.Id,
                Name = point.Name,
                PointX = point.PointX,
                PointY = point.PointY,
                GeomWkt = point.Geom?.AsText()
            };
        }

        public static List<PointResponseDto> ToDtoList(List<Point> points)
        {
            return points.Select(ToDto).ToList();
        }

        // CREATE için: DTO'dan Entity oluşturma
        public static Point FromCreateDto(CreatePointDto dto)
        {
            var geometry = _reader.Read(dto.Wkt);

            if (geometry is not NetTopologySuite.Geometries.Point pointGeometry)
                throw new ArgumentException("WKT formatı geçersiz veya Point değil.");

            return new Point
            {
                Name = dto.Name,
                PointX = dto.PointX,
                PointY = dto.PointY,
                Geom = pointGeometry
            };
        }

        // UPDATE için: Mevcut entity üzerinde güncelleme yapma
        public static void UpdateEntityFromDto(Point entity, UpdatePointDto dto)
        {
            if (!string.IsNullOrWhiteSpace(dto.Name))
                entity.Name = dto.Name;

            if (!string.IsNullOrWhiteSpace(dto.PointX))
                entity.PointX = dto.PointX;

            if (!string.IsNullOrWhiteSpace(dto.PointY))
                entity.PointY = dto.PointY;

            if (!string.IsNullOrWhiteSpace(dto.Wkt))
            {
                var geometry = _reader.Read(dto.Wkt);

                if (geometry is not NetTopologySuite.Geometries.Point pointGeometry)
                    throw new ArgumentException("WKT formatı geçersiz veya Point değil.");

                entity.Geom = pointGeometry;
            }
        }
    }
}
