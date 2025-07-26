namespace WebApplication1.Dtos
{
    public class UpdatePointDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? PointX { get; set; }
        public string? PointY { get; set; }
        public string? Wkt { get; set; } 
    }
}
