// src/components/CityPointForm.jsx
import React, { useState } from 'react';
import '../../styles/CityPointForm.css';

export default function CityPointForm({
  visible,
  onClose,
  onSubmit,
  submitting,
  submitMessage
}) {
  const [city, setCity] = useState('');
  const [label, setLabel] = useState('');

  if (!visible) return null;

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(city.trim(), label.trim());
  };

  return (
    <div className="cpf-overlay" onClick={onClose}>
      <div className="cpf-popup" onClick={e => e.stopPropagation()}>
        <button className="cpf-close" onClick={onClose}>✕</button>
        <h3>Şehir ile Nokta Ekle</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Şehir Adı:
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
            />
          </label>
          <label>
            Kayıt İsmi:
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Gönderiliyor…' : 'Gönder'}
          </button>
        </form>
        {submitMessage && (
          <div className={`cpf-message ${submitMessage.startsWith('✅') ? 'success' : 'error'}`}>
            {submitMessage}
          </div>
        )}
      </div>
    </div>
  );
}
