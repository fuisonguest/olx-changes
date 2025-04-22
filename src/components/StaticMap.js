import React, { useState } from 'react';

const StaticMap = ({ latitude, longitude, width = 400, height = 300, zoom = 15 }) => {
  // ✅ Moved hook to the top before any conditional return
  const [imageFailed, setImageFailed] = useState(false);

  // If no coordinates are provided, don't render anything
  if (!latitude || !longitude) {
    return null;
  }

  // OpenStreetMap static image
  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&markers=${latitude},${longitude},red`;

  // Google Maps static image as fallback
  const googleMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${latitude},${longitude}`;

  const handleImageError = () => {
    console.log("OpenStreetMap static image failed to load, switching to fallback");
    setImageFailed(true);
  };

  return (
    <div className="static-map-container">
      {!imageFailed ? (
        <img 
          src={mapUrl} 
          alt="Location Map" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            maxWidth: `${width}px`, 
            maxHeight: `${height}px`,
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}
          onError={handleImageError}
        />
      ) : (
        <div 
          style={{ 
            width: '100%', 
            height: `${height}px`,
            maxWidth: `${width}px`,
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            border: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Map location:</p>
          <p style={{ margin: '0' }}>Latitude: {latitude.toFixed(6)}</p>
          <p style={{ margin: '0' }}>Longitude: {longitude.toFixed(6)}</p>
          <a 
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: '15px',
              color: '#3182ce',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            View on Google Maps
          </a>
        </div>
      )}
      <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '4px' }}>
        Map data © OpenStreetMap contributors
      </div>
    </div>
  );
};

export default StaticMap;
