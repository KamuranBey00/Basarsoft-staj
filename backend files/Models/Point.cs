using System.ComponentModel.DataAnnotations.Schema;
using NetTopologySuite.Geometries;

[Table("points")] // tablo adý
public class Point
{
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    public string Name { get; set; }

    [Column("pointx")]
    public string PointX { get; set; }

    [Column("pointy")]
    public string PointY { get; set; }

    [Column("geom")]
    public NetTopologySuite.Geometries.Point? Geom { get; set; } // yeni geometry kolon
}
