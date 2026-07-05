import React from 'react';
import { ToggleLeft, ToggleRight, Info, Award, Sliders } from 'lucide-react';

export default function InterventionSimulator({ interventions, onChange, isLiveMode }) {
  // Toggle callback
  const handleToggle = (policyKey) => {
    if (isLiveMode) return; // Bypassed in live mode
    onChange({
      ...interventions,
      [policyKey]: !interventions[policyKey]
    });
  };

  // Calculate simulated mitigation impact
  const getMitigationScore = () => {
    if (isLiveMode) return 0;
    let score = 0;
    if (interventions.oddEven) score += 15;
    if (interventions.constructionHalt) score += 20;
    if (interventions.industrialRestriction) score += 18;
    if (interventions.stubbleEnforcement) score += 25;
    if (interventions.firecrackerBan) score += 12;
    return score;
  };

  const mitigationScore = getMitigationScore();

  const policies = [
    {
      key: 'oddEven',
      name: 'Odd-Even Scheme',
      desc: 'Restricts personal vehicular travel by license plates.',
      impact: 'Medium (Traffic -35%)'
    },
    {
      key: 'constructionHalt',
      name: 'Construction Halt',
      desc: 'Bans commercial construction and demolition works.',
      impact: 'High (Dust -50%)'
    },
    {
      key: 'industrialRestriction',
      name: 'Industrial Restrictions',
      desc: 'Shuts down brick kilns and coal-fired boiler operations.',
      impact: 'High (Industry -40%)'
    },
    {
      key: 'stubbleEnforcement',
      name: 'Stubble Burning Penalties',
      desc: 'Enforces bio-decomposers and bans crop residue fires.',
      impact: 'Severe (Stubble -65%)'
    },
    {
      key: 'firecrackerBan',
      name: 'Firecracker Restrictions',
      desc: 'Imposes strict bans on firecracker sales and usage.',
      impact: 'Diurnal Spike (-80%)'
    }
  ];

  return (
    <div className="glass-panel" style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
      
      {/* Absolute Live Mode Lock Overlay */}
      {isLiveMode && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(9, 13, 22, 0.88)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          zIndex: 100
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            color: '#f59e0b'
          }}>
            <Sliders size={22} />
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>Simulator is Inactive</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', maxWidth: '250px' }}>
            Viewing live feeds from CPCB monitors. Switch to **Sandbox Simulator** in the header to test GRAP policies.
          </p>
        </div>
      )}

      {/* Simulator Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Policy Intervention Simulator</h3>
        
        {/* Mitigation Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '8px',
          backgroundColor: mitigationScore > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
          border: '1px solid',
          borderColor: mitigationScore > 0 ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-card)',
          color: mitigationScore > 0 ? 'var(--aqi-good)' : 'var(--text-secondary)',
          fontSize: '0.8rem',
          fontWeight: '700'
        }}>
          <Award size={14} />
          Mitigation: {mitigationScore}%
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.4' }}>
        Toggle emergency interventions below to simulate how localized AQI models respond in real-time.
      </p>

      {/* Policy list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {policies.map(policy => {
          const isActive = interventions[policy.key];
          
          return (
            <div 
              key={policy.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: isActive ? 'rgba(56, 189, 248, 0.03)' : 'rgba(255,255,255,0.01)',
                border: '1px solid',
                borderColor: isActive ? 'rgba(56, 189, 248, 0.15)' : 'var(--border-card)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <div style={{ flexGrow: 1, paddingRight: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ 
                    fontSize: '0.95rem', 
                    fontWeight: '700', 
                    color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                    transition: 'color 0.3s ease'
                  }}>
                    {policy.name}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.04)',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: '600'
                  }}>
                    {policy.impact}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {policy.desc}
                </p>
              </div>

              {/* Toggle switch icon */}
              <button
                onClick={() => handleToggle(policy.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {isActive ? (
                  <ToggleRight size={38} style={{ filter: 'drop-shadow(0 0 4px var(--primary))' }} />
                ) : (
                  <ToggleLeft size={38} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* AI Sandbox Insight */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        gap: '8px',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-card)',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)'
      }}>
        <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <p style={{ margin: 0, lineHeight: '1.4' }}>
          Interventions are modeled dynamically. Note that the real-world impact depends on wind speed and directions blowing pollutants from surrounding regions.
        </p>
      </div>
    </div>
  );
}
