import React, { useState, useEffect, useRef } from 'react';
import { Route, Shield, AlertTriangle, Clock, MapPin, Search, ArrowRightLeft, Sparkles } from 'lucide-react';
import { MONITORING_STATIONS, generateLiveMetrics } from '../services/simulationEngine';

// Haversine formula to calculate distance in km between two lat/lng coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; 
  return d;
}

export default function RoutePlanner({ currentAqiMultiplier }) {
  // Select default stations (e.g. Rajiv Chowk to Noida Sector 18)
  const [fromStation, setFromStation] = useState(MONITORING_STATIONS.find(s => s.id === 'rajiv-chowk') || MONITORING_STATIONS[0]);
  const [toStation, setToStation] = useState(MONITORING_STATIONS.find(s => s.id === 'noida-sector-18') || MONITORING_STATIONS[1]);
  
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);
  const [profile, setProfile] = useState('runner'); // runner, asthmatic, elderly, healthy

  const fromRef = useRef(null);
  const toRef = useRef(null);

  // Sync query strings with selected stations on load
  useEffect(() => {
    setFromQuery(fromStation.name.split(' [')[0]);
  }, [fromStation]);

  useEffect(() => {
    setToQuery(toStation.name.split(' [')[0]);
  }, [toStation]);

  // Handle click outside to close suggestion dropdown panels
  useEffect(() => {
    const handleOutside = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) setShowFromList(false);
      if (toRef.current && !toRef.current.contains(e.target)) setShowToList(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Filter suggestion list helpers
  const getFilteredStations = (query) => {
    const term = query.toLowerCase().trim();
    if (term === '' || MONITORING_STATIONS.some(s => s.name.split(' [')[0].toLowerCase() === term)) {
      return MONITORING_STATIONS;
    }
    return MONITORING_STATIONS.filter(s => s.name.toLowerCase().includes(term));
  };

  const fromSuggestions = getFilteredStations(fromQuery);
  const toSuggestions = getFilteredStations(toQuery);

  // Swap Source & Destination
  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  // Math Calculations: Distance, Times and AQI exposures
  const rawDistance = calculateDistance(fromStation.lat, fromStation.lng, toStation.lat, toStation.lng);
  // Ensure a minimum distance of 1.5 km to prevent zero overlaps
  const distance = Math.max(1.5, Number(rawDistance.toFixed(1)));
  
  // Speed model: highway is faster (approx 45 km/h), green corridor slightly slower (approx 36 km/h) due to local turns
  const speedHighway = 45;
  const speedGreen = 36;
  const timeHighwayMins = Math.round((distance / speedHighway) * 60);
  const timeGreenMins = Math.round(((distance * 1.15) / speedGreen) * 60); // 15% longer detour

  // AQI calculations: dynamic based on live metrics at both source and destination
  const sourceMetrics = generateLiveMetrics(fromStation.id, 0, {});
  const destMetrics = generateLiveMetrics(toStation.id, 0, {});
  const avgRouteAqi = (sourceMetrics.aqi + destMetrics.aqi) / 2;

  const aqiHighway = Math.round(avgRouteAqi * 1.15); // Traffic spike
  const aqiGreen = Math.round(avgRouteAqi * 0.65); // Greenery shield discount

  // Visual Health Shield Protection Index
  const shieldGreen = Math.max(60, Math.min(98, Math.round(100 - (aqiGreen / 5))));
  const shieldHighway = Math.max(5, Math.min(55, Math.round(100 - (aqiHighway / 4))));

  // VaayuAI Smart Route Suggestion based on Traffic (commute time) and AQI exposure
  const getSmartRecommendation = () => {
    const aqiSaved = aqiHighway - aqiGreen;
    const aqiSavedPercent = Math.round((1 - aqiGreen / aqiHighway) * 100);
    const timeOverhead = timeGreenMins - timeHighwayMins;

    if (avgRouteAqi > 350) {
      return {
        title: 'VaayuAI Emergency Suggestion',
        text: 'Severe Air Quality along route! Commuting is highly discouraged. If urgent, choose the Green Corridor to protect your respiratory system.',
        color: 'var(--aqi-very-poor)',
        bgColor: 'rgba(239, 68, 68, 0.08)',
        borderColor: 'rgba(239, 68, 68, 0.2)'
      };
    }

    // If Green Corridor saves a lot of AQI and time overhead is reasonable (e.g. less than 15 mins)
    if (aqiSaved > 40 && timeOverhead <= 15) {
      return {
        title: 'VaayuAI Recommends: Green Corridor',
        text: `Green Corridor is the best choice. It saves ${aqiSavedPercent}% AQI exposure (${aqiSaved} points cleaner) with only a minor ${timeOverhead}-minute travel delay.`,
        color: 'var(--aqi-good)',
        bgColor: 'rgba(16, 185, 129, 0.08)',
        borderColor: 'rgba(16, 185, 129, 0.2)'
      };
    }

    // Default time-efficient suggestion if AQI is clean or time delay is too large
    return {
      title: 'VaayuAI Recommends: Expressway',
      text: `Expressway is recommended. Commuting via highway is ${Math.abs(timeOverhead)} minutes faster, and local AQI differences are negligible today.`,
      color: 'var(--primary)',
      bgColor: 'rgba(56, 189, 248, 0.08)',
      borderColor: 'rgba(56, 189, 248, 0.2)'
    };
  };

  const smartRec = getSmartRecommendation();

  // Tailored health warnings
  const getProfileAdvice = () => {
    switch (profile) {
      case 'asthmatic':
        return {
          title: 'Asthma Advisory',
          text: `Route AQI averages ${aqiHighway} (Highway). Asthmatics should prefer the Green Corridor (${aqiGreen}), keep vehicle windows rolled up, and carry rescue inhalers.`,
          severity: 'critical'
        };
      case 'runner':
        return {
          title: 'Runner Advisory',
          text: `Do not jog along high-traffic expressways (AQI ${aqiHighway}). The Green Corridor route is significantly cleaner (${aqiGreen}), ideal for light aerobic activities.`,
          severity: 'warning'
        };
      case 'elderly':
        return {
          title: 'Sensitive Health Alert',
          text: `High exposure route (AQI ${aqiHighway}) presents cardiovascular loading. Sensitive individuals are advised to select the Green Corridor route.`,
          severity: 'warning'
        };
      case 'healthy':
      default:
        return {
          title: 'Clean Commute Advice',
          text: `Choosing the Green Corridor reduces your particulate exposure by ${Math.round((1 - aqiGreen/aqiHighway) * 100)}% for this ${distance} km trip.`,
          severity: 'info'
        };
    }
  };

  const advice = getProfileAdvice();

  // Bounding box mapping for dynamic SVG rendering
  // Delhi-NCR bounding boxes coordinates: Lat 28.37 to 28.75, Lng 77.03 to 77.45
  const mapCoordToSvg = (lat, lng) => {
    const minLat = 28.35, maxLat = 28.75;
    const minLng = 77.00, maxLng = 77.45;
    
    // Scale X to 15 - 185 (width = 200)
    const x = 15 + ((lng - minLng) / (maxLng - minLng)) * 170;
    // Scale Y to 15 - 105 (height = 120)
    const y = 105 - ((lat - minLat) / (maxLat - minLat)) * 90;
    
    // Clamp values to keep nodes inside canvas
    return {
      x: Math.max(15, Math.min(185, x)),
      y: Math.max(15, Math.min(105, y))
    };
  };

  const startPt = mapCoordToSvg(fromStation.lat, fromStation.lng);
  const endPt = mapCoordToSvg(toStation.lat, toStation.lng);

  // Compute control points for SVG quadratic curves
  // Highway bends slightly upward, Green Corridor bends downward
  const ctrlX = (startPt.x + endPt.x) / 2;
  const ctrlYHighway = Math.max(10, Math.min(startPt.y, endPt.y) - 25);
  const ctrlYGreen = Math.min(110, Math.max(startPt.y, endPt.y) + 25);

  return (
    <div className="glass-panel" style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Route style={{ color: 'var(--primary)' }} />
        <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Custom Route Exposure Planner</h3>
      </div>

      {/* Dynamic Source & Destination Autocomplete Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', marginBottom: '20px' }}>
        
        {/* Source Input */}
        <div ref={fromRef} style={{ position: 'relative', width: '100%', zIndex: showFromList ? 1000 : 10 }}>
          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '700' }}>
            START POINT (SOURCE)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#111827', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '0 10px', height: '38px' }}>
            <MapPin size={14} style={{ color: 'var(--primary)', marginRight: '6px' }} />
            <input 
              type="text"
              value={fromQuery}
              onChange={(e) => { setFromQuery(e.target.value); setShowFromList(true); }}
              onFocus={() => setShowFromList(true)}
              placeholder="Search source location..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%', fontWeight: '600' }}
            />
          </div>
          
          {/* Source suggestion popup */}
          {showFromList && fromSuggestions.length > 0 && (
            <div className="glass-panel" style={{ position: 'absolute', top: '42px', left: 0, right: 0, zIndex: 1200, padding: '6px 0', borderRadius: '10px', maxHeight: '180px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
              {fromSuggestions.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setFromStation(s); setShowFromList(false); }}
                  style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', textAlign: 'left', color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-glow)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <MapPin size={12} style={{ color: 'var(--primary)' }} />
                  {s.name.split(' [')[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button Overlap Spacer */}
        <button 
          onClick={handleSwap}
          style={{
            position: 'absolute',
            right: '20px',
            top: '40px',
            zIndex: 10,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#1e293b',
            border: '1px solid var(--border-card)',
            color: 'var(--primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(180deg)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
        >
          <ArrowRightLeft size={12} style={{ transform: 'rotate(90deg)' }} />
        </button>

        {/* Destination Input */}
        <div ref={toRef} style={{ position: 'relative', width: '100%', zIndex: showToList ? 1000 : 5 }}>
          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '700' }}>
            END POINT (DESTINATION)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#111827', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '0 10px', height: '38px' }}>
            <MapPin size={14} style={{ color: '#f59e0b', marginRight: '6px' }} />
            <input 
              type="text"
              value={toQuery}
              onChange={(e) => { setToQuery(e.target.value); setShowToList(true); }}
              onFocus={() => setShowToList(true)}
              placeholder="Search destination location..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%', fontWeight: '600' }}
            />
          </div>
          
          {/* Destination suggestion popup */}
          {showToList && toSuggestions.length > 0 && (
            <div className="glass-panel" style={{ position: 'absolute', top: '42px', left: 0, right: 0, zIndex: 1200, padding: '6px 0', borderRadius: '10px', maxHeight: '180px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
              {toSuggestions.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setToStation(s); setShowToList(false); }}
                  style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', textAlign: 'left', color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-glow)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <MapPin size={12} style={{ color: '#f59e0b' }} />
                  {s.name.split(' [')[0]}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Select Health Profile */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700' }}>
          USER HEALTH PROFILE
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {['runner', 'asthmatic', 'elderly', 'healthy'].map(p => (
            <button
              key={p}
              onClick={() => setProfile(p)}
              style={{
                padding: '6px 2px',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                fontWeight: '700',
                border: '1px solid',
                borderColor: profile === p ? 'var(--primary)' : 'var(--border-card)',
                backgroundColor: profile === p ? 'var(--primary-glow)' : 'transparent',
                color: profile === p ? 'var(--primary)' : 'var(--text-secondary)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Comparisons & Dynamic SVG Map Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        gap: '16px',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        {/* Route comparison list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Green Corridor */}
          <div style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            backgroundColor: 'rgba(16, 185, 129, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={14} style={{ color: 'var(--aqi-good)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>Green Eco Corridor</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}><Clock size={10} /> {timeGreenMins} mins</span>
                <span>• {distance} km</span>
              </div>
              <div style={{ marginTop: '6px' }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--aqi-good)',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  🛡️ {shieldGreen}% Health Shield
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--aqi-good)' }}>{aqiGreen}</div>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>AQI avg</span>
            </div>
          </div>

          {/* Highway */}
          <div style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            backgroundColor: 'rgba(239, 68, 68, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={14} style={{ color: 'var(--aqi-very-poor)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>Expressway Route</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}><Clock size={10} /> {timeHighwayMins} mins</span>
                <span>• {distance} km</span>
              </div>
              <div style={{ marginTop: '6px' }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--aqi-very-poor)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  ⚠️ {shieldHighway}% Health Shield
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--aqi-very-poor)' }}>{aqiHighway}</div>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>AQI avg</span>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive SVG Canvas */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: '12px',
          border: '1px solid var(--border-card)',
          height: '140px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <svg width="100%" height="100%" viewBox="0 0 200 120">
            {/* Background grids */}
            <path d="M 0 30 Q 50 10 100 40 T 200 20" fill="none" stroke="rgba(255,255,255,0.01)" strokeWidth="0.5" />
            <path d="M 0 80 Q 70 100 140 70 T 200 90" fill="none" stroke="rgba(255,255,255,0.01)" strokeWidth="0.5" />
            
            {/* Dynamic Highway Path (Red dashed curve) */}
            <path 
              d={`M ${startPt.x} ${startPt.y} Q ${ctrlX} ${ctrlYHighway} ${endPt.x} ${endPt.y}`} 
              fill="none" 
              stroke="var(--aqi-very-poor)" 
              strokeWidth="2.5" 
              strokeDasharray="4,2" 
            />
            
            {/* Dynamic Green Corridor Path (Green solid glowing curve) */}
            <path 
              d={`M ${startPt.x} ${startPt.y} Q ${ctrlX} ${ctrlYGreen} ${endPt.x} ${endPt.y}`} 
              fill="none" 
              stroke="var(--aqi-good)" 
              strokeWidth="3.5" 
              style={{ filter: 'drop-shadow(0 0 3px rgba(16, 185, 129, 0.4))' }}
            />
            
            {/* Source Pin */}
            <circle cx={startPt.x} cy={startPt.y} r="5.5" fill="var(--primary)" style={{ filter: 'drop-shadow(0 0 4px var(--primary))' }} />
            <circle cx={startPt.x} cy={startPt.y} r="2" fill="#fff" />
            <text x={startPt.x + 8} y={startPt.y + 3} fill="var(--text-secondary)" fontSize="6.5" fontWeight="bold">
              {fromStation.name.split(' [')[0].slice(0, 10)}
            </text>

            {/* Destination Pin */}
            <circle cx={endPt.x} cy={endPt.y} r="5.5" fill="#f59e0b" style={{ filter: 'drop-shadow(0 0 4px #f59e0b)' }} />
            <circle cx={endPt.x} cy={endPt.y} r="2" fill="#fff" />
            <text x={endPt.x + 8} y={endPt.y + 3} fill="var(--text-secondary)" fontSize="6.5" fontWeight="bold">
              {toStation.name.split(' [')[0].slice(0, 10)}
            </text>
          </svg>
        </div>
      </div>

      {/* VaayuAI Smart Route Suggestion Banner */}
      <div style={{
        padding: '12px 14px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        border: '1px solid',
        backgroundColor: smartRec.bgColor,
        borderColor: smartRec.borderColor,
        color: smartRec.color,
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
      }}>
        <div style={{ fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Sparkles size={14} />
          {smartRec.title}
        </div>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          {smartRec.text}
        </div>
      </div>

      {/* Advisory Message */}
      <div style={{
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        border: '1px solid',
        backgroundColor: advice.severity === 'critical' ? 'rgba(239, 68, 68, 0.08)' : advice.severity === 'warning' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(56, 189, 248, 0.08)',
        borderColor: advice.severity === 'critical' ? 'rgba(239, 68, 68, 0.2)' : advice.severity === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)',
        color: advice.severity === 'critical' ? 'var(--aqi-very-poor)' : advice.severity === 'warning' ? '#f59e0b' : 'var(--primary)'
      }}>
        <div style={{ fontWeight: '700', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {advice.severity === 'critical' && <AlertTriangle size={12} />}
          {advice.title}
        </div>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>{advice.text}</div>
      </div>
    </div>
  );
}
