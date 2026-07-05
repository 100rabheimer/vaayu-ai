import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, ChevronDown } from 'lucide-react';
import { MONITORING_STATIONS } from '../services/simulationEngine';

export default function StationSearch({ selectedStationId, onSelectStation }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Helper to strip bracketed details (e.g. "Rithala [Red Line]" -> "Rithala")
  const getCleanName = (fullName) => {
    return fullName ? fullName.split(' [')[0] : '';
  };

  // Set initial text input value to the current active clean station name
  useEffect(() => {
    const activeStation = MONITORING_STATIONS.find(s => s.id === selectedStationId);
    setQuery(activeStation ? getCleanName(activeStation.name) : '');
  }, [selectedStationId]);

  // Handle outside clicks to close the dropdown suggestion panel
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Update query state when user types
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  // Determine active suggestions list
  const getSuggestions = () => {
    const trimmed = query.trim().toLowerCase();
    
    // If input is empty or matches a selected station name exactly, show all stations in dropdown
    const isExactMatch = MONITORING_STATIONS.some(s => 
      getCleanName(s.name).toLowerCase() === trimmed
    );

    if (trimmed === '' || isExactMatch) {
      return MONITORING_STATIONS;
    }
    
    // Otherwise, return filtered stations matching user query (checks both clean name and full name)
    return MONITORING_STATIONS.filter(station =>
      station.name.toLowerCase().includes(trimmed)
    );
  };

  const activeSuggestions = getSuggestions();

  const handleSelect = (station) => {
    onSelectStation(station.id);
    setQuery(getCleanName(station.name));
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && activeSuggestions.length > 0) {
      handleSelect(activeSuggestions[0]);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Search Input Box with Action Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#111827',
        border: '1px solid var(--border-card)',
        borderRadius: '10px',
        padding: '0 12px',
        height: '42px',
        width: '100%',
        transition: 'var(--transition-smooth)'
      }}>
        {/* Search Icon */}
        <Search size={18} style={{ color: 'var(--text-muted)', marginRight: '8px', flexShrink: 0 }} />
        
        {/* Search input field */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Type to search station..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            width: '100%',
            fontWeight: '600'
          }}
        />

        {/* Clear input text button */}
        {query && (
          <button 
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              marginRight: '4px',
              flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        )}

        {/* Chevron Dropdown Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px 0 4px 8px',
            borderLeft: '1px solid var(--border-card)',
            flexShrink: 0
          }}
        >
          <ChevronDown 
            size={16} 
            style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'none', 
              transition: 'transform 0.2s ease',
              color: isOpen ? 'var(--primary)' : 'var(--text-muted)'
            }} 
          />
        </button>
      </div>

      {/* Suggestion list panel */}
      {isOpen && activeSuggestions.length > 0 && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '48px',
          left: 0,
          right: 0,
          zIndex: 1100,
          padding: '8px 0',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          maxHeight: '260px',
          overflowY: 'auto'
        }}>
          {activeSuggestions.map((station) => {
            const isSelected = selectedStationId === station.id;
            const cleanName = getCleanName(station.name);
            
            return (
              <button
                key={station.id}
                onClick={() => handleSelect(station)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: isSelected ? 'var(--primary-glow)' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? '700' : '500',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <MapPin size={14} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
                <span style={{ color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                  {cleanName}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* No results fallback */}
      {isOpen && query.trim() !== '' && activeSuggestions.length === 0 && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '48px',
          left: 0,
          right: 0,
          zIndex: 1100,
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          No stations found matching "{query}"
        </div>
      )}
    </div>
  );
}
