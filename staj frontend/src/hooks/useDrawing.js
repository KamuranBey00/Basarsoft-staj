import { useEffect, useRef } from 'react';
import Draw from 'ol/interaction/Draw';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';

export const useDrawing = ({
  mapRef,
  pointSrcRef,
  lineSrcRef,
  polySrcRef,
  mapClickMode = false,
  drawMode = null,
  onMapClick,
  onLineDrawn,
  onPolygonDrawn
}) => {
  const onMapClickRef = useRef(onMapClick);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    
    // Remove existing draw interactions
    map.getInteractions().getArray()
      .filter(i => i instanceof Draw)
      .forEach(i => map.removeInteraction(i));

    if (mapClickMode) {
      const draw = new Draw({ source: pointSrcRef.current, type: 'Point' });
      map.addInteraction(draw);
      draw.on('drawend', e => {
        const c = e.feature.getGeometry().getCoordinates();
        pointSrcRef.current.removeFeature(e.feature);
        const [lon, lat] = toLonLat(c).map(n => parseFloat(n.toFixed(6)));
        onMapClickRef.current?.([lon, lat]);
        map.removeInteraction(draw);
      });
      return;
    }

    if (drawMode === 'LineString') {
      const draw = new Draw({ 
        source: lineSrcRef.current, 
        type: 'LineString', 
        maxPoints: 2 
      });
      map.addInteraction(draw);
      draw.on('drawend', e => {
        const coords = e.feature.getGeometry()
          .getCoordinates()
          .map(c => toLonLat(c).map(n => parseFloat(n.toFixed(6))));
        coords.forEach(c =>
          pointSrcRef.current.addFeature(new Feature({ 
            geometry: new Point(fromLonLat(c)) 
          }))
        );
        const name = prompt('Çizgi adı:');
        if (name) {
          onLineDrawn({ 
            name, 
            coordinates: coords.map(c => ({ x: c[0], y: c[1] })) 
          });
        }
        map.removeInteraction(draw);
      });
      return;
    }

    if (drawMode === 'Polygon') {
      const draw = new Draw({ source: polySrcRef.current, type: 'Polygon' });
      map.addInteraction(draw);
      draw.on('drawend', e => {
        const raw = e.feature.getGeometry().getCoordinates()[0];
        const coords = raw
          .map(c => toLonLat(c).map(n => parseFloat(n.toFixed(6))))
          .filter(c => !isNaN(c[0]) && !isNaN(c[1]));
        if (coords.length < 3) {
          alert('En az 3 nokta gerekli.');
        } else {
          const name = prompt('Polygon adı:');
          if (name) {
            onPolygonDrawn({ 
              name, 
              coordinates: coords.map(c => ({ x: c[0], y: c[1] })) 
            });
          }
        }
        map.removeInteraction(draw);
      });
    }
  }, [
    mapRef, 
    pointSrcRef, 
    lineSrcRef, 
    polySrcRef, 
    mapClickMode, 
    drawMode, 
    onLineDrawn, 
    onPolygonDrawn
  ]);
};