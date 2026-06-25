import React from 'react';
import { LocateFixed } from 'lucide-react';
import { parkings, getAvailabilityColor } from '../data';

const IdleBottomStrip = ({ onSelectParking, searchQuery = '' }) => {
  const filteredParkings = parkings.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
  });

  const sortedParkings = [...filteredParkings].sort((a, b) => {
    const aRatio = a.freeSpots / a.totalSpots;
    const bRatio = b.freeSpots / b.totalSpots;
    return bRatio - aRatio;
  });

  return (
    <div style={{
      position: 'absolute',
      bottom: '32px',
      left: 0,
      width: '100%',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        marginBottom: '16px',
        justifyContent: 'flex-end'
      }}>
        <button style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <LocateFixed size={20} color="var(--color-icon-secondary)" />
        </button>
      </div>

      <div className="hide-scrollbar" style={{
        display: 'flex',
        overflowX: 'scroll',
        paddingLeft: 'calc(50% - 140px)',
        paddingRight: 'calc(50% - 140px)',
        gap: '12px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch'
      }}>
        {sortedParkings.length > 0 ? (
          sortedParkings.map(parking => {
            const availColor = getAvailabilityColor(parking.freeSpots, parking.totalSpots);
            return (
              <div 
                key={parking.id}
                onClick={() => onSelectParking(parking)}
                style={{
                  minWidth: '280px',
                  backgroundColor: 'var(--color-bg-primary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  scrollSnapAlign: 'center',
                  cursor: 'pointer',
                  borderLeft: `6px solid ${availColor}`,
                  flexShrink: 0
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: 'var(--color-text-primary)',
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {parking.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: availColor }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {parking.freeSpots} <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>/ {parking.totalSpots}</span>
                    </span>
                  </div>
                </div>
                
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {parking.address}
                </p>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 500 }}>
                    €{parking.pricePerHour.toFixed(2)}/h
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{
            minWidth: '280px',
            height: '116px', // Matching normal card height
            backgroundColor: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
            fontWeight: 500
          }}>
            Sin resultados para '{searchQuery}'
          </div>
        )}
      </div>
    </div>
  );
};

export default IdleBottomStrip;
