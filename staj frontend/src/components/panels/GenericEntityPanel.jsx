// src/components/panels/GenericEntityPanel.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '../../hooks/useDebounce';
import '../../styles/GenericEntityPanel.css';

export default function GenericEntityPanel({
  title,
  items,
  getCoords,
  formatCoords,
  onDelete,
  onUpdate,
  getSummary,
  showLoadMore,
  onLoadMore,
  loading,
  searchApiUrl,
  onSearchSelect
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openDetailId, setOpenDetailId] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 3000); 

  // Debounced search effect
  useEffect(() => {
    if (!searchApiUrl || debouncedSearchTerm.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${searchApiUrl}${encodeURIComponent(debouncedSearchTerm)}`);
        if (!res.ok) throw new Error();
        const list = await res.json();
        setSuggestions(list);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm, searchApiUrl]);

  const handleChange = e => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchError('');
    setSearchResult(null);
  };

  const handleSelectSuggestion = item => {
    setSearchTerm(item.name);
    setSearchResult(item);
    setShowSuggestions(false);
    if (onSearchSelect) onSearchSelect(item);
  };

  useEffect(() => {
    const onClickOutside = e => {
      if (!e.target.closest('.gep-search')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    const found = items.find(
      i => i.id.toString() === term || i.name.toLowerCase().includes(term)
    );
    if (found) {
      setSearchResult(found);
      setSearchError('');
    } else {
      setSearchResult(null);
      setSearchError(`"${searchTerm}" ile eşleşen veri bulunamadı.`);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="panel">
      <h2>{title}</h2>

      <div className="gep-search" style={{ position: 'relative' }}>
        <input
          placeholder="ID veya isim ile ara..."
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Ara</button>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="gep-suggestions">
            {suggestions.map(s => (
              <li key={s.id} onClick={() => handleSelectSuggestion(s)}>
                [{s.id}] {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {searchResult && (
        <div className="gep-search-popup">
          <h3>Sonuç</h3>
          <p><strong>ID:</strong> {searchResult.id}</p>
          <p><strong>Ad:</strong> {searchResult.name}</p>
          <p><strong>Koordinatlar:</strong></p>
          <pre>{formatCoords(getCoords(searchResult))}</pre>
          <button onClick={() => setSearchResult(null)}>Kapat</button>
        </div>
      )}
      {searchError && <div className="gep-search-error">{searchError}</div>}

      <ul className="gep-list">
        {items.map(item => {
          const coords = getCoords(item);
          return (
            <li key={item.id}>
              <div
                className="gep-item"
                onClick={() => setOpenDetailId(openDetailId === item.id ? null : item.id)}
              >
                <span>[{item.id}] {item.name}</span>
                {getSummary && <span> ({getSummary(coords)})</span>}
              </div>
              {openDetailId === item.id && (
                <div className="gep-detail">
                  <pre>{formatCoords(coords)}</pre>
                  <div className="gep-actions">
                    <button onClick={() => onDelete(item.id)}>Sil</button>
                    <button onClick={() => onUpdate(item.id)}>Güncelle</button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {items.length === 0 && <div className="gep-empty">Henüz veri eklenmemiş.</div>}

      {showLoadMore && (
        <div className="load-more">
          <button disabled={loading} onClick={onLoadMore}>
            {loading ? 'Yükleniyor…' : `Daha Fazla ${title.slice(0, -1)} Göster`}
          </button>
        </div>
      )}
    </div>
  );
}

GenericEntityPanel.propTypes = {
  title:         PropTypes.string.isRequired,
  items:         PropTypes.array.isRequired,
  getCoords:     PropTypes.func.isRequired,
  formatCoords:  PropTypes.func.isRequired,
  onDelete:      PropTypes.func.isRequired,
  onUpdate:      PropTypes.func.isRequired,
  getSummary:    PropTypes.func,
  showLoadMore:  PropTypes.bool,
  onLoadMore:    PropTypes.func,
  loading:       PropTypes.bool,
  searchApiUrl:  PropTypes.string,
  onSearchSelect: PropTypes.func
};
