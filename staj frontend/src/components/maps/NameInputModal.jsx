import React, { useState, useEffect } from 'react';

export default function NameInputModal({ isOpen, onClose, onSubmit, itemType }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      // Modal açıldığında input'a focus
      setTimeout(() => {
        const input = document.querySelector('.name-input-modal input');
        if (input) input.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = name.trim() || `Adsız ${itemType}`;
    onSubmit(finalName);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="name-input-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          minWidth: '350px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          border: '1px solid #e1e5e9'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ 
          margin: '0 0 20px 0',
          color: '#2c3e50',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          {itemType} için isim girin
        </h3>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`${itemType} ismi girin...`}
            autoFocus
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
          
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end' 
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '2px solid #e1e5e9',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6c757d',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#e9ecef';
                e.target.style.borderColor = '#dee2e6';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.borderColor = '#e1e5e9';
              }}
            >
              İptal
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}