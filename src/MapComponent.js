import React, { useState, useEffect } from 'react';
import { Button, Box, Flex, Text } from '@chakra-ui/react';

export default function MapComponent({ location }) {
  console.log("Map location data:", location);
  
  // Use default coordinates for Hyderabad if location data is invalid
  const lat = location && location.lat ? location.lat : 17.385044;
  const lng = location && location.lng ? location.lng : 78.486671;

  // State to track if OpenStreetMap fails to load
  const [osmFailed, setOsmFailed] = useState(false);

  // Create OpenStreetMap URL with the location coordinates
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  
  // Create Google Maps embed URL as fallback
  const googleMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3828.667798207716!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40wMCdTIDE3M8KwNDAnRQ!5e0!3m2!1sen!2sin!4v1616661315372!5m2!1sen!2sin`;
  
  // Create Google Maps navigation URL
  const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  // Function to handle iframe load error
  const handleMapError = () => {
    console.log("OpenStreetMap failed to load, switching to Google Maps");
    setOsmFailed(true);
  };

  return (
    <Box>
      {!osmFailed ? (
        <iframe 
          width="100%" 
          height="300" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight="0" 
          marginWidth="0" 
          src={mapUrl}
          style={{ border: '1px solid #ccc', borderRadius: '4px' }}
          title="Location Map"
          onError={handleMapError}
        />
      ) : (
        <iframe 
          width="100%" 
          height="300" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight="0" 
          marginWidth="0" 
          src={googleMapUrl}
          style={{ border: '1px solid #ccc', borderRadius: '4px' }}
          title="Location Map (Google)"
          allowFullScreen
        />
      )}
      
      <Flex justifyContent="flex-end" mt={2}>
        <Button
          as="a"
          href={navigationUrl}
          target="_blank"
          rel="noopener noreferrer"
          colorScheme="blue"
          size="sm"
        >
          📍 Get Directions
        </Button>
      </Flex>
    </Box>
  );
}
