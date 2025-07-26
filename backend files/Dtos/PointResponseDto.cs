namespace WebApplication1.Dtos
{
    public class PointResponseDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string PointX { get; set; }
        public required string PointY { get; set; }
        public required string GeomWkt { get; set; }
    }
}
