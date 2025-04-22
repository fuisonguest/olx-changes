import React from 'react';
import { Box, Heading, Grid, Text, Badge, Flex, Button } from '@chakra-ui/react';

// Simplified JobDetailsDisplay that directly displays the job data as received
const JobDetailsDisplay = ({ jobData }) => {
  console.log("JobDetailsDisplay received data:", jobData);
  
  // Try to handle string format, just in case
  let normalizedData = jobData;
  if (typeof normalizedData === 'string') {
    try {
      normalizedData = JSON.parse(normalizedData);
      console.log("Parsed job data from string:", normalizedData);
    } catch (error) {
      console.error("Failed to parse job data string:", error);
      return (
        <Box padding="4" bg="yellow.50" borderRadius="md" borderWidth="1px" borderColor="yellow.200" mt="4">
          <Text color="yellow.700">Error parsing job data. Please try again.</Text>
        </Box>
      );
    }
  }
  
  // If no data, don't render
  if (!normalizedData || Object.keys(normalizedData).length === 0) {
    return null;
  }

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
    fullWidthItem: {
      backgroundColor: 'white',
      borderRadius: '6px',
      padding: '15px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      gridColumn: '1 / -1'
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
    },
    salary: {
      color: 'green.600',
      fontWeight: '600'
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

  // Format salary display
  const formatSalary = () => {
    if (!normalizedData.salaryFrom && !normalizedData.salaryTo) return "Not specified";
    
    if (normalizedData.salaryFrom && normalizedData.salaryTo) {
      return `₹${normalizedData.salaryFrom} - ₹${normalizedData.salaryTo} per ${normalizedData.salaryPeriod?.toLowerCase() || 'month'}`;
    }
    
    if (normalizedData.salaryFrom) {
      return `₹${normalizedData.salaryFrom}+ per ${normalizedData.salaryPeriod?.toLowerCase() || 'month'}`;
    }
    
    if (normalizedData.salaryTo) {
      return `Up to ₹${normalizedData.salaryTo} per ${normalizedData.salaryPeriod?.toLowerCase() || 'month'}`;
    }
    
    return "Not specified";
  };

  // Job detail fields to display
  const jobFields = [
    { key: 'jobRole', label: 'Job Role', fullWidth: true },
    { key: 'jobCategory', label: 'Job Category' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'positionType', label: 'Position Type' },
    { key: 'salary', label: 'Salary', valueFunc: formatSalary },
    { key: 'jobLocation', label: 'Location' },
    { key: 'educationRequired', label: 'Education Required' },
    { key: 'experienceRequired', label: 'Experience Required' },
    { key: 'openings', label: 'Number of Openings' },
  ];

  return (
    <Box sx={styles.container}>
      <Heading size="md" mb={4}>Job Details</Heading>
      
      <Grid sx={styles.grid}>
        {jobFields.map(field => {
          // Skip if no value, or if it's the salary field but no salary data
          if (
            !field.valueFunc && !normalizedData[field.key] || 
            (field.key === 'salary' && !normalizedData.salaryFrom && !normalizedData.salaryTo)
          ) return null;
          
          // Get the display value
          const displayValue = field.valueFunc 
            ? field.valueFunc() 
            : normalizedData[field.key];
          
          return field.fullWidth ? (
            <Box 
              key={field.key}
              sx={styles.fullWidthItem}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Text sx={styles.label}>{field.label}</Text>
              <Text mt={2} fontSize="xl" fontWeight="bold">{displayValue}</Text>
            </Box>
          ) : (
            <Box 
              key={field.key}
              sx={styles.detailItem}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Text sx={styles.label}>{field.label}</Text>
              <Text sx={field.key === 'salary' ? styles.salary : styles.value}>
                {displayValue}
              </Text>
            </Box>
          );
        })}
        
        {/* Skills section */}
        {normalizedData.skills && (
          <Box 
            sx={styles.fullWidthItem}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Text sx={styles.label} mb={2}>Skills Required</Text>
            <Flex wrap="wrap" mt={2} gap={2}>
              {normalizedData.skills.split(',').map((skill, index) => (
                <Badge 
                  key={index} 
                  colorScheme="blue" 
                  p={2} 
                  borderRadius="md"
                >
                  {skill.trim()}
                </Badge>
              ))}
            </Flex>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default JobDetailsDisplay; 