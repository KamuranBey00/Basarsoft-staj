import { useEffect } from 'react';
import Modify from 'ol/interaction/Modify';
import { toLonLat } from 'ol/proj';

export const useModify = ({
  mapRef,
  pointSrcRef,
  lineSrcRef,
  polySrcRef,
  editType = null,
  editTarget = null,
  onEditComplete = () => {}
}) => {
  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    
    // Remove existing modify interactions
    map.getInteractions().getArray()
      .filter(i => i instanceof Modify)
      .forEach(i => map.removeInteraction(i));

    if (editType && editTarget) {
      const src = editType === 'point'
        ? pointSrcRef.current
        : editType === 'line'
          ? lineSrcRef.current
          : polySrcRef.current;

      const feat = src.getFeatureById(editTarget.id);
      if (!feat) return;

      const modify = new Modify({ source: src });
      map.addInteraction(modify);

      modify.on('modifyend', () => {
        const geom = feat.getGeometry();

        if (editType === 'point') {
          const [lon, lat] = toLonLat(geom.getCoordinates())
            .map(n => parseFloat(n.toFixed(6)));
          onEditComplete({
            type: 'point',
            id: editTarget.id,
            coordinates: [lon, lat]
          });

        } else if (editType === 'line') {
          const coords = geom.getCoordinates()
            .map(c => toLonLat(c).map(n => parseFloat(n.toFixed(6))));
          onEditComplete({
            type: 'line',
            id: editTarget.id,
            coordinates: coords
          });

        } else if (editType === 'polygon') {
          const raw = geom.getCoordinates()[0].slice(0, -1);
          const coords = raw
            .map(c => toLonLat(c).map(n => parseFloat(n.toFixed(6))));
          onEditComplete({
            type: 'polygon',
            id: editTarget.id,
            coordinates: coords
          });
        }
      });
    }
  }, [
    mapRef, 
    pointSrcRef, 
    lineSrcRef, 
    polySrcRef, 
    editType, 
    editTarget, 
    onEditComplete
  ]);
};