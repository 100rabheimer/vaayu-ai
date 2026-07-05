import React from 'react';
import { Smartphone, Monitor, Leaf, Wind, Sliders } from 'lucide-react';

export default function ViewportSwitcher({ currentView, onViewChange, isLiveMode, onLiveModeToggle }) {
  return (
    <header style={{
      width: '100%',
      padding: '12px 24px',
      backgroundColor: 'rgba(9, 13, 22, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-card)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Left: Brand logo (Clickable to go back to Hub) */}
      <div 
        onClick={() => onViewChange('landing')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{ position: 'relative', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Leaf style={{ color: 'var(--aqi-good)', filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))' }} size={22} />
          <Wind style={{ 
            color: 'var(--primary)', 
            position: 'absolute', 
            bottom: '-2px', 
            right: '-4px', 
            filter: 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.4))' 
          }} size={14} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '900', lineHeight: 1, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Vaayu<span style={{ color: 'var(--primary)' }}>AI</span>
          </h1>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
            Pollution Source & Forecast Control
          </span>
        </div>
      </div>

      {/* Center: Mode Switcher (Live vs Sandbox) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#111827',
        padding: '3px',
        borderRadius: '24px',
        border: '1px solid var(--border-card)'
      }}>
        {/* Sandbox Mode */}
        <button
          onClick={() => onLiveModeToggle(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: '700',
            cursor: 'pointer',
            backgroundColor: !isLiveMode ? '#1e293b' : 'transparent',
            color: !isLiveMode ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'var(--transition-smooth)'
          }}
        >
          <Sliders size={12} />
          SANDBOX SIMULATOR
        </button>

        {/* Live Mode */}
        <button
          onClick={() => onLiveModeToggle(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: '700',
            cursor: 'pointer',
            backgroundColor: isLiveMode ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
            color: isLiveMode ? 'var(--aqi-good)' : 'var(--text-muted)',
            transition: 'var(--transition-smooth)'
          }}
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isLiveMode ? 'var(--aqi-good)' : 'var(--text-muted)',
            display: 'inline-block',
            boxShadow: isLiveMode ? '0 0 6px var(--aqi-good)' : 'none'
          }}></span>
          LIVE CPCB FEED
        </button>
      </div>

      {/* Right: Switch View Buttons */}
      <div style={{
        display: 'flex',
        backgroundColor: '#111827',
        padding: '4px',
        borderRadius: '10px',
        border: '1px solid var(--border-card)'
      }}>
        {/* Mobile Citizen App */}
        <button
          onClick={() => onViewChange('citizen')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: currentView === 'citizen' ? 'var(--primary-glow)' : 'transparent',
            color: currentView === 'citizen' ? 'var(--primary)' : 'var(--text-secondary)',
            transition: 'var(--transition-smooth)'
          }}
        >
          <Smartphone size={16} />
          Citizen App
        </button>

        {/* Desktop Policy Dashboard */}
        <button
          onClick={() => onViewChange('policy')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: currentView === 'policy' ? 'var(--primary-glow)' : 'transparent',
            color: currentView === 'policy' ? 'var(--primary)' : 'var(--text-secondary)',
            transition: 'var(--transition-smooth)'
          }}
        >
          <Monitor size={16} />
          Policy Dashboard
        </button>
      </div>
    </header>
  );
}
