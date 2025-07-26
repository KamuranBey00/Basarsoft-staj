// src/components/forms/UpdateLineForm.jsx
import React, { useState, useEffect } from 'react';

export default function UpdateLineForm({
  visible,
  lineData,
  onSubmit,
  onCancel,
  submitting,
  submitMessage
}) {
  const [name, setName] = useState('');
  const [coords, setCoords] = useState([]);

  useEffect(() => {
    if (visible && lineData) {
      setName(lineData.name || '');
      setCoords(lineData.coords || []);
    }
  }, [visible, lineData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Lütfen çizgi adını girin.');
      return;
    }
    if (coords.length < 2) {
      alert('En az 2 nokta gerekli.');
      return;
    }
    onSubmit(name, coords);
  };

  const handleCoordChange = (index, field, value) => {
    const newCoords = [...coords];
    newCoords[index] = [...newCoords[index]];
    newCoords[index][field === 'lon' ? 0 : 1] = parseFloat(value) || 0;
    setCoords(newCoords);
  };

  const addPoint = () => {
    setCoords([...coords, [0, 0]]);
  };

  const removePoint = (index) => {
    if (coords.length > 2) {
      setCoords(coords.filter((_, i) => i !== index));
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Çizgi Güncelle</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ad:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Çizgi adı"
              required
            />
          </div>

          <div className="form-group">
            <label>Koordinatlar:</label>
            {coords.map((coord, index) => (
              <div key={index} className="coord-input">
                <span>{index + 1}.</span>
                <input
                  type="number"
                  step="any"
                  value={coord[0]}
                  onChange={(e) => handleCoordChange(index, 'lon', e.target.value)}
                  placeholder="Longitude"
                />
                <input
                  type="number"
                  step="any"
                  value={coord[1]}
                  onChange={(e) => handleCoordChange(index, 'lat', e.target.value)}
                  placeholder="Latitude"
                />
                {coords.length > 2 && (
                  <button type="button" onClick={() => removePoint(index)}>
                    Sil
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addPoint}>
              Nokta Ekle
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
            <button type="button" onClick={onCancel}>
              İptal
            </button>
          </div>
        </form>
        
        {submitMessage && (
          <div className="submit-message">{submitMessage}</div>
        )}
      </div>
    </div>
  );
}