import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { getAvailabilityColor, parkings, findNearestAvailable } from '../data';

const BottomSheet = ({ parking, sheetView, isVisible, onExpand, onClose, onDismiss, onNavigate, onShowNearby, onSelectAlternative }) => {
  const [renderState, setRenderState] = useState(false);
  const [animClass, setAnimClass] = useState('hidden');
  const [cachedParking, setCachedParking] = useState(null);

  useEffect(() => {
    if (parking) {
      setCachedParking(parking);
    }
  }, [parking]);

  const displayParking = parking || cachedParking;

  useEffect(() => {
    if (isVisible) {
      if (!renderState) {
        setRenderState(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimClass(sheetView);
          });
        });
      } else {
        setAnimClass(sheetView);
      }
    } else {
      if (renderState) {
        setAnimClass('hidden');
      }
    }
  }, [isVisible, sheetView, renderState]);

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName === 'transform') {
      if (!isVisible) {
        setRenderState(false);
      }
    }
  };

  if (!renderState || !displayParking) return null;

  const availColor = getAvailabilityColor(displayParking.freeSpots, displayParking.totalSpots);
  const isCompleto = displayParking.freeSpots === 0;
  const nearby = findNearestAvailable(displayParking, parkings, 4);

  let collapsedStyles = {};
  let expandedStyles = {};
  let overlayStyles = {};

  if (animClass === 'collapsed') {
    collapsedStyles = { transform: 'translateY(0)', opacity: 1, pointerEvents: 'auto' };
    expandedStyles = { transform: 'translateY(100%)', visibility: 'hidden' };
    overlayStyles = { opacity: 0, pointerEvents: 'none' };
  } else if (animClass === 'expanded') {
    collapsedStyles = { transform: 'translateY(-20px)', opacity: 0, pointerEvents: 'none' };
    expandedStyles = { transform: 'translateY(0)', visibility: 'visible' };
    overlayStyles = { opacity: 0.4, pointerEvents: 'auto' };
  } else {
    // hidden
    collapsedStyles = { transform: 'translateY(100%)', opacity: 1, pointerEvents: 'auto' };
    expandedStyles = { transform: 'translateY(100%)', visibility: 'hidden' };
    overlayStyles = { opacity: 0, pointerEvents: 'none' };
  }

  return (
    <>
      {/* Collapsed Sheet (State 2) */}
      <div 
        onTransitionEnd={handleTransitionEnd}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 'auto',
          maxHeight: '35dvh',
          backgroundColor: 'var(--color-bg-primary)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          paddingTop: '24px',
          transition: 'transform 280ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms ease',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          ...collapsedStyles
        }}
      >
        <div 
          onClick={onExpand}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'center', padding: '12px 0', cursor: 'pointer' }}
        >
          <div style={{ width: '36px', height: '4px', backgroundColor: 'var(--color-stroke-primary)', borderRadius: '2px' }} />
        </div>
        
        <div style={{ marginTop: '16px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                {displayParking.name}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} /> {displayParking.address}
              </p>
            </div>
            {isCompleto && (
              <div style={{ backgroundColor: 'var(--color-error)', color: '#FFFFFF', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 700 }}>
                COMPLETO
              </div>
            )}
          </div>

          {/* Availability Bar - only if not full */}
          {!isCompleto && (
            <div style={{ marginTop: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ fontWeight: 600 }}>Plazas libres</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {displayParking.freeSpots} <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)' }}>/ {displayParking.totalSpots}</span>
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${(displayParking.freeSpots / displayParking.totalSpots) * 100}%`, 
                  height: '100%', 
                  backgroundColor: availColor,
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {isCompleto ? (
              <button 
                onClick={onExpand}
                style={{
                  flex: 1,
                  height: '48px',
                  border: '1.5px solid var(--color-secondary)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-secondary)',
                  fontSize: '16px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Más información
              </button>
            ) : (
              <button 
                onClick={onNavigate}
                style={{
                  flex: 1,
                  height: '48px',
                  backgroundColor: 'var(--color-accent)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '16px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Cómo llegar
              </button>
            )}
            
            {!isCompleto && (
              <button 
                onClick={onExpand}
                style={{
                  flex: 1,
                  height: '48px',
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-primary)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '16px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Más información
              </button>
            )}
          </div>

          {/* Completo Recommendation */}
          {isCompleto && nearby.length > 0 && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#FFE9CC', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Sugerencia cercana</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-secondary)' }}>{nearby[0].parking.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>A ~{Math.round(nearby[0].dist / 80)} min a pie</div>
                </div>
                <button 
                  onClick={() => onSelectAlternative(nearby[0].parking)}
                  style={{ backgroundColor: '#FF9300', color: 'white', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}
                >
                  Ver
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Sheet Overlay and Content */}
      {/* Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#000000',
          zIndex: 1001,
          transition: 'opacity 280ms cubic-bezier(0.32, 0.72, 0, 1)',
          ...overlayStyles
        }}
        onClick={onDismiss}
      />
      
      {/* Expanded Sheet */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 'auto',
          maxHeight: '85dvh',
          backgroundColor: 'var(--color-bg-primary)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          zIndex: 1002,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 280ms cubic-bezier(0.32, 0.72, 0, 1), visibility 280ms',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          ...expandedStyles
        }}
      >
        <div 
          onClick={onClose}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '12px 0', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{ width: '36px', height: '4px', backgroundColor: 'var(--color-stroke-primary)', borderRadius: '2px' }} />
        </div>

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }} className="hide-scrollbar">
          <div style={{ padding: '0 16px 16px' }}>
            {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                {displayParking.name}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} /> {displayParking.address}
              </p>
            </div>
            {isCompleto && (
              <div style={{ backgroundColor: 'var(--color-error)', color: '#FFFFFF', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 700 }}>
                COMPLETO
              </div>
            )}
          </div>

          {/* Expanded Content */}
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Tarifas</h3>
            <div style={{ backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Primera hora</span>
                <span style={{ fontWeight: 600 }}>€{displayParking.pricePerHour.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Hora adicional</span>
                <span style={{ fontWeight: 600 }}>€{displayParking.additionalHour.toFixed(2)}</span>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '16px' }}>Horario</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-secondary)' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '10px', border: '1.5px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '2px', height: '6px', backgroundColor: 'currentColor', transform: 'translateY(-2px)' }} />
              </div>
              {displayParking.hours}
            </div>

            {/* Parkings cercanos */}
            <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '16px', marginBottom: '8px' }}>
              Parkings cercanos
            </h3>
            <div className="hide-scrollbar" style={{ 
              display: 'flex', 
              overflowX: 'scroll', 
              WebkitOverflowScrolling: 'touch', 
              padding: '8px 16px', 
              margin: '0 -16px',
              height: '100px'
            }}>
              {nearby.map(({ parking: p, dist }) => {
                const pAvailColor = getAvailabilityColor(p.freeSpots, p.totalSpots);
                return (
                  <div 
                    key={p.id}
                    onClick={() => {
                      onSelectAlternative(p);
                    }}
                    style={{
                      width: '160px',
                      flexShrink: 0,
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderLeft: `8px solid ${pAvailColor}`,
                      padding: '12px',
                      marginRight: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: 'var(--color-text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginBottom: '4px'
                    }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                      a ~{Math.round(dist / 80)} min a pie
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        desde €{p.pricePerHour.toFixed(2)}/h
                      </span>
                      <div style={{ width: '20px', height: '11px', borderRadius: '5.5px', backgroundColor: pAvailColor }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sticky Bottom CTA (Expanded) */}
          {!isCompleto && (
            <div style={{ 
              position: 'sticky',
              bottom: 0,
              padding: '16px', 
              paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid var(--color-stroke-primary)',
              boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
              zIndex: 10,
              marginTop: 'auto'
            }}>
              <button 
                onClick={onNavigate}
                style={{
                  width: '100%',
                  height: '52px',
                  backgroundColor: 'var(--color-accent)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '16px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Cómo llegar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
