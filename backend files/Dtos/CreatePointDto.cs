namespace WebApplication1.Dtos
{
    public class CreatePointDto
    {
        public string Name { get; set; }
        public string PointX { get; set; } 
        public string PointY { get; set; } 

        // Otomatik olarak "POINT(x y)" formatına çevir
        public string Wkt => $"POINT({PointX} {PointY})";
    }
}
