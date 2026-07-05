import React from 'react';

export default function PollutantGrid({ pollutants }) {
  if (!pollutants) return null;

  // Standard safe limits (WHO daily guidelines) for comparison
  const pollutantSpecs = [
    { key: 'pm25', name: 'PM2.5', label: 'Fine Particles', unit: 'µg/m³', limit: 15, desc: 'Combustion particles, crop burning smoke' },
    { key: 'pm10', name: 'PM10', label: 'Coarse Particles', unit: 'µg/m³', limit: 45, desc: 'Road dust, construction dust' },
    { key: 'no2', name: 'NO₂', label: 'Nitrogen Dioxide', unit: 'µg/m³', limit: 25, desc: 'Vehicular emissions, traffic congestion' },
    { key: 'o3', name: 'O₃', label: 'Ozone', unit: 'µg/m³', limit: 100, desc: 'Secondary photochem reaction' },
    { key: 'co', name: 'CO', label: 'Carbon Monoxide', unit: 'mg/m³', limit: 4, desc: 'Incomplete combustion, vehicle exhaust' },
    { key: 'so2', name: 'SO₂', label: 'Sulfur Dioxide', unit: 'µg/m³', limit: 40, desc: 'Coal burning, industrial emissions' }
  ];

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--text-secondary)' }}>
        Key Pollutants Concentration
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '16px',
        width: '100%'
      }}>
        {pollutantSpecs.map(spec => {
          const val = pollutants[spec.key] || 0;
          const ratio = val / spec.limit;
          
          // Determine status color based on limit excess
          let statusColor = 'var(--aqi-good)';
          if (ratio > 5) statusColor = 'var(--aqi-very-poor)';
          else if (ratio > 2) statusColor = 'var(--aqi-poor)';
          else if (ratio > 1) statusColor = 'var(--aqi-moderate)';

          return (
            <div 
              key={spec.key} 
              className="glass-panel" 
              style={{ 
                padding: '16px', 
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `3px solid ${statusColor}`
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{spec.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Limit: {spec.limit}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 12px 0' }}>
                  {spec.label}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {val}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {spec.unit}
                  </span>
                </div>

                {/* Visual Ratio Progress Bar */}
                <div style={{ 
                  height: '4px', 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  borderRadius: '2px', 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (val / (spec.limit * 6)) * 100)}%`,
                    backgroundColor: statusColor,
                    borderRadius: '2px',
                    transition: 'width 1s ease'
                  }} />
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '0.65rem', 
                  marginTop: '4px',
                  color: ratio > 1 ? statusColor : 'var(--text-muted)',
                  fontWeight: '600'
                }}>
                  <span>{ratio <= 1 ? 'Safe' : `${ratio.toFixed(1)}x Limit`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
