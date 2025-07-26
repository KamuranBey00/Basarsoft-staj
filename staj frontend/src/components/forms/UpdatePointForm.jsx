import React, { useState, useEffect, useRef } from 'react';
import '../../styles/UpdatePointForm.css';

export default function UpdatePointForm({
  visible,
  defaultName,
  coords,
  onSubmit,
  onCancel,
  submitting,
  submitMessage
}) {
  const [name, setName] = useState(defaultName || '');
  const inputRef = useRef();

  useEffect(() => {
    if (visible) {
      setName(defaultName || '');
      inputRef.current?.focus();
    }
  }, [visible, defaultName]);

  if (!visible) return null;

  return (
    <div className="upf-overlay" onClick={onCancel}>
      <div className="upf-popup" onClick={e => e.stopPropagation()}>
        <h3>Noktayı Güncelle</h3>
        <p>
          Yeni Koord: {coords[0].toFixed(6)}, {coords[1].toFixed(6)}
        </p>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit(name);
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <div className="upf-buttons">
            <button type="button" onClick={onCancel}>İptal</button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Bekleyin…' : 'Kaydet'}
            </button>
          </div>
        </form>
        {submitMessage && (
          <div className={`upf-message ${submitMessage.startsWith('✅') ? 'success' : 'error'}`}>
            {submitMessage}
          </div>
        )}
      </div>
    </div>
  );
}
