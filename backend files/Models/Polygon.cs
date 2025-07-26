using NetTopologySuite.Geometries;

public class PolygonEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Polygon Geom { get; set; }  
}
