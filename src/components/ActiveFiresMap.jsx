import React from 'react';
import { MONITORING_STATIONS, STUBBLE_FIRE_HOTSPOTS } from '../services/simulationEngine';
import { Flame, Wind, Radio } from 'lucide-react';

export default function ActiveFiresMap({ selectedStationId, onSelectStation, windSpeed, windDirection, stubbleFiresActive }) {
  // Simulating wind vector coordinates based on direction degrees
  const getWindLine = () => {
    // NW wind blows from top-left (Punjab) to bottom-right (Delhi)
    if (windDirection === 'West' || windDirection === 'North') {
      return { x1: 40, y1: 20, x2: 120, y2: 80 };
    }
    // East wind blows from right to left
    return { x1: 170, y1: 50, x2: 100, y2: 50 };
  };

  const windLine = getWindLine();

  return (
    <div className="glass-panel" style={{ width: '100%', height: '100%', minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio style={{ color: 'var(--primary)' }} size={20} />
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>CPCB Monitor & Crop Fire Tracking</h3>
        </div>
        
        {/* Map Legend */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
            CPCB Monitor
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
            Active Fire
          </span>
        </div>
      </div>

      {/* Interactive Map Area (Vector Canvas) */}
      <div style={{
        flexGrow: 1,
        backgroundColor: '#090d16',
        borderRadius: '12px',
        border: '1px solid var(--border-card)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* SVG Drawing Canvas */}
        <svg width="100%" height="100%" viewBox="0 0 280 200" style={{ display: 'block' }}>
          {/* Grid lines to make it look technical/scientific */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Regional Borders (Simulated outline of Haryana, Punjab, Delhi borders) */}
          {/* Punjab/Haryana boundary on top left */}
          <path d="M 10 10 L 80 10 L 100 70 L 60 120 L 10 100 Z" fill="rgba(239, 68, 68, 0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
          <text x="20" y="25" fill="var(--text-muted)" fontSize="7" fontWeight="bold">PUNJAB / HARYANA</text>
          
          {/* Delhi NCR boundary in center-right */}
          <path d="M 110 120 L 160 70 L 250 80 L 260 150 L 190 180 L 110 160 Z" fill="rgba(56, 189, 248, 0.02)" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="2" strokeDasharray="3,3" />
          <text x="170" y="175" fill="var(--primary)" fontSize="8" fontWeight="bold" opacity="0.6">DELHI-NCR REGION</text>

          {/* Wind Vector Vectors (Dynamic arrows) */}
          <g style={{ opacity: 0.25 }}>
            <line 
              x1={windLine.x1} 
              y1={windLine.y1} 
              x2={windLine.x2} 
              y2={windLine.y2} 
              stroke="var(--primary)" 
              strokeWidth="2" 
              strokeDasharray="5,5" 
            />
            {/* Dynamic wind head */}
            <circle cx={windLine.x2} cy={windLine.y2} r="3" fill="var(--primary)" className="animate-pulse-glow" />
          </g>

          {/* Stubble burning fires plotted in top-left region */}
          {stubbleFiresActive > 0 && STUBBLE_FIRE_HOTSPOTS.map((fire, idx) => {
            // Mapping lat/lng coordinates roughly to SVG canvas
            // Lat range: 29.0 to 31.8 -> Map to Y: 140 to 20
            // Lng range: 74.8 to 77.0 -> Map to X: 20 to 120
            const x = 20 + ((fire.lng - 74.8) / 2.2) * 100;
            const y = 140 - ((fire.lat - 29.0) / 2.8) * 120;

            return (
              <g key={fire.id} style={{ cursor: 'pointer' }}>
                <title>{`${fire.name}: ${fire.count} fires active (${fire.intensity} intensity)`}</title>
                {/* Glow ring */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={fire.intensity === 'High' ? '8' : '5'} 
                  fill="rgba(239, 68, 68, 0.15)" 
                  className="animate-pulse-glow" 
                  style={{ color: '#ef4444' }}
                />
                {/* Fire dot core */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r="3.5" 
                  fill="#ef4444" 
                  className="animate-fire"
                />
              </g>
            );
          })}

          {/* CPCB Monitoring Stations plotted in Delhi region */}
          {MONITORING_STATIONS.map((station) => {
            // Lat range: 28.3 to 29.1 -> Map to Y: 180 to 70
            // Lng range: 76.5 to 77.8 -> Map to X: 110 to 260
            const x = 110 + ((station.lng - 76.5) / 1.3) * 150;
            const y = 180 - ((station.lat - 28.3) / 0.8) * 110;
            
            const isSelected = selectedStationId === station.id;

            return (
              <g 
                key={station.id} 
                onClick={() => onSelectStation(station.id)}
                style={{ cursor: 'pointer' }}
              >
                <title>{`${station.name} Station`}</title>
                {/* Selection indicator */}
                {isSelected && (
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="12" 
                    fill="transparent" 
                    stroke="var(--primary)" 
                    strokeWidth="1.5" 
                    strokeDasharray="3,2"
                  />
                )}
                {/* Glowing ring */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r="6.5" 
                  fill={isSelected ? 'var(--primary-glow)' : 'rgba(255,255,255,0.05)'} 
                  stroke={isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="1.5"
                  style={{ transition: 'all 0.3s ease' }}
                />
                {/* Center point */}
                <circle cx={x} cy={y} r="2.5" fill={isSelected ? 'var(--primary)' : 'var(--text-secondary)'} />
                
                {/* Label text */}
                <text 
                  x={x + 9} 
                  y={y + 3} 
                  fill={isSelected ? 'var(--primary)' : 'var(--text-muted)'} 
                  fontSize="5.5" 
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {station.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live Vector Widget overlay */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(10, 15, 30, 0.85)',
          border: '1px solid var(--border-card)',
          borderRadius: '8px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.75rem'
        }}>
          <Wind size={16} style={{ color: 'var(--primary)' }} />
          <div>
            <div style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
              Wind: {windDirection} ({windSpeed} km/h)
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
              {windDirection === 'West' || windDirection === 'North' ? 'Transporting stubble smoke' : 'Dispersion stable'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
