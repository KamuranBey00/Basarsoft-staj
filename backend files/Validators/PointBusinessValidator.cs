using System.Globalization;
using WebApplication1.Dtos;
using WebApplication1.Models;

namespace WebApplication1.Services.Validations
{
    public class PointBusinessValidator
    {
        private readonly List<Point> _points;

        public PointBusinessValidator(List<Point> points)
        {
            _points = points;
        }

        public void ValidateCreate(CreatePointDto dto)
        {
            if (!TryParseCoordinates(dto.PointX, dto.PointY, out double x, out double y))
                throw new ArgumentException("Koordinatlar geçerli sayılar olmalıdır.");

            if (!IsInRange(x, y))
                throw new ArgumentException("PointX -180 ile 180, PointY -90 ile 90 arasında olmalıdır.");

            if (ExistsWithCoordinates(dto.PointX, dto.PointY))
                throw new InvalidOperationException("Aynı koordinatlara sahip bir kayıt zaten mevcut.");
        }

        public void ValidateUpdate(UpdatePointDto dto)
        {
            if (dto.Id < 1)
                throw new ArgumentException("ID 1'den küçük olamaz.");

            var existing = GetById(dto.Id) ?? throw new KeyNotFoundException("Kayıt bulunamadı.");

            string newXStr = dto.PointX ?? existing.PointX;
            string newYStr = dto.PointY ?? existing.PointY;

            if (!TryParseCoordinates(newXStr, newYStr, out double x, out double y))
                throw new ArgumentException("Koordinatlar geçerli sayılar olmalıdır.");

            if (!IsInRange(x, y))
                throw new ArgumentException("PointX -180 ile 180, PointY -90 ile 90 arasında olmalıdır.");

            if (ExistsWithCoordinatesExceptId(newXStr, newYStr, dto.Id))
                throw new InvalidOperationException("Bu koordinatlara sahip başka bir nokta zaten var.");
        }

        public void ValidateId(int id)
        {
            if (id < 1)
                throw new ArgumentException("ID 1'den küçük olamaz.");

            if (!_points.Any(p => p.Id == id))
                throw new KeyNotFoundException($"ID {id} ile eşleşen kayıt bulunamadı.");
        }

        private bool TryParseCoordinates(string xStr, string yStr, out double x, out double y)
        {
            bool xParsed = double.TryParse(xStr, NumberStyles.Float, CultureInfo.InvariantCulture, out x);
            bool yParsed = double.TryParse(yStr, NumberStyles.Float, CultureInfo.InvariantCulture, out y);
            return xParsed && yParsed;
        }

        private bool IsInRange(double x, double y) =>
            x >= -180 && x <= 180 && y >= -90 && y <= 90;

        private bool ExistsWithCoordinates(string x, string y) =>
            _points.Any(p => p.PointX == x && p.PointY == y);

        private bool ExistsWithCoordinatesExceptId(string x, string y, int id) =>
            _points.Any(p => p.PointX == x && p.PointY == y && p.Id != id);

        private Point? GetById(int id) =>
            _points.FirstOrDefault(p => p.Id == id);
    }
}
