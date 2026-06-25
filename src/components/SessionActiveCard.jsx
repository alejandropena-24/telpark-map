import React, { useState, useEffect } from 'react';

const SessionActiveCard = ({ isVisible, parking, floor, spot, startTime, onEnd }) => {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const diff = Date.now() - startTime;
      const totalSeconds = Math.floor(diff / 1000);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      setElapsed(formatted);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (!parking) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '120px',
      left: '16px',
      right: '16px',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
      overflow: 'hidden',
      zIndex: 3000,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
      transition: 'opacity 300ms ease'
    }}>
      {/* Row 1 */}
      <div style={{
        background: '#202247',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF' }}>
          <div style={{ 
            width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <path d="M9 17h6"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{parking.name}</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Planta {floor} · Plaza {spot}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ 
            fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', 
            fontWeight: 'bold', 
            fontSize: '28px',
            fontVariantNumeric: 'tabular-nums',
            color: '#FFFFFF',
            lineHeight: 1
          }}>{elapsed}</span>
        </div>
      </div>

      {/* Row 2 */}
      <div style={{
        background: '#FFFFFF',
        padding: '14px 20px',
        borderTop: '1.5px solid #E0E0E0'
      }}>
        <button
          onClick={onEnd}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: '#202247',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center',
            padding: 0
          }}
        >
          ¿Dónde está mi coche?
        </button>
      </div>
    </div>
  );
};

export default SessionActiveCard;
