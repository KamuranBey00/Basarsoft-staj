import { useEffect } from 'react';
import Select from 'ol/interaction/Select';
import { pointerMove } from 'ol/events/condition';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

export const useHoverSelect = ({ mapRef, pointSrcRef, endpointSrcRef }) => {
  useEffect(() => {
    if (!mapRef.current || !pointSrcRef.current || !endpointSrcRef.current) return;
    
    const map = mapRef.current;
    
    const hoverPointStyle = new Style({
      image: new Icon({ src: '/pin.png', anchor: [0.5, 1], scale: 0.13 })
    });
    
    const endpointHoverStyle = new Style({
      image: new Icon({ src: '/pin2.png', anchor: [0.5, 1], scale: 0.13 })
    });

    // Get layers by checking layer sources directly
    const layers = map.getLayers().getArray();
    const ptLayer = layers.find(layer => 
      layer.getSource() === pointSrcRef.current
    );
    const epLayer = layers.find(layer => 
      layer.getSource() === endpointSrcRef.current
    );

    const interactions = [];

    if (ptLayer) {
      const pointSelectInteraction = new Select({
        condition: pointerMove,
        layers: [ptLayer],
        style: hoverPointStyle
      });
      map.addInteraction(pointSelectInteraction);
      interactions.push(pointSelectInteraction);
    }

    if (epLayer) {
      const endpointSelectInteraction = new Select({
        condition: pointerMove,
        layers: [epLayer],
        style: endpointHoverStyle
      });
      map.addInteraction(endpointSelectInteraction);
      interactions.push(endpointSelectInteraction);
    }

    return () => {
      // Cleanup interactions on unmount
      interactions.forEach(interaction => {
        map.removeInteraction(interaction);
      });
    };
  }, [mapRef, pointSrcRef, endpointSrcRef]);
};