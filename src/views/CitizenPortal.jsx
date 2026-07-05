import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AqiGauge from '../components/AqiGauge';
import PollutantGrid from '../components/PollutantGrid';
import RoutePlanner from '../components/RoutePlanner';
import StationSearch from '../components/StationSearch';
import { MONITORING_STATIONS } from '../services/simulationEngine';
import { MapPin, Thermometer, Wind, Home, Route, Activity, Sparkles, Award, Radio, AlertTriangle, Send, Check, X } from 'lucide-react';
import { gsap } from 'gsap';

export default function CitizenPortal({ stationId, onStationChange, metrics, incidents, onAddIncident }) {
  // Mobile app sub-navigation tab: 'home' (dashboard), 'route' (safe routing), 'savings' (exposure history)
  const [activeTab, setActiveTab] = useState('home');

  // Local report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('Garbage Burning');
  const [reportDesc, setReportDesc] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Helper to get clean station name
  const getCleanStationName = () => {
    const station = MONITORING_STATIONS.find(s => s.id === stationId);
    return station ? station.name.split(' [')[0] : 'Anand Vihar';
  };
  const cleanStationName = getCleanStationName();

  // Slide up card elements in phone view on tab switch or report modal toggle
  useEffect(() => {
    gsap.fromTo('.glass-panel, .aqi-gauge-card, svg, button',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.02, ease: 'sine.out', clearProps: 'transform,opacity' }
    );
  }, [activeTab, stationId]);

  // Handle local incident report submission
  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reportDesc.trim()) return;

    const newReport = {
      id: Date.now(),
      type: reportType,
      area: cleanStationName,
      desc: reportDesc,
      time: 'Just now',
      status: 'pending'
    };

    onAddIncident(newReport);
    setReportDesc('');
    setShowReportModal(false);
    
    // Show success notification toast
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  // Simulated Weekly PM2.5 Savings history
  const savingsData = [
    { day: 'Mon', actual: 45, baseline: 85, saved: 40 },
    { day: 'Tue', actual: 50, baseline: 95, saved: 45 },
    { day: 'Wed', actual: 38, baseline: 80, saved: 42 },
    { day: 'Thu', actual: 70, baseline: 120, saved: 50 },
    { day: 'Fri', actual: 60, baseline: 110, saved: 50 },
    { day: 'Sat', actual: 30, baseline: 65, saved: 35 },
    { day: 'Sun', actual: 35, baseline: 75, saved: 40 }
  ];

  const totalSaved = savingsData.reduce((acc, curr) => acc + curr.saved, 0);

  // Generate simulated nearby IoT sensors values (adds ± 15% variation around the CPCB monitor readings)
  const iotSensors = [
    { name: `${cleanStationName} Enclave Sector 2`, pm25: Math.round(metrics.pollutants.pm25 * 0.95), status: 'Fair' },
    { name: `Apex Society Green Belt near ${cleanStationName}`, pm25: Math.round(metrics.pollutants.pm25 * 0.82), status: 'Clean' },
    { name: `Metro Crossing Junction ${cleanStationName}`, pm25: Math.round(metrics.pollutants.pm25 * 1.14), status: 'Hotspot' }
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '20px',
      width: '100%',
      position: 'relative'
    }}>
      {/* Mobile Phone Shell Frame */}
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '430px',
        height: '780px',
        borderRadius: '40px',
        border: '8px solid #1e293b',
        backgroundColor: '#090d16',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        padding: 0
      }}>
        
        {/* Mock OS Status Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.7rem',
          color: 'var(--text-secondary)',
          padding: '12px 24px 6px 24px',
          backgroundColor: 'rgba(9, 13, 22, 0.9)',
          fontWeight: '700',
          letterSpacing: '0.025em',
          borderBottom: '1px solid rgba(255,255,255,0.02)',
          zIndex: 10
        }}>
          <span>09:41 AM</span>
          <div style={{ width: '80px', height: '18px', backgroundColor: '#1e293b', borderRadius: '0 0 10px 10px', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}></div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span>5G</span>
            <div style={{ width: '15px', height: '8px', border: '1px solid var(--text-secondary)', borderRadius: '2px', padding: '1px', display: 'flex' }}>
              <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--aqi-good)' }}></div>
            </div>
          </div>
        </div>

        {/* Brand App Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-card)'
        }}>
          <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            VaayuAI Mobile
          </span>
          <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', fontWeight: '700' }}>
            Live Feed
          </span>
        </div>

        {/* Scrollable Container for Tab Contents */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          paddingBottom: '80px' 
        }}>
          {/* Hyperlocal Station Search Selector */}
          {activeTab === 'home' && (
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '6px',
                fontWeight: '700'
              }}>
                <MapPin size={12} style={{ color: 'var(--primary)' }} />
                CPCB MONITORING STATION
              </label>
              
              <StationSearch 
                selectedStationId={stationId}
                onSelectStation={onStationChange}
              />
            </div>
          )}

          {/* Render Tab 1: HOME (Dashboard + IoT Sensors) */}
          {activeTab === 'home' && (
            <>
              {/* Quick Weather strip */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--border-card)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Thermometer size={14} style={{ color: '#f59e0b' }} />
                  <span>Temp: {metrics.weather.temperature}°C</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Wind size={14} style={{ color: 'var(--primary)' }} />
                  <span>Wind: {metrics.weather.windDirection} ({metrics.weather.windSpeed} km/h)</span>
                </div>
              </div>

              {/* Circular Gauge */}
              <AqiGauge 
                aqi={metrics.aqi}
                category={metrics.category}
                colorClass={metrics.colorClass}
                healthAdvice={metrics.healthAdvice}
              />

              {/* WHO Guidelines */}
              <PollutantGrid pollutants={metrics.pollutants} />

              {/* Nearby IoT Citizen Sensors */}
              <div className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Radio size={14} className="animate-pulse-glow" style={{ color: 'var(--primary)' }} />
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>Community IoT Sensors</h4>
                  </div>
                  
                  {/* Report Button */}
                  <button
                    onClick={() => setShowReportModal(true)}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '6px',
                      color: '#ef4444',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'var(--transition-smooth)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                  >
                    <AlertTriangle size={10} />
                    Report Hazard
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {iotSensors.map((sensor, idx) => {
                    const isHigh = sensor.status === 'Hotspot';
                    const isClean = sensor.status === 'Clean';
                    return (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 10px',
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-card)',
                        borderRadius: '6px'
                      }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>{sensor.name}</div>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Low-cost citizen station</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: '800',
                            color: isClean ? 'var(--aqi-good)' : isHigh ? '#ef4444' : 'var(--primary)'
                          }}>
                            {sensor.pm25} µg/m³
                          </span>
                          <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            PM2.5 {sensor.status}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Render Tab 2: SAFE COMMUTE (Routing Planner) */}
          {activeTab === 'route' && (
            <RoutePlanner currentAqiMultiplier={metrics.aqi} />
          )}

          {/* Render Tab 3: SAVINGS (Weekly Exposure Tracker) */}
          {activeTab === 'savings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel animate-pulse-glow" style={{
                textAlign: 'center',
                borderColor: 'var(--aqi-good)',
                backgroundColor: 'rgba(16, 185, 129, 0.03)',
                padding: '20px'
              }}>
                <Award size={36} style={{ color: 'var(--aqi-good)', margin: '0 auto 10px auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>Weekly Exposure Savings</h4>
                <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--aqi-good)', margin: '6px 0' }}>
                  {totalSaved} µg
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Total particulate inhalation prevented by using VaayuAI clean routes!
                </p>
                
                <div style={{
                  marginTop: '12px',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  padding: '6px 10px',
                  borderRadius: '6px'
                }}>
                  <Sparkles size={12} style={{ color: '#fbbf24' }} />
                  Equivalent to avoiding smoking 3.5 cigarettes!
                </div>
              </div>

              <div className="glass-panel">
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>Inhaled PM2.5 Exposure Compare (Daily)</h4>
                <div style={{ width: '100%', height: '180px', fontSize: '0.7rem' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={savingsData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                      <XAxis dataKey="day" stroke="var(--text-muted)" />
                      <YAxis stroke="var(--text-muted)" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: 'var(--border-card)', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '0.75rem' }}
                      />
                      <Bar dataKey="baseline" name="Highway Commute Inhale" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.3} />
                      <Bar dataKey="actual" name="VaayuAI Route Commute Inhale" fill="var(--aqi-good)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom App Navigation Tab Bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '66px',
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid var(--border-card)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 100,
          paddingBottom: '6px' 
        }}>
          <button
            onClick={() => setActiveTab('home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.65rem',
              fontWeight: '700',
              color: activeTab === 'home' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Home size={20} />
            Home
          </button>

          <button
            onClick={() => setActiveTab('route')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.65rem',
              fontWeight: '700',
              color: activeTab === 'route' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Route size={20} />
            Safe Route
          </button>

          <button
            onClick={() => setActiveTab('savings')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.65rem',
              fontWeight: '700',
              color: activeTab === 'savings' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Activity size={20} />
            Eco-Savings
          </button>
        </div>

      </div>

      {/* ABSOLUTE MODAL: Crowdsourced Report Form inside Citizen App */}
      {showReportModal && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          borderRadius: '40px' // Keeps it rounded inside the phone bezel
        }}>
          <div className="glass-panel" style={{
            width: '90%',
            maxWidth: '360px',
            backgroundColor: '#0f172a',
            borderColor: 'var(--border-card-hover)',
            borderRadius: '16px',
            padding: '20px',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowReportModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', marginBottom: '4px' }}>
                <AlertTriangle size={16} />
                <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>Report Hazard</span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>Crowdsource Local Source</h4>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Tag a pollution incident in {cleanStationName}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReport} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '700' }}>
                  SOURCE HAZARD TYPE
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#111827',
                    border: '1px solid var(--border-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                >
                  <option value="Garbage Burning">🔥 Garbage Burning</option>
                  <option value="Construction Dust">🏗️ Uncontained Construction Dust</option>
                  <option value="Vehicle Idling">🚌 Heavy Vehicle Idling</option>
                  <option value="Industrial Smoke">🏭 Illegal Boiler Smoke</option>
                  <option value="Road Dust">💨 Severe Mechanical Road Dust</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '700' }}>
                  DETAILS / DESCRIPTION
                </label>
                <textarea
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  required
                  placeholder="Describe location details or severity..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#111827',
                    border: '1px solid var(--border-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '6px'
                }}
              >
                <Send size={12} />
                Submit Incident Report
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOAT TOAST: Crowdsourced Report Success Confirmation */}
      {showSuccessToast && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--aqi-good)',
          color: '#090d16',
          padding: '10px 18px',
          borderRadius: '24px',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          fontWeight: '800',
          zIndex: 2000,
          animation: 'fade-in 0.3s ease-out'
        }}>
          <Check size={14} strokeWidth={3} />
          Report Shared with Command Center!
        </div>
      )}
    </div>
  );
}
