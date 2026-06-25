import React from 'react';
import { Map, Navigation, Compass } from 'lucide-react';

const NavigationSheet = ({ isOpen, onClose, destinationCoords, onNavigateComplete, setBannerVisible }) => {
  const openGoogleMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    setTimeout(() => setBannerVisible(true), 500);
  };

  const openAppleMaps = (lat, lng) => {
    window.open(`maps://maps.apple.com/?daddr=${lat},${lng}`, '_blank');
    setTimeout(() => setBannerVisible(true), 500);
  };

  const openWaze = (lat, lng) => {
    window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
    setTimeout(() => setBannerVisible(true), 500);
  };

  const handleAction = (action) => {
    if (destinationCoords) {
      action(destinationCoords.lat, destinationCoords.lng);
    }
    onClose();
    if (onNavigateComplete) {
      onNavigateComplete();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
          zIndex: 2000
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'transparent',
        transition: 'transform 300ms ease',
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        zIndex: 2001,
        padding: '16px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--color-stroke-primary)', textAlign: 'center', fontWeight: 600, fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            Abrir con:
          </div>
          
          <button onClick={() => handleAction(openGoogleMaps)} style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '0 16px', height: '52px', borderBottom: '1px solid var(--color-stroke-primary)', gap: '12px' }}>
            <Map size={24} color="var(--color-secondary)" />
            <span style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>Google Maps</span>
          </button>
          
          <button onClick={() => handleAction(openWaze)} style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '0 16px', height: '52px', borderBottom: '1px solid var(--color-stroke-primary)', gap: '12px' }}>
            <Navigation size={24} color="var(--color-secondary)" />
            <span style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>Waze</span>
          </button>
          
          <button onClick={() => handleAction(openAppleMaps)} style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '0 16px', height: '52px', gap: '12px' }}>
            <Compass size={24} color="var(--color-secondary)" />
            <span style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>Apple Maps</span>
          </button>
        </div>

        <button 
          onClick={onClose}
          style={{
            width: '100%',
            height: '52px',
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-secondary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '16px',
            fontWeight: 500,
            color: 'var(--color-secondary)'
          }}
        >
          Cancelar
        </button>

        <style>
          {`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}
        </style>
      </div>
    </>
  );
};

export default NavigationSheet;
