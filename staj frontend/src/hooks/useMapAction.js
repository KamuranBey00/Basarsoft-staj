import { useState, useCallback } from 'react';

const useMapActions = (notify) => {
  const [mapAction, setMapAction] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState(null);

  const startMapAction = (action) => {
    setMapAction(action);
    switch (action) {
      case 'createPoint': 
        notify('Harita tıklama modu: yeni nokta ekle'); 
        break;
      case 'drawLine':    
        notify('2 nokta ile çizgi oluştur'); 
        break;
      case 'drawPolygon': 
        notify('Poligon çizim modu aktif'); 
        break;
      case 'updatePoint': 
        notify('Güncellenecek noktayı seçin'); 
        break;
      default: 
        break;
    }
  };

  const handleMapClick = useCallback((coords) => {
    if (mapAction === 'createPoint' || mapAction === 'updatePoint') {
      setSelectedCoords(coords);
      return true; // Indicates that the click was handled
    }
    return false;
  }, [mapAction]);

  const resetMapAction = () => {
    setMapAction(null);
    setSelectedCoords(null);
  };

  return {
    mapAction,
    selectedCoords,
    startMapAction,
    handleMapClick,
    resetMapAction,
    setMapAction,
    setSelectedCoords
  };
};

export default useMapActions;