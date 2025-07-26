import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { MAP_MODES } from '../utils/mapModes';

export function useMapHotkeys({ setDrawMode, setEditMode, clearModes }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Input kontrolü - modal veya form alanlarında iken kısayolları devre dışı bırak
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      switch (e.key) {
        case '1':
          setDrawMode(MAP_MODES.DRAW_POINT);
          setEditMode(null);
          toast.success('🟢 Nokta çizim modu aktif');
          break;
        case '2':
          setDrawMode(MAP_MODES.DRAW_LINE);
          setEditMode(null);
          toast.success('📏 Çizgi çizim modu aktif');
          break;
        case '3':
          setDrawMode(MAP_MODES.DRAW_POLYGON);
          setEditMode(null);
          toast.success('🔷 Polygon çizim modu aktif');
          break;
        case 'Escape':
          clearModes();
          toast('⛔ Modlar iptal edildi');
          break;
        default:
          // Diğer tuşlar için herhangi bir işlem yapma
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setDrawMode, setEditMode, clearModes]);
}