import React from 'react';
import { Box, Heading, Grid, Text } from '@chakra-ui/react';
import { normalizePropertyData, getPropertyTypeLabel, getFormattedAmenities } from '../utils/PropertyDataUtils';

const PropertyDetailsDisplay = ({ propertyData }) => {
  // If no property data, return null
  if (!propertyData) return null;

  // Parse and normalize the property data
  const data = normalizePropertyData(propertyData);
  
  // If no valid data after normalization, don't render
  if (Object.keys(data).length === 0) return null;

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      marginTop: '20px',
      marginBottom: '20px'
    },
    grid: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '16px',
      marginTop: '20px'
    },
    detailItem: {
      backgroundColor: 'white',
      borderRadius: '6px',
      padding: '10px 15px',
      display: 'flex',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    label: {
      fontWeight: '600',
      color: '#666',
      fontSize: '0.9rem'
    },
    value: {
      fontWeight: '500',
      color: '#333',
      textAlign: 'right'
    }
  };

  // Function to handle hover effects
  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
  };

  // Property fields to display and their labels
  const propertyFields = [
    { key: 'propertyType', label: 'Property Type', formatter: getPropertyTypeLabel },
    { key: 'bhk', label: 'BHK' },
    { key: 'bedrooms', label: 'Bedrooms' },
    { key: 'bathrooms', label: 'Bathrooms' },
    { key: 'furnishing', label: 'Furnishing' },
    { key: 'projectStatus', label: 'Project Status' },
    { key: 'construction_status', label: 'Construction Status' },
    { key: 'listedBy', label: 'Listed By' },
    { key: 'superBuiltupArea', label: 'Super Builtup Area', unit: 'sq.ft' },
    { key: 'carpetArea', label: 'Carpet Area', unit: 'sq.ft' },
    { key: 'maintenance', label: 'Maintenance', prefix: '₹', suffix: '/month' },
    { key: 'totalFloors', label: 'Total Floors' },
    { key: 'floorNo', label: 'Floor Number' },
    { key: 'carParking', label: 'Car Parking' },
    { key: 'facing', label: 'Facing' },
    { key: 'projectName', label: 'Project Name' },
    { key: 'age', label: 'Age' },
    { key: 'balconies', label: 'Balconies' },
    { key: 'description', label: 'Description' }
  ];

  // Get formatted amenities
  const amenitiesList = data.amenities ? getFormattedAmenities(data.amenities) : [];

  return (
    <Box sx={styles.container}>
      <Heading size="md" mb={4}>Property Details</Heading>
      
      <Grid sx={styles.grid}>
        {propertyFields.map(field => {
          // Only render if the data has this field
          if (!data[field.key]) return null;
          
          // Format the value
          let displayValue = data[field.key];
          
          // Use formatter if provided
          if (field.formatter) {
            displayValue = field.formatter(displayValue);
          }
          
          // Add units or prefixes if needed
          if (field.unit) {
            displayValue = `${displayValue} ${field.unit}`;
          }
          
          if (field.prefix) {
            displayValue = `${field.prefix}${displayValue}`;
          }
          
          if (field.suffix) {
            displayValue = `${displayValue}${field.suffix}`;
          }
          
          return (
            <Box 
              key={field.key}
              sx={styles.detailItem}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Text sx={styles.label}>{field.label}</Text>
              <Text sx={styles.value}>{displayValue}</Text>
            </Box>
          );
        })}
      </Grid>
      
      {/* Amenities section, only if present */}
      {amenitiesList.length > 0 && (
        <Box mt={6}>
          <Heading size="sm" mb={3}>Amenities</Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={3}>
            {amenitiesList.map((amenity) => (
              <Box 
                key={amenity}
                p={2}
                bg="teal.50"
                borderRadius="md"
                textAlign="center"
                border="1px solid"
                borderColor="teal.100"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Text fontWeight="500">{amenity}</Text>
              </Box>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default PropertyDetailsDisplay; 