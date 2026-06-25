import React, { useState, useEffect } from 'react';
import MapLayer from './components/MapLayer';
import SearchBar from './components/SearchBar';
import IdleBottomStrip from './components/IdleBottomStrip';
import BottomSheet from './components/BottomSheet';
import NavigationSheet from './components/NavigationSheet';
import RegisterSpotSheet from './components/RegisterSpotSheet';
import SessionActiveCard from './components/SessionActiveCard';
import FindVehicleSheet from './components/FindVehicleSheet';

function App() {
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    const handleVisibility = () => {
      // do nothing — do NOT reset bannerVisible on visibility change
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const [mapInstance, setMapInstance] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [sheetView, setSheetView] = useState('collapsed'); // 'collapsed' | 'expanded'
  const [sheetVisible, setSheetVisible] = useState(false);
  const [navigationSheetOpen, setNavigationSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Session State
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionParking, setSessionParking] = useState(null);
  const [sessionFloor, setSessionFloor] = useState('');
  const [sessionSpot, setSessionSpot] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState(null);

  // New UI states
  const [showRegisterSheet, setShowRegisterSheet] = useState(false);
  const [sessionView, setSessionView] = useState('bar'); // 'bar' | 'detail'

  const handleSelectParking = (parking) => {
    if (bannerVisible) return;
    if (showRegisterSheet || sessionActive) return;
    if (mapInstance) {
      mapInstance.flyTo([parking.lat, parking.lng], 16, { duration: 0.8 });
    }
    setSelectedParking(parking);
    setSheetView('collapsed');
    setSheetVisible(true);
  };

  const handleMapClick = () => {
    setSelectedParking(null);
    if (sheetVisible) {
      setSheetVisible(false);
    }
  };

  const handleExpandSheet = () => {
    setSheetView('expanded');
  };
  
  const handleCollapseSheet = () => {
    setSheetView('collapsed');
  };

  const handleOpenNavigation = () => {
    setNavigationSheetOpen(true);
  };

  const handleCloseNavigation = () => {
    setNavigationSheetOpen(false);
  };

  const handleShowNearby = () => {
    setSheetVisible(false);
  };

  const handleNavigateComplete = () => {
    setSessionParking(selectedParking);
    setSelectedParking(null);
    setSheetVisible(false);
  };

  const handleStartRegistration = () => {
    setBannerVisible(false);
    setShowRegisterSheet(true);
  };

  const handleConfirmRegistration = (floor, spot) => {
    setSessionActive(true);
    setSessionFloor(floor);
    setSessionSpot(spot);
    setSessionStartTime(Date.now());
    setSessionView('bar');
    setShowRegisterSheet(false);
    setSheetVisible(false);
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setSessionParking(null);
    setSessionFloor('');
    setSessionSpot('');
    setSessionStartTime(null);
    setSessionView('bar');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Brand Bar */}
      <div style={{
        height: '44px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-stroke-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001,
        flexShrink: 0
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="auto" viewBox="0 0 128 32" fill="none">
          <path d="M30.3889 18.7968C30.0266 19.3001 29.5891 19.7451 29.0916 20.1164C28.2073 20.8428 26.7837 21.4578 24.7844 21.4578C21.9007 21.4578 19.4398 19.5426 18.8227 16.2859H34.7836V14.9421C34.7836 9.23263 30.3597 4.78711 24.7844 4.78711C19.209 4.78711 14.7852 9.23263 14.7852 14.9421C14.7852 20.6515 19.209 25.0994 24.7795 25.0994C28.6665 25.0994 31.0084 23.4917 32.5534 21.9517C32.872 21.6222 33.1644 21.2684 33.428 20.8936L30.3889 18.7968ZM19.0147 13.0268C19.6317 10.1212 22.0926 8.42633 24.7844 8.42633C28.2826 8.42633 30.1289 10.7242 30.5516 13.0268H19.0147Z" fill="#FF9903"/>
          <path d="M56.9123 4.78709C55.2711 4.77766 53.669 5.2862 52.3354 6.23987C51.7503 6.64162 51.2202 7.1178 50.7588 7.65634H50.5669V5.16966H46.5293V32.0002H50.5669V22.2253H50.7588C51.2088 22.7852 51.7402 23.2749 52.3354 23.6781C53.673 24.6198 55.2748 25.1163 56.9123 25.097C62.1039 25.097 66.1439 21.0728 66.1439 14.942C66.1439 8.8113 62.1063 4.78467 56.9123 4.78467V4.78709ZM56.1422 21.4602C52.8748 21.4602 50.5669 19.1987 50.5669 14.9445C50.5669 10.6902 52.8748 8.42873 56.1422 8.42873C59.6429 8.42873 61.9119 10.6902 61.9119 14.9445C61.9119 19.1987 59.6429 21.4602 56.1422 21.4602Z" fill="#FF9903"/>
          <path d="M84.0243 7.66125H83.8299C83.3697 7.12153 82.8395 6.6452 82.2533 6.24479C80.9175 5.29738 79.3182 4.78947 77.6788 4.792C72.4873 4.792 68.4473 8.81621 68.4473 14.9615C68.4473 21.1068 72.4848 25.1164 77.6788 25.1164C79.3301 25.1138 80.9357 24.5759 82.2533 23.5838C82.8531 23.1481 83.3845 22.6258 83.8299 22.0341H84.0243V24.7169H88.0594V5.16973H84.0243V7.66125ZM78.4367 21.4627C74.9385 21.4627 72.6695 19.2012 72.6695 14.947C72.6695 10.6927 74.9385 8.43123 78.4367 8.43123C81.7067 8.43123 84.0243 10.6927 84.0243 14.947C84.0243 19.2012 81.7164 21.4627 78.4367 21.4627Z" fill="#FF9903"/>
          <path d="M98.1467 6.51098C97.6527 6.94934 97.2363 7.46748 96.915 8.04366H96.7231V5.17199H92.6758V24.7168H96.7134V14.1768C96.7134 10.9202 99.0212 8.81122 102.097 8.81122H104.597V4.97829H102.289C100.764 4.95443 99.2862 5.50134 98.1467 6.51098Z" fill="#FF9903"/>
          <path d="M6.31631 18.184V8.82324H12.2682V5.19128H6.31631V0H2.30059V5.1937H0V8.82566H2.30059V18.184C2.30059 22.4261 4.60119 24.6804 8.43227 24.6804H12.4577V21.0484H8.81368C7.08884 21.0484 6.3236 20.322 6.3236 18.1816" fill="#FF9903"/>
          <path d="M42.2676 0.0146484H38.2422V24.6708H42.2676V0.0146484Z" fill="#FF9903"/>
          <path d="M112.323 9.19854V0H108.133V13.2179L112.323 9.19854Z" fill="#FF9903"/>
          <path d="M108.133 14.8306V24.6998H112.323V19.4698L108.133 14.8306Z" fill="#FF9903"/>
          <path d="M118.231 14.0434L127.57 4.97559L121.778 4.97801L112.359 13.9925L122.05 24.702H128L118.231 14.0434Z" fill="#FF9903"/>
        </svg>
      </div>

      <div style={{ position: 'relative', flexGrow: 1, width: '100%', overflow: 'hidden' }}>
        <MapLayer 
          selectedParking={selectedParking} 
          onSelectParking={handleSelectParking} 
          onMapClick={handleMapClick}
          setMapInstance={setMapInstance}
        />
        
        {/* State 1 Elements */}
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
        {/* Idle Strip - only show when no parking is selected */}
        {!bannerVisible && !sheetVisible && !showRegisterSheet && !sessionActive && (
          <IdleBottomStrip onSelectParking={handleSelectParking} searchQuery={searchQuery} />
        )}

      {/* State 2, 3, 5 - Bottom Sheet */}
      <BottomSheet 
        parking={selectedParking}
        sheetView={sheetView}
        isVisible={sheetVisible}
        onExpand={handleExpandSheet}
        onClose={handleCollapseSheet}
        onDismiss={() => setSheetVisible(false)}
        onNavigate={handleOpenNavigation}
        onShowNearby={handleShowNearby}
        onSelectAlternative={handleSelectParking}
      />

        <NavigationSheet 
          isOpen={navigationSheetOpen}
          onClose={handleCloseNavigation}
          destinationCoords={selectedParking ? { lat: selectedParking.lat, lng: selectedParking.lng } : null}
          onNavigateComplete={handleNavigateComplete}
          setBannerVisible={setBannerVisible}
        />

        {sessionActive && sessionParking && (
          <SessionActiveCard 
            isVisible={sessionView === 'bar'}
            parking={sessionParking}
            floor={sessionFloor}
            spot={sessionSpot}
            startTime={sessionStartTime}
            onEnd={() => setSessionView('detail')}
          />
        )}

        {bannerVisible && (
          <div style={{
            position: 'absolute',
            bottom: '120px',
            left: '16px',
            right: '16px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 99999
          }}>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A1A' }}>
              ¿Ya estás en el parking?
            </span>
            <button
              onClick={() => {
                setBannerVisible(false)
                handleStartRegistration()
              }}
              style={{
                background: '#FF9300',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '999px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Registrar mi plaza
            </button>
          </div>
        )}

        <RegisterSpotSheet 
          isOpen={showRegisterSheet}
          parking={sessionParking}
          onConfirm={handleConfirmRegistration}
          onClose={() => setShowRegisterSheet(false)}
        />

        <FindVehicleSheet 
          isOpen={sessionActive && sessionView === 'detail'}
          parking={sessionParking}
          floor={sessionFloor}
          spot={sessionSpot}
          startTime={sessionStartTime}
          onClose={() => setSessionView('bar')}
          onEndSession={handleEndSession}
        />
      </div>
    </div>
  );
}

export default App;
