// src/components/panels/PolygonsPanel.jsx
import React from 'react';
import GenericEntityPanel from './GenericEntityPanel';
import { parsePolygonWkt } from '../../utils/wktUtils';

export default function PolygonsPanel({ polygons, onDelete, onUpdate , showLoadMore, onLoadMore, loading, searchApiUrl, onSearchSelect }) {
  const formatPoly = coords => {
    // kapalı polygon’in son tekrarlı noktası varsa atla
    const pts =
      coords.length > 1 &&
      coords[0][0] === coords[coords.length - 1][0] &&
      coords[0][1] === coords[coords.length - 1][1]
        ? coords.slice(0, -1)
        : coords;
    return pts
      .map((c, i) => `${i + 1}. ${c[0].toFixed(6)}, ${c[1].toFixed(6)}`)
      .join('\n');
  };
  const summary = coords =>
    `${coords.length > 1 &&
    coords[0][0] === coords[coords.length - 1][0] &&
    coords[0][1] === coords[coords.length - 1][1]
      ? coords.length - 1
      : coords.length} köşe`;

  return (
    <GenericEntityPanel
      title="Polygons"
      items={polygons}
      getCoords={item => parsePolygonWkt(item.geomWkt)}
      formatCoords={formatPoly}
      getSummary={summary}
      onDelete={onDelete}
      onUpdate={onUpdate}
      showLoadMore={showLoadMore}
      onLoadMore={onLoadMore}
      loading={loading}      
      searchApiUrl={searchApiUrl}
      onSearchSelect={onSearchSelect}
    />
  );
}
