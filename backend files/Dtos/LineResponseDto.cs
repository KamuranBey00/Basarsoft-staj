namespace WebApplication1.Dtos
{
    public class LineResponseDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string GeomWkt { get; set; }
    }
}
