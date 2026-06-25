import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { parkings, getAvailabilityColor } from '../data';

const ClusterEvents = ({ parkings, createCustomIcon, onSelectParking }) => {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup({
      disableClusteringAtZoom: 15,
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        let size = 40;
        if (count >= 10 && count < 30) size = 52;
        if (count >= 30) size = 64;
        return L.divIcon({
          html: `<div style="width: ${size}px; height: ${size}px; background: #202247; border-radius: 999px; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600; font-family: Inter, sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">${count}</div>`,
          className: '',
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });
      }
    });

    parkings.forEach(parking => {
      const marker = L.marker([parking.lat, parking.lng], {
        icon: createCustomIcon(parking)
      });
      marker.on('click', () => {
        onSelectParking(parking);
      });
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, parkings, createCustomIcon, onSelectParking]);

  return null;
};

const MapLayer = ({ selectedParking, onSelectParking, onMapClick, setMapInstance }) => {
  const mapCenter = [40.428, -3.69]; 
  
  const createCustomIcon = React.useCallback((parking) => {
    const isSelected = selectedParking?.id === parking.id;
    const hasSelection = selectedParking !== null;
    
    const getPinStyle = (parking) => {
      if (parking.freeSpots === 0) {
        return { background: '#EF4444', label: '#FFFFFF', border: 'none' }; 
      } else if (parking.freeSpots / parking.totalSpots < 0.25) {
        return { background: '#D4A017', label: '#FFFFFF', border: 'none' }; 
      } else {
        return { background: '#FFFFFF', label: '#1A1A1A', border: '1.5px solid #E0E0E0' }; 
      }
    };
    
    let style = getPinStyle(parking);
    if (isSelected) {
      style = { background: '#FF9300', label: '#FFFFFF', border: '2px solid #202247' };
    }
    
    const bgColor = style.background;
    const textColor = style.label;
    const border = style.border || 'none';
    
    const opacity = (hasSelection && !isSelected) ? 0.7 : 1;
    const scale = isSelected ? 1.2 : 1;
    
    const label = parking.freeSpots === 0 ? 'Completo' : `€${parking.pricePerHour.toFixed(2)}/h`;
    
    const htmlString = `<div style="background-color: ${bgColor}; color: ${textColor}; border: ${border}; padding: 4px 10px; border-radius: var(--radius-full); font-family: var(--font-family); font-weight: 600; font-size: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); opacity: ${opacity}; transform: scale(${scale}); transition: transform 200ms ease, opacity 200ms ease; white-space: nowrap; display: inline-block;">${label}</div>`;

    return L.divIcon({
      html: htmlString,
      className: 'custom-leaflet-marker',
      iconSize: null,
    });
  }, [selectedParking]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
      <MapContainer 
        ref={setMapInstance}
        center={mapCenter} 
        zoom={12} 
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <div style={{ display: 'none' }}>
          <MapEvents onMapClick={onMapClick} />
        </div>
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <ClusterEvents 
          parkings={parkings} 
          createCustomIcon={createCustomIcon} 
          onSelectParking={onSelectParking} 
        />
      </MapContainer>
      <style>
        {`
          .custom-leaflet-marker {
            background: none;
            border: none;
          }
          .leaflet-container {
            font-family: var(--font-family);
          }
          .leaflet-control-attribution {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

const MapEvents = ({ onMapClick }) => {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map]);

  useMapEvents({
    click() {
      onMapClick();
    },
  });
  return null;
};

export default MapLayer;
