import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import ActiveFiresMap from '../components/ActiveFiresMap';
import InterventionSimulator from '../components/InterventionSimulator';
import StationSearch from '../components/StationSearch';
import { generateForecastData, generateSeasonalData, generateAiRecommendations } from '../services/mlForecaster';
import { MONITORING_STATIONS, STUBBLE_FIRE_HOTSPOTS } from '../services/simulationEngine';
import { AlertCircle, Brain, Flame, Info, CheckCircle, FileText, Download, X, Radio } from 'lucide-react';
import { gsap } from 'gsap';

export default function PolicyDashboard({ stationId, onStationChange, interventions, onInterventionChange, metrics, incidents, onResolveIncident }) {
  const [showReport, setShowReport] = useState(false);
  const [chartMode, setChartMode] = useState('hourly'); // 'hourly' vs 'seasonal'
  const selectedStationName = MONITORING_STATIONS.find(s => s.id === stationId)?.name || 'Anand Vihar';
  const cleanStationName = selectedStationName.split(' [')[0];

  // Staggered layout card entrances when data updates
  useEffect(() => {
    gsap.fromTo('.glass-panel', 
      { opacity: 0, y: 15, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out', clearProps: 'transform,opacity' }
    );
  }, [stationId, metrics.isLiveMode]);

  // Generate forecasting comparative datasets
  const forecastData = generateForecastData(stationId, interventions);
  const seasonalData = generateSeasonalData(stationId, interventions);
  const chartData = chartMode === 'hourly' ? forecastData : seasonalData;

  // Calculate dynamic pollutant reduction percentages based on active sandboxed policies
  const getPollutantReductions = () => {
    if (metrics.isLiveMode) {
      return { pm25: 0, pm10: 0, nox: 0, so2: 0 };
    }
    let pm25Red = 0;
    let pm10Red = 0;
    let noxRed = 0;
    let so2Red = 0;

    if (interventions.oddEven) {
      pm25Red += 12;
      pm10Red += 8;
      noxRed += 25;
    }
    if (interventions.constructionHalt) {
      pm25Red += 10;
      pm10Red += 35;
    }
    if (interventions.industrialRestriction) {
      pm25Red += 15;
      pm10Red += 12;
      noxRed += 15;
      so2Red += 30;
    }
    if (interventions.stubbleEnforcement) {
      pm25Red += 20;
      pm10Red += 10;
    }

    return {
      pm25: Math.min(85, pm25Red),
      pm10: Math.min(90, pm10Red),
      nox: Math.min(80, noxRed),
      so2: Math.min(80, so2Red)
    };
  };

  const reductions = getPollutantReductions();

  // 2. Generate AI Recommendations list
  const recommendations = generateAiRecommendations(cleanStationName, metrics, interventions);

  // Recharts Source apportionment colors
  const COLORS = ['#38bdf8', '#818cf8', '#fbbf24', '#f87171'];

  // Calculate simulated mitigation impact
  const getMitigationScore = () => {
    let score = 0;
    if (interventions.oddEven) score += 15;
    if (interventions.constructionHalt) score += 20;
    if (interventions.industrialRestriction) score += 18;
    if (interventions.stubbleEnforcement) score += 25;
    return score;
  };
  const mitigationScore = getMitigationScore();

  // High-fidelity vector PDF compiler (opens printable template for native Save-as-PDF actions)
  const handleDownloadReport = () => {
    try {
      const activePoliciesBadges = Object.entries(interventions)
        .filter(([_, active]) => active)
        .map(([key]) => {
          const label = key === 'oddEven' ? 'Odd-Even Scheme' :
                        key === 'constructionHalt' ? 'Construction Ban' :
                        key === 'industrialRestriction' ? 'Boiler/Booster Ban' :
                        key === 'stubbleEnforcement' ? 'Stubble Penalties' : 'Firecracker Ban';
          return `<span class="badge">${label}</span>`;
        }).join(' ');

      const printWindow = window.open('', '_blank', 'width=800,height=700');
      if (!printWindow) {
        throw new Error('Pop-up blocker prevented opening report page.');
      }

      printWindow.document.write(`
        <html>
        <head>
          <title>VaayuAI_Command_Summary_${cleanStationName.replace(/\s+/g, '_')}</title>
          <style>
            body {
              font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
              color: #1e293b;
              padding: 40px;
              line-height: 1.6;
              background-color: #ffffff;
            }
            .header {
              border-bottom: 2px solid #0f172a;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: 900;
              color: #0f172a;
              letter-spacing: -0.02em;
            }
            .logo span {
              color: #0ea5e9;
            }
            .title {
              font-size: 28px;
              font-weight: 800;
              margin-top: 10px;
              margin-bottom: 5px;
              color: #0f172a;
            }
            .meta {
              font-size: 12px;
              color: #64748b;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .card {
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 18px;
              background-color: #f8fafc;
            }
            .card h4 {
              margin-top: 0;
              margin-bottom: 14px;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #475569;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 6px;
            }
            .metric {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #f1f5f9;
              padding: 8px 0;
              font-size: 14px;
            }
            .metric:last-child {
              border-bottom: none;
            }
            .label {
              color: #64748b;
            }
            .value {
              font-weight: 700;
              color: #0f172a;
            }
            .badge {
              display: inline-block;
              font-size: 11px;
              font-weight: 700;
              padding: 4px 8px;
              background-color: #f1f5f9;
              border: 1px solid #cbd5e1;
              border-radius: 4px;
              margin-right: 6px;
              margin-bottom: 6px;
              color: #0f172a;
            }
            .footer {
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
              margin-top: 60px;
              text-align: center;
              font-size: 11px;
              color: #94a3b8;
              letter-spacing: 0.025em;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🍃 Vaayu<span>AI</span></div>
            <div class="title">NCR Air Quality Command Summary Report</div>
            <div class="meta">Generated: ${new Date().toLocaleString()} | Authority: GRAP Command Division</div>
          </div>

          <div class="grid">
            <div class="card">
              <h4>Environmental Readings</h4>
              <div class="metric">
                <span class="label">Focus Area Monitor</span>
                <span class="value">${cleanStationName}</span>
              </div>
              <div class="metric">
                <span class="label">Current AQI</span>
                <span class="value">${metrics.aqi} (${metrics.category})</span>
              </div>
              <div class="metric">
                <span class="label">Wind Direction</span>
                <span class="value">${metrics.weather.windDirection}</span>
              </div>
              <div class="metric">
                <span class="label">Wind Speed</span>
                <span class="value">${metrics.weather.windSpeed} km/h</span>
              </div>
              <div class="metric">
                <span class="label">NASA Satellite Hotspots</span>
                <span class="value">${metrics.stubbleFires} active fires</span>
              </div>
            </div>

            <div class="card">
              <h4>Enforcement & Impact</h4>
              <div class="metric">
                <span class="label">Mitigation Target</span>
                <span class="value">${mitigationScore}% General Reduction</span>
              </div>
              <div class="metric">
                <span class="label">Status Code</span>
                <span class="value" style="color: #10b981; font-weight: 800;">GRAP DISPATCHED</span>
              </div>
            </div>
          </div>

          <div class="card" style="margin-bottom: 30px;">
            <h4>Enforced Policy Interventions</h4>
            <div style="margin-top: 10px;">
              ${activePoliciesBadges || '<span style="color: #64748b; font-size: 13px;">No policies currently active. (100% Loading)</span>'}
            </div>
          </div>

          <div class="footer">
            THIS DOCUMENT IS A FORMAL CONTROL SUMMARY COMPILED BY VAAYUAI CONTROL DIVISION.<br>
            CONFIDENTIAL FOR GOVERNMENT REVIEW ONLY.
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
        </html>
      `);

      printWindow.document.close();
      setShowReport(false);
    } catch (e) {
      console.error('PDF generation failed:', e);
      alert('PDF download failed. Please check pop-up settings in your browser.');
    }
  };

  return (
    <div style={{
      padding: '24px',
      maxWidth: '1440px',
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      position: 'relative'
    }}>
      {/* Top Banner / Selection bar */}
      <div className="glass-panel" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '16px 24px',
        position: 'relative',
        zIndex: 500 // Ensures dropdown suggestion lists stack above main grid content
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>National Capital Region (NCR) Command Center</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time pollutant traces & satellite data ingestion feeds
          </p>
        </div>

        {/* CPCB Station Selector & Report Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Focus Area:</span>
            <div style={{ width: '220px', position: 'relative', zIndex: 700 }}>
              <StationSearch 
                selectedStationId={stationId}
                onSelectStation={onStationChange}
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowReport(true)}
            style={{
              padding: '10px 16px',
              backgroundColor: 'var(--primary-glow)',
              color: 'var(--primary)',
              border: '1px solid var(--border-card)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-glow)'}
          >
            <FileText size={16} />
            Command Summary
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr 340px',
        gap: '24px',
        width: '100%'
      }}>
        
        {/* Left Column: Local Station Details & Apportionment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Station stats */}
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              {cleanStationName}
            </h3>
            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: `var(--${metrics.colorClass})`, lineHeight: 1 }}>
              {metrics.aqi}
            </div>
            <div style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              fontWeight: '700',
              color: `var(--${metrics.colorClass})`,
              letterSpacing: '0.05em',
              marginTop: '4px'
            }}>
              {metrics.category}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.4' }}>
              {metrics.healthAdvice}
            </p>
          </div>

          {/* Apportionment Pie Chart */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '12px', alignSelf: 'flex-start' }}>
              Source Apportionment
            </h3>
            
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={metrics.sources}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={58}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {metrics.sources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'var(--border-card)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Pie Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '6px' }}>
              {metrics.sources.map((src, index) => (
                <div key={src.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: COLORS[index] }}></span>
                    {src.name}
                  </span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{src.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pollutant Reduction Breakdown Card */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Mitigation Efficiency Breakdown
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* PM2.5 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>PM2.5 Reduction</span>
                  <span style={{ fontWeight: '700', color: reductions.pm25 > 0 ? 'var(--aqi-good)' : 'var(--text-muted)' }}>
                    {reductions.pm25 > 0 ? `-${reductions.pm25}%` : '0%'}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${reductions.pm25}%`,
                    height: '100%',
                    backgroundColor: 'var(--aqi-good)',
                    transition: 'width 0.4s ease-out'
                  }}></div>
                </div>
              </div>

              {/* PM10 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>PM10 (Dust) Reduction</span>
                  <span style={{ fontWeight: '700', color: reductions.pm10 > 0 ? 'var(--aqi-good)' : 'var(--text-muted)' }}>
                    {reductions.pm10 > 0 ? `-${reductions.pm10}%` : '0%'}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${reductions.pm10}%`,
                    height: '100%',
                    backgroundColor: 'var(--aqi-good)',
                    transition: 'width 0.4s ease-out'
                  }}></div>
                </div>
              </div>

              {/* NOx */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>NOx (Vehicle) Reduction</span>
                  <span style={{ fontWeight: '700', color: reductions.nox > 0 ? 'var(--aqi-good)' : 'var(--text-muted)' }}>
                    {reductions.nox > 0 ? `-${reductions.nox}%` : '0%'}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${reductions.nox}%`,
                    height: '100%',
                    backgroundColor: 'var(--aqi-good)',
                    transition: 'width 0.4s ease-out'
                  }}></div>
                </div>
              </div>

              {/* SO2 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>SO2 (Industrial) Reduction</span>
                  <span style={{ fontWeight: '700', color: reductions.so2 > 0 ? 'var(--aqi-good)' : 'var(--text-muted)' }}>
                    {reductions.so2 > 0 ? `-${reductions.so2}%` : '0%'}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${reductions.so2}%`,
                    height: '100%',
                    backgroundColor: 'var(--aqi-good)',
                    transition: 'width 0.4s ease-out'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Map & Forecast Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Spatial map overlay */}
          <ActiveFiresMap 
            selectedStationId={stationId}
            onSelectStation={onStationChange}
            windSpeed={metrics.weather.windSpeed}
            windDirection={metrics.weather.windDirection}
            stubbleFiresActive={metrics.stubbleFires}
          />

          {/* NASA MODIS Satellite Detections Feed */}
          <div className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Radio size={16} className="animate-pulse-glow" style={{ color: '#ef4444' }} />
              <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-secondary)' }}>NASA MODIS Satellite active detections</h3>
            </div>
            
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-card)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '6px 4px' }}>CLUSTER HOTSPOT</th>
                    <th style={{ padding: '6px 4px' }}>COORDINATES</th>
                    <th style={{ padding: '6px 4px' }}>FIRE COUNT</th>
                    <th style={{ padding: '6px 4px' }}>CONFIDENCE</th>
                    <th style={{ padding: '6px 4px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {STUBBLE_FIRE_HOTSPOTS.map(fire => {
                    const isActive = metrics.stubbleFires > 0;
                    const finalCount = isActive ? Math.round(fire.count * (1 - (interventions.stubbleEnforcement ? 0.65 : 0))) : 0;
                    
                    return (
                      <tr key={fire.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-secondary)' }}>
                        <td style={{ padding: '8px 4px', fontWeight: '700', color: finalCount > 0 ? '#f87171' : 'var(--text-muted)' }}>
                          {fire.name}
                        </td>
                        <td style={{ padding: '8px 4px', color: 'var(--text-muted)' }}>
                          {fire.lat.toFixed(3)}°N, {fire.lng.toFixed(3)}°E
                        </td>
                        <td style={{ padding: '8px 4px', fontWeight: '700' }}>
                          {finalCount}
                        </td>
                        <td style={{ padding: '8px 4px' }}>
                          {fire.intensity === 'High' ? '96%' : '84%'}
                        </td>
                        <td style={{ padding: '8px 4px' }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            backgroundColor: finalCount > 50 ? 'rgba(239, 68, 68, 0.1)' : finalCount > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.02)',
                            color: finalCount > 50 ? '#ef4444' : finalCount > 0 ? '#f59e0b' : 'var(--text-muted)'
                          }}>
                            {finalCount > 50 ? 'CRITICAL' : finalCount > 0 ? 'MONITOR' : 'CLEARED'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Forecasting Area Chart (Toggleable Hourly/Seasonal Mode) */}
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-secondary)' }}>
                {chartMode === 'hourly' ? '72-Hour Predictive Projections' : '6-Month Seasonal Projections'}
              </h3>
              
              {/* Chart Mode Toggle Switch */}
              <div style={{
                display: 'flex',
                backgroundColor: '#111827',
                padding: '3px',
                borderRadius: '8px',
                border: '1px solid var(--border-card)'
              }}>
                <button
                  onClick={() => setChartMode('hourly')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    backgroundColor: chartMode === 'hourly' ? '#1e293b' : 'transparent',
                    color: chartMode === 'hourly' ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  HOURLY
                </button>
                <button
                  onClick={() => setChartMode('seasonal')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    backgroundColor: chartMode === 'seasonal' ? '#1e293b' : 'transparent',
                    color: chartMode === 'seasonal' ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  SEASONAL
                </button>
              </div>
            </div>

            <div style={{ width: '100%', height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUncontrolled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={9} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={9} tickLine={false} domain={[0, 'dataMax + 50']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: 'var(--border-card)', borderRadius: '8px' }}
                    labelStyle={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '0.85rem' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '0.75rem' }} />
                  <Area name={chartMode === 'hourly' ? "Policy Path" : "Controlled Path"} type="monotone" dataKey="aqi" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorAqi)" />
                  <Area name={chartMode === 'hourly' ? "Baseline Path" : "Baseline (No Policy)"} type="monotone" dataKey="aqiUncontrolled" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4,4" fillOpacity={1} fill="url(#colorUncontrolled)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Seasonal context note indicator */}
            {chartMode === 'seasonal' && (
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.4'
              }}>
                <Info size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>AI Analysis:</strong> October/November spike models stubble harvesting fires. December/January levels represent temperature inversions that trap mechanical particles at surface levels.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Policy Sandbox & AI Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Slider controller sandbox */}
          <InterventionSimulator 
            interventions={interventions}
            onChange={onInterventionChange}
          />

          {/* AI Decision advisor alerts */}
          <div className="glass-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <Brain size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>AI Targeted Advisories</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '250px' }}>
              {recommendations.map((rec, index) => {
                const isCritical = rec.type === 'critical';
                const isWarning = rec.type === 'warning';
                const isSuccess = rec.type === 'success';

                let borderCol = 'rgba(56, 189, 248, 0.2)';
                let bgCol = 'rgba(56, 189, 248, 0.03)';
                let iconCol = 'var(--primary)';

                if (isCritical) {
                  borderCol = 'rgba(239, 68, 68, 0.3)';
                  bgCol = 'rgba(239, 68, 68, 0.06)';
                  iconCol = '#ef4444';
                } else if (isWarning) {
                  borderCol = 'rgba(245, 158, 11, 0.3)';
                  bgCol = 'rgba(245, 158, 11, 0.06)';
                  iconCol = '#f59e0b';
                } else if (isSuccess) {
                  borderCol = 'rgba(16, 185, 129, 0.3)';
                  bgCol = 'rgba(16, 185, 129, 0.06)';
                  iconCol = '#10b981';
                }

                return (
                  <div 
                    key={index}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: `1px solid ${borderCol}`,
                      backgroundColor: bgCol,
                      display: 'flex',
                      gap: '8px',
                      fontSize: '0.75rem',
                      lineHeight: '1.4'
                    }}
                  >
                    <div style={{ color: iconCol, flexShrink: 0, marginTop: '2px' }}>
                      {isCritical ? <AlertCircle size={14} /> : isWarning ? <Flame size={14} /> : <CheckCircle size={14} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>{rec.title}</div>
                      <div style={{ color: 'var(--text-secondary)' }}>{rec.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Crowdsourced Incident Alerts */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <AlertCircle size={16} className="animate-pulse-glow" style={{ color: '#ef4444' }} />
              <h3 style={{ fontSize: '1rem', margin: 0 }}>Crowdsourced Incident Feed</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '180px' }}>
              {incidents.map((inc) => {
                const isPending = inc.status === 'pending';
                return (
                  <div 
                    key={inc.id}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-card)',
                      backgroundColor: 'rgba(255,255,255,0.01)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', color: isPending ? '#ef4444' : '#10b981', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                        {inc.type}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>{inc.time}</span>
                    </div>

                    <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                      Loc: {inc.area}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {inc.desc}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                      {isPending ? (
                        <button
                          onClick={() => onResolveIncident(inc.id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'var(--primary-glow)',
                            color: 'var(--primary)',
                            border: '1px solid var(--border-card)',
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'var(--transition-smooth)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-glow)'}
                        >
                          Enforce GRAP Clean-up
                        </button>
                      ) : (
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          color: '#10b981',
                          fontWeight: '800',
                          fontSize: '0.65rem'
                        }}>
                          ✓ Enforced & Resolved
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {incidents.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px', fontSize: '0.75rem' }}>
                  No local hazards reported.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ABSOLUTE MODAL: Government Intervention Report Card */}
      {showReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#0f172a',
            borderColor: 'var(--border-card-hover)',
            borderRadius: '16px',
            position: 'relative',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowReport(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={18} />
            </button>

            {/* Report Header */}
            <div style={{ borderBottom: '1px solid var(--border-card)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '4px' }}>
                <FileText size={20} />
                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>VaayuAI Command Ingest</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>NCR Air Quality Summary Report</h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Timestamp: {new Date().toLocaleString()} | Authority: GRAP Command Division
              </p>
            </div>

            {/* Report Content Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
              {/* Stat Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Selected Focus Area</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{cleanStationName}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Current Focus AQI</span>
                <span style={{ fontWeight: '700', color: `var(--${metrics.colorClass})` }}>{metrics.aqi} ({metrics.category})</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Meteorology Vectors</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{metrics.weather.windDirection} Wind ({metrics.weather.windSpeed} km/h)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>NASA Satellite Hotspots</span>
                <span style={{ fontWeight: '700', color: metrics.stubbleFires > 0 ? '#ef4444' : 'var(--text-muted)' }}>
                  {metrics.stubbleFires} active fires detected
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Mitigation Score</span>
                <span style={{ fontWeight: '700', color: 'var(--aqi-good)' }}>{mitigationScore}% Reduction</span>
              </div>

              {/* Active Measures Cards */}
              <div style={{ marginTop: '10px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700' }}>
                  ENFORCED POLICY INTERVENTIONS
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(interventions).map(([key, active]) => {
                    if (!active) return null;
                    const label = key === 'oddEven' ? 'Odd-Even Scheme' :
                                  key === 'constructionHalt' ? 'Construction Ban' :
                                  key === 'industrialRestriction' ? 'Boiler/Booster Ban' :
                                  key === 'stubbleEnforcement' ? 'Stubble Penalties' : 'Firecracker Ban';
                    return (
                      <span 
                        key={key}
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.2)',
                          color: 'var(--primary)'
                        }}
                      >
                        {label}
                      </span>
                    );
                  })}
                  {Object.values(interventions).every(v => !v) && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No policies currently active.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', borderTop: '1px solid var(--border-card)', paddingTop: '20px' }}>
              <button
                onClick={handleDownloadReport}
                style={{
                  flexGrow: 1,
                  padding: '12px',
                  backgroundColor: 'var(--primary)',
                  color: '#090d16',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Download size={16} />
                Download Report PDF
              </button>
              
              <button
                onClick={() => setShowReport(false)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.9rem'
                }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
