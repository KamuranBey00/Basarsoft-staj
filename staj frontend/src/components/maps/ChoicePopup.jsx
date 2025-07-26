// src/components/maps/ChoicePopup.jsx
import React from 'react';
import '../../styles/ChoicePopup.css';

export default function ChoicePopup({ visible, onClose, onSelect }) {
  if (!visible) return null;

  return (
    <div className="choice-overlay" onClick={onClose}>
      <div className="choice-popup" onClick={e => e.stopPropagation()}>
        <h3>Eklemek istediğiniz öğeyi seçin</h3>
        <button className="choice-btn" onClick={() => { onSelect('PointMap'); onClose(); }}>
          📍 Nokta (Harita Üzerinden)
        </button>
        <button className="choice-btn" onClick={() => { onSelect('PointCity'); onClose(); }}>
          🏙️ Nokta (Şehir Adı ile)
        </button>
        <button className="choice-btn" onClick={() => { onSelect('LineString'); onClose(); }}>
          🛤️ Çizgi
        </button>
        <button className="choice-btn" onClick={() => { onSelect('Polygon'); onClose(); }}>
          🔺 Poligon
        </button>
        <button className="choice-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}
