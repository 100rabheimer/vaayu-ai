import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function AqiGauge({ aqi, category, colorClass, healthAdvice }) {
  const [displayAqi, setDisplayAqi] = useState(0);
  const strokeRef = useRef(null);
  const countRef = useRef({ val: 0 });

  // Compute circular stroke parameters
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, (aqi / 500) * 100);
  const targetDashoffset = circumference - (percentage / 100) * circumference;

  // Map color class to direct HEX values for SVG filter dropshadow glows
  const colorMap = {
    'aqi-good': '#10b981',
    'aqi-satisfactory': '#84cc16',
    'aqi-moderate': '#eab308',
    'aqi-poor': '#f97316',
    'aqi-very-poor': '#ef4444',
    'aqi-severe': '#7c3aed',
    'aqi-hazardous': '#881337'
  };
  const activeColor = colorMap[colorClass] || '#10b981';

  useEffect(() => {
    // 1. Animate circular SVG track dashoffset using GSAP for a liquid filling feel
    gsap.fromTo(strokeRef.current,
      { strokeDashoffset: circumference },
      { strokeDashoffset: targetDashoffset, duration: 1.6, ease: 'power3.out' }
    );

    // 2. Animate count-up numeric AQI value
    gsap.to(countRef.current, {
      val: aqi,
      duration: 1.6,
      ease: 'power3.out',
      onUpdate: () => {
        setDisplayAqi(Math.round(countRef.current.val));
      }
    });
  }, [aqi, targetDashoffset]);

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative',
      minWidth: '280px'
    }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--text-secondary)' }}>
        Real-Time AQI Index
      </h3>
      
      {/* Circular SVG Gauge */}
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            ref={strokeRef}
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke={activeColor}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 10px ${activeColor}55)`,
              transition: 'stroke 0.5s ease'
            }}
          />
        </svg>
        
        {/* Center AQI value readout */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800', 
            lineHeight: '1', 
            color: activeColor,
            textShadow: `0 0 20px ${activeColor}33`
          }}>
            {displayAqi}
          </span>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: '4px',
            color: 'var(--text-secondary)'
          }}>
            AQI
          </span>
        </div>
      </div>

      {/* Category Tag */}
      <div style={{
        marginTop: '20px',
        padding: '6px 16px',
        borderRadius: '20px',
        fontWeight: '700',
        fontSize: '0.9rem',
        letterSpacing: '0.025em',
        backgroundColor: `${activeColor}15`,
        color: activeColor,
        border: `1px solid ${activeColor}30`,
        boxShadow: `0 0 15px ${activeColor}10`,
        transition: 'all 0.5s ease'
      }}>
        {category}
      </div>

      {/* Health Advisory Section */}
      <p style={{
        marginTop: '16px',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.5',
        maxWidth: '240px',
        minHeight: '54px'
      }}>
        {healthAdvice}
      </p>
    </div>
  );
}
