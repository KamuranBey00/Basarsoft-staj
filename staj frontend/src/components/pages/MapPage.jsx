// src/components/pages/MapPage.jsx
import React, { useState, useRef } from 'react';
import MapComponent from '../../components/maps/MapComponent';
import useApi from '../../hooks/useApi';
import { useMapHotkeys } from '../../hooks/useMapHotkeys';
import { useHotkeyDrawing } from '../../hooks/useHotkeyDrawing';
import { MAP_MODES } from '../../utils/mapModes';
import { toast } from 'react-toastify';
import NameInputModal from '../../components/maps/NameInputModal';

export default function MapPage() {
  // 1) Modlar
  const [drawMode, setDrawMode]   = useState(MAP_MODES.NONE);
  const [editMode, setEditMode]   = useState(null);

  // 2) Modal yönetimi
  const [nameModal, setNameModal] = useState({
    isOpen: false,
    type: '',
    pendingData: null
  });

  // 3) API
  const { pointApi, lineApi, polygonApi } = useApi();

  // 4) Harita ve kaynak ref’leri (useHotkeyDrawing için)
  const mapRef       = useRef(null);
  const pointSrcRef  = useRef(null);
  const lineSrcRef   = useRef(null);
  const polySrcRef   = useRef(null);

  // 5) Mod temizleme (Escape tuşu için)
  const clearModes = () => {
    setDrawMode(MAP_MODES.NONE);
    setEditMode(null);
  };

  // 6) Klavye kısayolları
  useMapHotkeys({ setDrawMode, setEditMode, clearModes });

  // 7) Hotkey ile çizim işlemi
  useHotkeyDrawing({
    mapRef,
    pointSrcRef,
    lineSrcRef,
    polySrcRef,
    drawMode, // MAP_MODES.DRAW_POINT, DRAW_LINE, DRAW_POLYGON
    onPointDrawn: coords => openNameModal('point', coords),
    onLineDrawn: data   => openNameModal('line', data.coordinates),
    onPolygonDrawn: data=> openNameModal('polygon', data.coordinates),
  });

  // 8) Modal açma
  const openNameModal = (type, coordinates) => {
    setNameModal({
      isOpen: true,
      type,
      pendingData: { type, coordinates }
    });
  };

  // 9) Modal’dan gelen isimle veri tabanına kayıt
  const handleNameSubmit = async name => {
    const { pendingData } = nameModal;

    try {
      if (pendingData.type === 'point') {
        const data = await pointApi.create({
          name,
          pointX: pendingData.coordinates.x.toString(),
          pointY: pendingData.coordinates.y.toString()
        });
        toast.success(`🟢 "${data.name}" noktası eklendi`);
      }
      else if (pendingData.type === 'line') {
        const coordsText = pendingData.coordinates
          .map(c => `${c.x} ${c.y}`)
          .join(', ');
        const data = await lineApi.create({
          name,
          geomWkt: `LINESTRING(${coordsText})`
        });
        toast.success(`📏 "${data.name}" çizgisi eklendi`);
      }
      else if (pendingData.type === 'polygon') {
        const coords = [...pendingData.coordinates];
        // kapalı olması için
        if (
          coords[0].x !== coords[coords.length - 1].x ||
          coords[0].y !== coords[coords.length - 1].y
        ) {
          coords.push(coords[0]);
        }
        const coordsText = coords.map(c => `${c.x} ${c.y}`).join(', ');
        const data = await polygonApi.create({
          name,
          geomWkt: `POLYGON((${coordsText}))`
        });
        toast.success(`🔷 "${data.name}" poligonu eklendi`);
      }
    } catch {
      toast.error('❌ Kayıt sırasında hata oluştu');
    }

    // Modu sıfırla, modal kapat
    setDrawMode(MAP_MODES.NONE);
    setNameModal({ isOpen: false, type: '', pendingData: null });
  };

  return (
    <>
      <MapComponent
        hotkeyDrawMode={
          drawMode === MAP_MODES.DRAW_POINT   ? 'Point' :
          drawMode === MAP_MODES.DRAW_LINE    ? 'LineString' :
          drawMode === MAP_MODES.DRAW_POLYGON ? 'Polygon' :
          null
        }
        editType={editMode}      // eğer düzenleme de eklenecekse
        editTarget={null}
        mapRef={mapRef}
        pointSrcRef={pointSrcRef}
        lineSrcRef={lineSrcRef}
        polySrcRef={polySrcRef}
      />

      <NameInputModal
        isOpen={nameModal.isOpen}
        itemType={nameModal.type}
        onClose={() => setNameModal({ isOpen: false, type: '', pendingData: null })}
        onSubmit={handleNameSubmit}
      />
    </>
  );
}
