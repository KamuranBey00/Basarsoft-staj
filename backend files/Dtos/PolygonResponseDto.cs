namespace WebApplication1.Dtos
{
    public class PolygonResponseDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string GeomWkt { get; set; }
    }
}
