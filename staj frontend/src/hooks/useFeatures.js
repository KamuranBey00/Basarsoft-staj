import { useEffect } from 'react';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import { fromLonLat } from 'ol/proj';

export const useFeatures = ({
  points = [],
  lines = [],
  polygons = [],
  pointSrcRef,
  lineSrcRef,
  polySrcRef,
  endpointSrcRef
}) => {
  // Points effect
  useEffect(() => {
    if (!pointSrcRef.current) return;
    
    const src = pointSrcRef.current;
    src.clear();
    points.forEach(p => {
      const feat = new Feature({ geometry: new Point(fromLonLat(p.coords)) });
      feat.setId(p.id);
      feat.set('name', p.name);
      src.addFeature(feat);
    });
  }, [points, pointSrcRef]);

  // Lines effect
  useEffect(() => {
    if (!lineSrcRef.current) return;
    
    const src = lineSrcRef.current;
    src.clear();
    lines.forEach(l => {
      const wkt = l.geomWkt || l.wkt;
      const m = wkt.match(/LINESTRING\s*\(\s*([^)]+)\)/i);
      if (!m) return;
      const coords = m[1]
        .split(',')
        .map(pair => pair.trim().split(/\s+/).map(Number))
        .map(c => fromLonLat(c));
      const feat = new Feature({ geometry: new LineString(coords) });
      feat.setId(l.id);
      feat.set('name', l.name);
      src.addFeature(feat);
    });
  }, [lines, lineSrcRef]);

  // Polygons effect
  useEffect(() => {
    if (!polySrcRef.current) return;
    
    const src = polySrcRef.current;
    src.clear();
    polygons.forEach(p => {
      const wkt = p.geomWkt || p.wkt;
      const m = wkt.match(/POLYGON\s*\(\(\s*([^)]+)\)\)/i);
      if (!m) return;
      const raw = m[1]
        .split(',')
        .map(pair => pair.trim().split(/\s+/).map(Number))
        .map(c => fromLonLat(c));
      const feat = new Feature({ geometry: new Polygon([raw]) });
      feat.setId(p.id);
      feat.set('name', p.name);
      src.addFeature(feat);
    });
  }, [polygons, polySrcRef]);

  // Endpoints effect
  useEffect(() => {
    if (!endpointSrcRef.current) return;
    
    const ep = endpointSrcRef.current;
    ep.clear();
    
    lines.forEach(l => {
      const wkt = l.geomWkt || l.wkt;
      const m = wkt.match(/LINESTRING\s*\(\s*([^)]+)\)/i);
      if (!m) return;
      const coords = m[1]
        .split(',')
        .map(pair => pair.trim().split(/\s+/).map(Number))
        .map(c => fromLonLat(c));
      ['(1)', '(2)'].forEach((lbl, i) => {
        const f = new Feature({ geometry: new Point(coords[i]) });
        f.set('name', `${l.name}${lbl}`);
        ep.addFeature(f);
      });
    });
    
    polygons.forEach(p => {
      const wkt = p.geomWkt || p.wkt;
      const m = wkt.match(/POLYGON\s*\(\(\s*([^)]+)\)\)/i);
      if (!m) return;
      const raw = m[1]
        .split(',')
        .map(pair => pair.trim().split(/\s+/).map(Number))
        .map(c => fromLonLat(c));
      const coords = raw.slice(0, -1);
      coords.forEach((c, idx) => {
        const f = new Feature({ geometry: new Point(c) });
        f.set('name', `${p.name}(${idx + 1})`);
        ep.addFeature(f);
      });
    });
  }, [lines, polygons, endpointSrcRef]);
};