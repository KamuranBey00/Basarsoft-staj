import React, { useState } from 'react';
import { useMapInitialization } from '../../hooks/useMapInitialization';
import { useFeatures } from '../../hooks/useFeatures';
import { useHoverSelect } from '../../hooks/useHoverSelect';
import { useDrawing } from '../../hooks/useDrawing';
import { useHotkeyDrawing } from '../../hooks/useHotkeyDrawing';
import { useModify } from '../../hooks/useModify';
import { useMapHotkeys } from '../../hooks/useMapHotkeys';
import useApi from '../../hooks/useApi';
import { MAP_MODES } from '../../utils/mapModes';
import { toast } from 'react-toastify';
import NameInputModal from './NameInputModal';

export default function MapComponent({
  onMapClick,
  onLineDrawn,
  onPolygonDrawn,
  points = [],
  lines = [],
  polygons = [],
  mapClickMode = false,
  drawMode = null,
  editType = null,
  editTarget = null,
  onEditComplete = () => {},
  enableHotkeyDrawing = false,
  onDataAdded = () => {}
}) {
  // Klavye kısayolu ile çizim modu yönetimi
  const [hotkeyDrawMode, setHotkeyDrawMode] = useState(MAP_MODES.NONE);
  
  // İsim girme modal'ının durumu ve verileri
  const [nameModal, setNameModal] = useState({
    isOpen: false,
    type: '',
    pendingData: null
  });

  // API işlemleri için hook
  const { pointApi, lineApi, polygonApi } = useApi();

  // Harita başlatma ve referansları alma
  const {
    containerRef,
    mapRef,
    pointSrcRef,
    lineSrcRef,
    polySrcRef,
    endpointSrcRef
  } = useMapInitialization();

  // Klavye kısayolu modlarını temizleme
  const clearHotkeyModes = () => {
    setHotkeyDrawMode(MAP_MODES.NONE);
  };

  // Harita klavye kısayollarını dinleme (sadece hotkey özelliği aktifse)
  useMapHotkeys({ 
    setDrawMode: enableHotkeyDrawing ? setHotkeyDrawMode : () => {}, 
    setEditMode: () => {},
    clearModes: enableHotkeyDrawing ? clearHotkeyModes : () => {}
  });

  // İsim girme modal'ını açma
  const openNameModal = (type, coordinates) => {
    setNameModal({
      isOpen: true,
      type,
      pendingData: { type, coordinates }
    });
  };

  // Modal'dan gelen isimle veriyi veritabanına kaydetme
  const handleNameSubmit = async (name) => {
    const { pendingData } = nameModal;

    try {
      if (pendingData.type === 'point') {
        const data = await pointApi.create({
          name,
          pointX: pendingData.coordinates[0].toString(),
          pointY: pendingData.coordinates[1].toString()
        });
        toast.success(`🟢 "${data.name}" noktası eklendi`);
        
        const formattedData = {
          id: data.id,
          name: data.name,
          pointX: data.pointX,
          pointY: data.pointY
        };
        onDataAdded('point', formattedData);
      }
      else if (pendingData.type === 'line') {
        const requestPayload = {
          name,
          coordinates: pendingData.coordinates.map(coord => ({
            x: parseFloat(coord.x),
            y: parseFloat(coord.y)
          }))
        };

        const data = await lineApi.create(requestPayload);
        toast.success(`📏 "${data.name}" çizgisi eklendi`);
        onDataAdded('line', data);
      }
      else if (pendingData.type === 'polygon') {
        let coords = [...pendingData.coordinates];

        // Polygon'un kapalı olması için ilk noktayı sona ekle (eğer kapalı değilse)
        if (
          coords[0].x !== coords[coords.length - 1].x ||
          coords[0].y !== coords[coords.length - 1].y
        ) {
          coords.push(coords[0]);
        }

        const requestPayload = {
          name,
          coordinates: coords.map(coord => ({
            x: parseFloat(coord.x),
            y: parseFloat(coord.y)
          }))
        };

        const data = await polygonApi.create(requestPayload);
        toast.success(`🔷 "${data.name}" poligonu eklendi`);
        onDataAdded('polygon', data);
      }
    } catch (error) {
      toast.error(`❌ Kayıt sırasında hata oluştu: ${error.message}`);
    }

    // Modu sıfırla, modal kapat
    setHotkeyDrawMode(MAP_MODES.NONE);
    setNameModal({ isOpen: false, type: '', pendingData: null });
  };

  // Klavye kısayolu ile nokta çizimi tamamlandığında
  const handleHotkeyPointDrawn = (coordinates) => {
    openNameModal('point', coordinates);
  };

  // Klavye kısayolu ile çizgi çizimi tamamlandığında
  const handleHotkeyLineDrawn = (data) => {
    openNameModal('line', data.coordinates);
  };

  // Klavye kısayolu ile poligon çizimi tamamlandığında
  const handleHotkeyPolygonDrawn = (data) => {
    openNameModal('polygon', data.coordinates);
  };

  // Harita üzerinde özellikleri (point, line, polygon) görselleştirme
  useFeatures({
    points,
    lines,
    polygons,
    pointSrcRef,
    lineSrcRef,
    polySrcRef,
    endpointSrcRef
  });

  // Harita üzerinde hover efektleri yönetimi
  useHoverSelect({ 
    mapRef, 
    pointSrcRef, 
    endpointSrcRef 
  });

  // Normal çizim etkileşimlerini yönetme (mevcut sistem)
  useDrawing({
    mapRef,
    pointSrcRef,
    lineSrcRef,
    polySrcRef,
    mapClickMode,
    drawMode,
    onMapClick,
    onLineDrawn,
    onPolygonDrawn
  });

  // Klavye kısayolu çizim etkileşimlerini yönetme (yeni sistem)
  useHotkeyDrawing({
    mapRef,
    pointSrcRef,
    lineSrcRef,
    polySrcRef,
    drawMode: enableHotkeyDrawing ? (
      hotkeyDrawMode === MAP_MODES.DRAW_POINT   ? 'Point' :
      hotkeyDrawMode === MAP_MODES.DRAW_LINE    ? 'LineString' :
      hotkeyDrawMode === MAP_MODES.DRAW_POLYGON ? 'Polygon' :
      null
    ) : null,
    onPointDrawn: handleHotkeyPointDrawn,
    onLineDrawn: handleHotkeyLineDrawn,
    onPolygonDrawn: handleHotkeyPolygonDrawn
  });

  // Harita üzerinde düzenleme (modify) etkileşimlerini yönetme
  useModify({
    mapRef,
    pointSrcRef,
    lineSrcRef,
    polySrcRef,
    editType,
    editTarget,
    onEditComplete
  });

  return (
    <>
      <div ref={containerRef} id="map" style={{ width: '100%', height: '600px' }} />
      
      {/* Klavye kısayolu özelliği aktifse isim girme modal'ını göster */}
      {enableHotkeyDrawing && (
        <NameInputModal
          isOpen={nameModal.isOpen}
          itemType={nameModal.type}
          onClose={() => setNameModal({ isOpen: false, type: '', pendingData: null })}
          onSubmit={handleNameSubmit}
        />
      )}
    </>
  );
}