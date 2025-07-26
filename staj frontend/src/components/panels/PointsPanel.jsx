// src/components/panels/PointsPanel.jsx
import React from 'react';
import GenericEntityPanel from './GenericEntityPanel';

export default function PointsPanel({ points, onDelete, onUpdate, showLoadMore, onLoadMore, loading, searchApiUrl, onSearchSelect  }) {
  return (
    <GenericEntityPanel
      title="Points"
      items={points}
      getCoords={item => item.coords}
      formatCoords={coords =>
      // coords: [lon, lat]
       coords && coords.length === 2
        ? `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`
         : '—'
      }
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
