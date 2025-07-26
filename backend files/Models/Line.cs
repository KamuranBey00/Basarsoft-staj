using NetTopologySuite.Geometries;

public class LineEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public LineString Geom { get; set; }
}
