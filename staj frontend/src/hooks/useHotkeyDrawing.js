import { useEffect, useRef } from 'react';
import Draw from 'ol/interaction/Draw';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';

// Klavye kısayolları ile harita üzerinde nokta, çizgi ve poligon çizimi
export const useHotkeyDrawing = ({
  mapRef,
  pointSrcRef,
  lineSrcRef,
  polySrcRef,
  drawMode = null,
  onPointDrawn,
  onLineDrawn,
  onPolygonDrawn
}) => {
  // Callback fonksiyonlarının güncel referanslarını tutma
  const onPointRef = useRef(onPointDrawn);
  const onLineRef = useRef(onLineDrawn);
  const onPolygonRef = useRef(onPolygonDrawn);

  // Callback fonksiyonları değiştiğinde referansları güncelleme
  useEffect(() => {
    onPointRef.current = onPointDrawn;
    onLineRef.current = onLineDrawn;
    onPolygonRef.current = onPolygonDrawn;
  }, [onPointDrawn, onLineDrawn, onPolygonDrawn]);

  // Çizim moduna göre OpenLayers Draw etkileşimi oluşturma
  useEffect(() => {
    if (!mapRef.current || !drawMode) return;

    const map = mapRef.current;

    // Mevcut Draw etkileşimlerini temizleme
    map.getInteractions().getArray()
      .filter(i => i instanceof Draw)
      .forEach(i => map.removeInteraction(i));

    let draw;

    // Nokta çizimi
    if (drawMode === 'Point') {
      draw = new Draw({ source: pointSrcRef.current, type: 'Point' });
      map.addInteraction(draw);

      draw.on('drawend', e => {
        const coord = e.feature.getGeometry().getCoordinates();
        pointSrcRef.current.removeFeature(e.feature);
        const [lon, lat] = toLonLat(coord).map(n => parseFloat(n.toFixed(6)));
        onPointRef.current?.([lon, lat]);
        map.removeInteraction(draw);
      });
      return;
    }

    // Çizgi çizimi (2 nokta arası)
    if (drawMode === 'LineString') {
      draw = new Draw({ source: lineSrcRef.current, type: 'LineString', maxPoints: 2 });
      map.addInteraction(draw);
    
      draw.on('drawend', e => {
        const coords = e.feature.getGeometry().getCoordinates()
          .map(c => toLonLat(c).map(n => parseFloat(n.toFixed(6))));
      
        // Çizgi uç noktalarını görselleştirme için point olarak ekleme
        coords.forEach(c => {
          pointSrcRef.current.addFeature(new Feature({
            geometry: new Point(fromLonLat(c))
          }));
        });
      
        // Koordinatları API formatına dönüştürme (x=longitude, y=latitude)
        const formattedCoords = coords.map(([longitude, latitude]) => ({ 
          x: longitude,
          y: latitude
        }));
      
        onLineRef.current?.({
          coordinates: formattedCoords
        });
      
        map.removeInteraction(draw);
      });
      return;
    }
    
    // Poligon çizimi
    if (drawMode === 'Polygon') {
      draw = new Draw({ source: polySrcRef.current, type: 'Polygon' });
      map.addInteraction(draw);
        
      draw.on('drawend', e => {
        const raw = e.feature.getGeometry().getCoordinates()[0];
        const coords = raw.map(c => toLonLat(c).map(n => parseFloat(n.toFixed(6))))
          .filter(([longitude, latitude]) => !isNaN(longitude) && !isNaN(latitude));
      
        if (coords.length < 3) {
          alert('En az 3 nokta gerekli.');
        } else {
          // Koordinatları API formatına dönüştürme (x=longitude, y=latitude)
          const formattedCoords = coords.map(([longitude, latitude]) => ({ 
            x: longitude,
            y: latitude
          }));
          
          onPolygonRef.current?.({
            coordinates: formattedCoords
          });
        }
      
        map.removeInteraction(draw);
      });
      return;
    }

    // Cleanup - çizim modu değişirse etkileşimi kaldırma
    return () => {
      if (draw) {
        map.removeInteraction(draw);
      }
    };
  }, [
    mapRef,
    pointSrcRef,
    lineSrcRef,
    polySrcRef,
    drawMode
  ]);
};