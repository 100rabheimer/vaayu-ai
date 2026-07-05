import React, { useState, useEffect } from 'react';
import ViewportSwitcher from './views/ViewportSwitcher';
import CitizenPortal from './views/CitizenPortal';
import PolicyDashboard from './views/PolicyDashboard';
import { generateLiveMetrics } from './services/simulationEngine';
import { fetchLiveAqiData } from './services/apiService';
import { Smartphone, Monitor, Leaf, Wind, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import './index.css';

// Dynamic API Base Route mapping
const API_BASE = window.location.origin.includes('5173') ? 'http://localhost:5000' : '';

function App() {
  // View mode switcher: 'landing', 'citizen', or 'policy'
  const [currentView, setCurrentView] = useState('landing');

  // Live Ingest Mode vs Policy Sandbox Simulation Mode
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Currently focused monitoring CPCB station ID
  const [selectedStationId, setSelectedStationId] = useState('anand-vihar');

  // Shared Crowdsourced Incidents State (synced with Node.js Express backend)
  const [incidents, setIncidents] = useState([]);

  // Active Policy Sandbox state
  const [interventions, setInterventions] = useState({
    oddEven: false,
    constructionHalt: false,
    industrialRestriction: false,
    stubbleEnforcement: false,
    firecrackerBan: true
  });

  // Calculate live CPCB metrics dynamically on state change
  const [liveMetrics, setLiveMetrics] = useState(() => 
    generateLiveMetrics(selectedStationId, 0, interventions)
  );

  // Sync incidents list from backend database on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/incidents`)
      .then(res => {
        if (!res.ok) throw new Error('Database server responded with error status');
        return res.json();
      })
      .then(data => {
        setIncidents(data);
      })
      .catch(err => {
        console.warn('Backend database not reachable. Falling back to local mock data.', err);
        setIncidents([
          { id: 1, type: 'Garbage Burning', area: 'Anand Vihar', desc: 'Heavy smoke plume near pocket 3 park due to trash burning.', time: '12 mins ago', status: 'pending' },
          { id: 2, type: 'Construction Dust', area: 'Noida Sector 18', desc: 'Uncovered sand piling at local commercial complex site.', time: '28 mins ago', status: 'pending' },
          { id: 3, type: 'Vehicle Idling', area: 'Rajiv Chowk', desc: 'Multiple tour buses idling with ACs on for over an hour near gate 2.', time: '1 hour ago', status: 'resolved' }
        ]);
      });
  }, []);

  // Recalculate metrics whenever station, policy, or mode changes
  useEffect(() => {
    let active = true;

    if (isLiveMode) {
      // Ingest live data from OpenAQ API
      fetchLiveAqiData(selectedStationId).then(data => {
        if (active) {
          setLiveMetrics(data);
        }
      });
    } else {
      // Run the sandbox simulation logic
      const updated = generateLiveMetrics(selectedStationId, 0, interventions);
      setLiveMetrics(updated);
    }

    return () => {
      active = false;
    };
  }, [selectedStationId, interventions, isLiveMode]);

  // Ambient floating background lights (atmospheric wind feel)
  useEffect(() => {
    gsap.to('.ambient-blob-1', {
      x: 'random(-120, 120)',
      y: 'random(-80, 80)',
      scale: 'random(0.9, 1.4)',
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    gsap.to('.ambient-blob-2', {
      x: 'random(-100, 100)',
      y: 'random(-120, 120)',
      scale: 'random(0.8, 1.3)',
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    gsap.to('.ambient-blob-3', {
      x: 'random(-80, 80)',
      y: 'random(-100, 100)',
      scale: 'random(0.7, 1.5)',
      duration: 14,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);

  // GSAP entrance staggers for the landing portal hub page
  useEffect(() => {
    if (currentView === 'landing') {
      gsap.fromTo('.landing-fade-in',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [currentView]);

  // Dispatch POST to Node.js backend when a citizen reports a hazard
  const handleAddIncident = (newIncident) => {
    fetch(`${API_BASE}/api/incidents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newIncident)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to post incident to server');
        return res.json();
      })
      .then(savedInc => {
        setIncidents(prev => [savedInc, ...prev]);
      })
      .catch(err => {
        console.warn('Database server offline. Falling back to local cache.', err);
        setIncidents(prev => [newIncident, ...prev]);
      });
  };

  // Dispatch PUT to Node.js backend to mark report as resolved
  const handleResolveIncident = (id) => {
    fetch(`${API_BASE}/api/incidents/${id}/resolve`, {
      method: 'PUT'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update resolution status');
        return res.json();
      })
      .then(updatedInc => {
        setIncidents(prev => prev.map(inc => inc.id === updatedInc.id ? updatedInc : inc));
      })
      .catch(err => {
        console.warn('Database server offline. Performing local fallback resolve.', err);
        setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'resolved' } : inc));
      });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
      
      {/* Ambient background particles/blobs */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="ambient-blob-1" style={{ position: 'absolute', top: '10%', left: '15%', width: '380px', height: '380px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.07)', filter: 'blur(90px)' }}></div>
        <div className="ambient-blob-2" style={{ position: 'absolute', bottom: '15%', right: '20%', width: '420px', height: '420px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.05)', filter: 'blur(100px)' }}></div>
        <div className="ambient-blob-3" style={{ position: 'absolute', top: '40%', left: '45%', width: '320px', height: '320px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.03)', filter: 'blur(80px)' }}></div>
      </div>

      {currentView === 'landing' ? (
        /* INTERACTIVE WELCOME LANDING PORTAL HUB */
        <div style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: 'var(--text-primary)',
          textAlign: 'center',
          maxWidth: '1000px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Logo Brand Header */}
          <div className="landing-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf style={{ color: 'var(--aqi-good)', filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))' }} size={42} />
              <Wind style={{ 
                color: 'var(--primary)', 
                position: 'absolute', 
                bottom: '-2px', 
                right: '-4px', 
                filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.5))' 
              }} size={22} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', margin: 0 }}>
              Vaayu<span style={{ color: 'var(--primary)' }}>AI</span>
            </h1>
          </div>

          <h2 className="landing-fade-in" style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            maxWidth: '650px',
            lineHeight: '1.3',
            color: 'var(--text-secondary)',
            marginBottom: '10px'
          }}>
            Delhi-NCR's AI-Powered Pollution Sentinel
          </h2>
          
          <p className="landing-fade-in" style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            maxWidth: '580px',
            lineHeight: '1.6',
            marginBottom: '40px'
          }}>
            Breathe clean with hyperlocal route planning or simulate GRAP policy restrictions to visualize air quality dispersion in real-time.
          </p>

          {/* Cards Hub Selector Grid */}
          <div className="landing-fade-in" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            width: '100%',
            marginBottom: '30px'
          }}>
            
            {/* Card A: Citizen Portal */}
            <div 
              className="glass-panel" 
              style={{
                padding: '30px 24px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                border: '1px solid var(--border-card)',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentView('citizen')}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-card)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  marginBottom: '20px'
                }}>
                  <Smartphone size={24} />
                </div>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '10px' }}>
                  Citizen Safe-Commute App
                </h3>
                
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
                  Navigate Delhi-NCR securely using our clean-air route planner that avoids micro-pollution hotspots.
                </p>

                <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.8', margin: 0 }}>
                  <li>Dynamic Haversine clean eco routing</li>
                  <li>Low-cost community IoT sensor feeds</li>
                  <li>Crowdsourced trash/burning report forms</li>
                  <li>Prevention statistics & Eco-Savings logs</li>
                </ul>
              </div>

              <button style={{
                marginTop: '24px',
                padding: '12px',
                backgroundColor: 'var(--primary-glow)',
                color: 'var(--primary)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.85rem',
                textAlign: 'center'
              }}>
                Launch Commuter App
              </button>
            </div>

            {/* Card B: Policy Command Center */}
            <div 
              className="glass-panel" 
              style={{
                padding: '30px 24px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                border: '1px solid var(--border-card)',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentView('policy')}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--aqi-good)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-card)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--aqi-good)',
                  marginBottom: '20px'
                }}>
                  <Monitor size={24} />
                </div>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '10px' }}>
                  Policy Command Center
                </h3>
                
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
                  Simulate emergency GRAP restrictions in a sandboxed scenario engine to forecast pollutant dispersion curves.
                </p>

                <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.8', margin: 0 }}>
                  <li>Odd-Even & industry halt sandbox toggles</li>
                  <li>Mitigation breakdowns (PM2.5, PM10, NOx)</li>
                  <li>NASA satellite active crop fire tracks</li>
                  <li>72-hour forecast & 6-month seasonal trends</li>
                </ul>
              </div>

              <button style={{
                marginTop: '24px',
                padding: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--aqi-good)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.85rem',
                textAlign: 'center'
              }}>
                Enter Command Control
              </button>
            </div>

          </div>

          <div className="landing-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Sparkles size={12} style={{ color: '#fbbf24' }} />
            <span>PWA Enabled: pin to home screen for mobile usage.</span>
          </div>

        </div>
      ) : (
        /* PORTALS APPLICATION VIEW */
        <>
          {/* Top Viewport Header Switcher (incorporating Live/Sandbox mode) */}
          <ViewportSwitcher 
            currentView={currentView}
            onViewChange={setCurrentView}
            isLiveMode={isLiveMode}
            onLiveModeToggle={setIsLiveMode}
          />

          {/* Main View Port Content */}
          <main style={{ flexGrow: 1, display: 'flex', width: '100%' }}>
            {currentView === 'citizen' ? (
              <CitizenPortal 
                stationId={selectedStationId}
                onStationChange={setSelectedStationId}
                metrics={liveMetrics}
                incidents={incidents}
                onAddIncident={handleAddIncident}
              />
            ) : (
              <PolicyDashboard 
                stationId={selectedStationId}
                onStationChange={setSelectedStationId}
                interventions={interventions}
                onInterventionChange={setInterventions}
                metrics={{
                  ...liveMetrics,
                  isLiveMode
                }}
                incidents={incidents}
                onResolveIncident={handleResolveIncident}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
