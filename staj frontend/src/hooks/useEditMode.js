import { useState } from 'react';

const useEditMode = () => {
  const [editType, setEditType] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const initiateEditPoint = (id, points, notify) => {
    const pt = points.find(p => p.id === id);
    if (pt) {
      setEditType('point');
      setEditTarget({ id, coords: pt.coords });
      notify('Noktayı haritada sürükleyerek güncelleyebilirsiniz.');
    }
  };

  const initiateEditLine = (id, lines, notify) => {
    const ln = lines.find(l => l.id === id);
    if (ln) {
      const match = ln.geomWkt.match(/LINESTRING\s*\(\s*([^)]+)\)/i);
      if (match) {
        const coords = match[1].split(',').map(s => s.trim().split(/\s+/).map(Number));
        setEditType('line');
        setEditTarget({ id, coords });
        notify('Çizginin uç noktalarını sürükleyerek güncelleyin.');
      }
    }
  };

  const initiateEditPolygon = (id, polygons, notify) => {
    const pg = polygons.find(p => p.id === id);
    if (pg) {
      const match = pg.geomWkt.match(/POLYGON\s*\(\(\s*([^)]+)\)\)/i);
      if (match) {
        let coords = match[1].split(',').map(s => s.trim().split(/\s+/).map(Number));
        coords = coords.slice(0, -1); // Remove the last coordinate (which is same as first)
        setEditType('polygon');
        setEditTarget({ id, coords });
        notify('Polygon köşe noktalarını sürükleyerek güncelleyin.');
      }
    }
  };

  const resetEdit = () => {
    setEditType(null);
    setEditTarget(null);
  };

  return {
    editType,
    editTarget,
    initiateEditPoint,
    initiateEditLine,
    initiateEditPolygon,
    resetEdit,
    setEditType,
    setEditTarget
  };
};

export default useEditMode;