// File: src/utils/wktUtils.js

export function parsePointWkt(wkt) {
  const match = wkt.match(/POINT\(([^)]+)\)/);
  if (!match) return [];
  const [x, y] = match[1].trim().split(' ').map(Number);
  return [[x, y]];
}

export function parseLineWkt(wkt) {
  const match = wkt.match(/LINESTRING\(([^)]+)\)/);
  if (!match) return [];
  return match[1].split(',').map(p => p.trim().split(' ').map(Number));
}

export function parsePolygonWkt(wkt) {
  const match = wkt.match(/POLYGON\(\(([^)]+)\)\)/);
  if (!match) return [];
  return match[1].split(',').map(p => p.trim().split(' ').map(Number));
}

export function formatCoords(coords) {
  return coords.map(([x, y]) => `${x.toFixed(6)}, ${y.toFixed(6)}`).join(' → ');
}

export function formatPolygonCoords(coords) {
  const pts = coords.length > 1 &&
    coords[0][0] === coords[coords.length - 1][0] &&
    coords[0][1] === coords[coords.length - 1][1]
      ? coords.slice(0, -1)
      : coords;
  return pts.map((c, i) => `${i + 1}. ${c[0].toFixed(6)}, ${c[1].toFixed(6)}`).join('\n');
}

export function getPolygonSummary(coords) {
  const pts = coords.length > 1 &&
    coords[0][0] === coords[coords.length - 1][0] &&
    coords[0][1] === coords[coords.length - 1][1]
      ? coords.slice(0, -1)
      : coords;
  return `${pts.length} köşe`;
}
