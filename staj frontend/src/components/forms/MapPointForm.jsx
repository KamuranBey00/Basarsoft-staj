// src/components/MapPointForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../../styles/MapPointForm.css';

export default function MapPointForm({
  visible,
  coords,
  onSubmit,
  onCancel,
  submitting,
  submitMessage
}) {
  const [name, setName] = useState('');
  const inputRef = useRef();

  // Form açıldığında input’u odakla
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="mpf-overlay" onClick={onCancel}>
      <div className="mpf-popup" onClick={e => e.stopPropagation()}>
        <h3>Nokta Adı Girin</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit(name);
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Örneğin: Ev, Okul…"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <div className="mpf-buttons">
            <button type="button" onClick={onCancel}>İptal</button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Bekleyin…' : 'Tamam'}
            </button>
          </div>
        </form>
        {submitMessage && (
          <div className={`mpf-message ${submitMessage.startsWith('✅') ? 'success' : 'error'}`}>
            {submitMessage}
          </div>
        )}
      </div>
    </div>
  );
}
