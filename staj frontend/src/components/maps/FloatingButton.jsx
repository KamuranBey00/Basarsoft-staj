// src/components/FloatingButton.jsx
import React from 'react';
import '../../styles/FloatingButton.css';

export default function FloatingButton({ onClick }) {
  return (
    <button className="fab" onClick={onClick}>
      ➕
    </button>
  );
}
