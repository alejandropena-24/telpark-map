import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

const customIcon = L.divIcon({
  html: `<div style="background-color: #FF9300; border: 2px solid #FFFFFF; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const RegisterSpotSheet = ({ isOpen, parking, onConfirm, onClose }) => {
  const floors = ['P1', 'P2', 'P3', 'S1', 'S2', 'S3'];
  const [floorIndex, setFloorIndex] = useState(0);
  const [spot, setSpot] = useState('');

  const handlePrevFloor = () => {
    setFloorIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextFloor = () => {
    setFloorIndex((prev) => (prev < floors.length - 1 ? prev + 1 : prev));
  };

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
        backgroundColor: 'var(--color-bg-primary)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '16px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms ease',
        zIndex: 2001,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer' }} onClick={onClose}>
          <div style={{ width: '36px', height: '4px', backgroundColor: 'var(--color-stroke-primary)', borderRadius: '2px' }} />
        </div>

        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)' }}>¿Dónde has aparcado?</h2>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Planta</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '12px', padding: '4px' }}>
              <button onClick={handlePrevFloor} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: 'var(--color-text-primary)', border: 'none', background: 'transparent', cursor: 'pointer' }}>-</button>
              <span style={{ fontSize: '16px', fontWeight: 600 }}>{floors[floorIndex]}</span>
              <button onClick={handleNextFloor} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: 'var(--color-text-primary)', border: 'none', background: 'transparent', cursor: 'pointer' }}>+</button>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Plaza</label>
            <input 
              type="number" 
              inputMode="numeric"
              placeholder="Ej: 42" 
              value={spot}
              onChange={(e) => setSpot(e.target.value)}
              style={{
                height: '44px',
                backgroundColor: 'var(--color-bg-secondary)',
                border: 'none',
                borderRadius: '12px',
                padding: '0 16px',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ height: '120px', borderRadius: '12px', overflow: 'hidden', position: 'relative', pointerEvents: 'none' }}>
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
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>Ubicación registrada automáticamente</span>
        </div>

        <button 
          onClick={() => onConfirm(floors[floorIndex], spot)}
          disabled={!spot.trim()}
          style={{
            width: '100%',
            height: '52px',
            backgroundColor: spot.trim() ? '#FF9300' : 'var(--color-stroke-primary)',
            color: '#FFFFFF',
            borderRadius: '999px',
            fontSize: '16px',
            fontWeight: 600,
            border: 'none',
            cursor: spot.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          Confirmar plaza
        </button>
      </div>
    </>
  );
};

export default RegisterSpotSheet;
