import React from 'react';
import { Box, Heading, Grid, Text } from '@chakra-ui/react';

const MobileDetailsDisplay = ({ mobileData }) => {
  // If no mobile data, return null
  if (!mobileData) return null;
  
  // If no valid data after normalization, don't render
  if (Object.keys(mobileData).length === 0) return null;

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

  // Format the mobile data
  const mobileFields = [
    { key: 'brand', label: 'Brand' },
    { key: 'condition', label: 'Condition' }
  ];

  return (
    <Box sx={styles.container}>
      <Heading size="md" mb={4}>Mobile Details</Heading>
      
      <Grid sx={styles.grid}>
        {mobileFields.map(field => {
          // Only render if the data has this field
          if (!mobileData[field.key]) return null;
          
          return (
            <Box 
              key={field.key}
              sx={styles.detailItem}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Text sx={styles.label}>{field.label}</Text>
              <Text sx={styles.value}>{mobileData[field.key]}</Text>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};

export default MobileDetailsDisplay; 