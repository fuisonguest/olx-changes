import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Badge, 
  Grid, 
  Flex, 
  Icon, 
  Button,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { FaBed, FaBath, FaRulerCombined, FaBuilding, FaParking } from 'react-icons/fa';
import { MdLocationOn, MdPerson } from 'react-icons/md';
import PropertyDetailsDisplay from './PropertyDetailsDisplay';
import { extractPropertyData } from '../utils/PropertyDataUtils';

const PropertyView = ({ productId }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        
        // Try authenticated request first
        const endpoint = authToken 
          ? `http://localhost:5000/previewad/${productId}`
          : `http://localhost:5000/previewad/notloggedin/${productId}`;
        
        const headers = authToken 
          ? { Authorization: `Bearer ${authToken}` }
          : {};
        
        const response = await axios.post(endpoint, {}, { headers });
        
        // Extract product data
        const productData = response.data.product || response.data;
        
        // Normalize property data
        const normalizedPropertyData = extractPropertyData(productData);
        
        // Update the product with the normalized data
        setProperty({
          ...productData,
          propertyData: normalizedPropertyData
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching property data:', err);
        setError('Failed to load property details');
        setLoading(false);
        
        toast({
          title: 'Error',
          description: 'Failed to load property details',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    
    if (productId) {
      fetchPropertyData();
    }
  }, [productId, authToken, toast]);

  if (loading) {
    return (
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <Text>Loading property details...</Text>
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <Text color="red.500">{error || 'Property not found'}</Text>
      </Box>
    );
  }

  const { title, price, address, propertyData, owner, useremail } = property;

  // Quick info items to display
  const quickInfoItems = [
    { 
      icon: FaBed, 
      value: propertyData.bhk || propertyData.bedrooms || 'N/A', 
      label: 'Bedrooms' 
    },
    { 
      icon: FaBath, 
      value: propertyData.bathrooms || 'N/A', 
      label: 'Bathrooms' 
    },
    { 
      icon: FaRulerCombined, 
      value: propertyData.carpetArea ? `${propertyData.carpetArea} sq.ft` : 'N/A', 
      label: 'Carpet Area' 
    },
    { 
      icon: FaBuilding, 
      value: propertyData.floorNo || 'N/A', 
      label: 'Floor' 
    },
    { 
      icon: FaParking, 
      value: propertyData.carParking || 'N/A', 
      label: 'Parking' 
    }
  ];

  return (
    <Box>
      {/* Property Title & Price */}
      <Box mb={6}>
        <Heading size="lg" mb={2}>
          {title}
          {property.isPromoted && (
            <Badge colorScheme="green" ml={2}>Best One</Badge>
          )}
        </Heading>
        
        <Flex alignItems="center" mb={2}>
          <Icon as={MdLocationOn} color="gray.500" mr={1} />
          <Text color="gray.500" fontSize="sm">
            {address && address[0] ? 
              `${address[0].area}, ${address[0].city}, ${address[0].state}` : 
              "Location not specified"}
          </Text>
        </Flex>
        
        <Flex alignItems="center" mb={3}>
          <Icon as={MdPerson} color="gray.500" mr={1} />
          <Text color="gray.500" fontSize="sm">
            Listed by: {owner || useremail || "Unknown"}
          </Text>
        </Flex>
        
        <Heading size="xl" color="green.500">
          ₹{price}
          {propertyData.maintenance && (
            <Text as="span" fontSize="md" color="gray.500" ml={2}>
              + ₹{propertyData.maintenance}/month
            </Text>
          )}
        </Heading>
      </Box>
      
      {/* Quick Property Info */}
      <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={4} mb={6}>
        {quickInfoItems.map((item, index) => (
          <Box 
            key={index} 
            p={3} 
            borderWidth="1px" 
            borderRadius="md" 
            textAlign="center" 
            _hover={{ 
              transform: 'translateY(-2px)', 
              boxShadow: 'md',
              transition: 'all 0.3s'
            }}
          >
            <Icon as={item.icon} boxSize={6} color="blue.500" mb={1} />
            <Text fontWeight="bold">{item.value}</Text>
            <Text fontSize="sm" color="gray.500">{item.label}</Text>
          </Box>
        ))}
      </Grid>
      
      {/* Detailed Property Info */}
      <PropertyDetailsDisplay propertyData={propertyData} />
      
      {/* Contact Buttons */}
      <Flex mt={6} gap={4}>
        <Button colorScheme="blue" size="lg" flex={1}>
          Contact Owner
        </Button>
        <Button colorScheme="green" size="lg" flex={1}>
          Schedule Visit
        </Button>
      </Flex>
    </Box>
  );
};

export default PropertyView; 