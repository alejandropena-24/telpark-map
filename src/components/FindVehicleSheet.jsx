import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

const customIcon = L.divIcon({
  html: `<div style="background-color: #FF9300; border: 2px solid #FFFFFF; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const FindVehicleSheet = ({ isOpen, parking, floor, spot, startTime, onClose, onEndSession }) => {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, startTime]);

  if (!parking) return null;

  return (
    <>
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
          zIndex: 2000
        }}
        onClick={onClose}
      />
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        maxHeight: '90%',
        backgroundColor: 'var(--color-bg-primary)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '16px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        transform: isOpen ? 'translateY(0)' : 'translateY(150%)',
        transition: 'transform 300ms ease',
        zIndex: 2001,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        overflowY: 'auto'
      }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer' }} onClick={onClose}>
          <div style={{ width: '36px', height: '4px', backgroundColor: 'var(--color-stroke-primary)', borderRadius: '2px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>¿Dónde dejaste el coche?</h2>
          <button onClick={onClose} style={{ background: '#F0F0F0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style={{ 
          backgroundColor: 'var(--color-bg-secondary)', 
          borderRadius: '12px', 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{parking.name}</div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Planta {floor} · Plaza {spot}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Tiempo aparcado: {elapsed}</div>
          </div>
          
          <div style={{ height: '100px', borderRadius: '8px', overflow: 'hidden', position: 'relative', pointerEvents: 'none' }}>
            <MapContainer 
              center={[parking.lat, parking.lng]} 
              zoom={16} 
              zoomControl={false}
              dragging={false}
              touchZoom={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Marker position={[parking.lat, parking.lng]} icon={customIcon} />
            </MapContainer>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => {
              window.open(`https://www.google.com/maps/dir/?api=1&destination=${parking.lat},${parking.lng}`, '_blank');
              onEndSession();
            }}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: '#FF9300',
              color: '#FFFFFF',
              borderRadius: '999px',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cómo llegar a mi coche
          </button>
        </div>
      </div>
    </>
  );
};

export default FindVehicleSheet;
