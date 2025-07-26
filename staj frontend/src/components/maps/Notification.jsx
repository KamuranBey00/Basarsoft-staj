import React, {  } from 'react';
import '../../styles/Notification.css';

export default function Notification({ message, visible }) {
  if (!visible) return null;

  return (
    <div className="notification">
      {message}
    </div>
  );
}
