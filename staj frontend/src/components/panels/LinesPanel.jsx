// src/components/panels/LinesPanel.jsx
import React from 'react';
import GenericEntityPanel from './GenericEntityPanel';
import { parseLineWkt } from '../../utils/wktUtils';

export default function LinesPanel({ lines, onDelete, onUpdate, showLoadMore, onLoadMore, loading, searchApiUrl, onSearchSelect }) {
  return (
    <GenericEntityPanel
      title="Lines"
      items={lines}
      getCoords={item => parseLineWkt(item.geomWkt)}
      formatCoords={coords =>
        coords.map(([x, y]) => `${x.toFixed(6)}, ${y.toFixed(6)}`).join(' → ')
      }
      onDelete={onDelete}
      onUpdate={onUpdate}
      getSummary={coords => `${coords.length} nokta`}
      showLoadMore={showLoadMore}
      onLoadMore={onLoadMore}
      loading={loading}
      searchApiUrl={searchApiUrl}
      onSearchSelect={onSearchSelect}
    />
  );
}
