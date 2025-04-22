import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Text, 
  Input, 
  FormControl, 
  FormLabel, 
  useToast, 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription 
} from '@chakra-ui/react';
import axios from 'axios';

const FixJobData = ({ productId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Fix job data that wasn't properly saved
  const handleFixJobData = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Get the current auth token
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError("You must be logged in to fix job data");
        setIsLoading(false);
        return;
      }

      // First, fetch the current product data
      const response = await axios.post(
        `https://chages-new-olx.onrender.com/previewad/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const productData = response.data.product;
      console.log("Current product data:", productData);

      // Create job data if it doesn't exist or is in incorrect format
      const jobData = {
        jobRole: "Job Title", // Default values
        jobCategory: productData.subcatagory || "Data entry & Back office",
        companyName: productData.owner || "",
        positionType: "Full-time",
        salaryPeriod: "Monthly",
        salaryFrom: productData.price || "",
        salaryTo: "",
        educationRequired: "Any",
        experienceRequired: "Fresher",
        jobLocation: (productData.address && productData.address[0]) 
          ? `${productData.address[0].city}, ${productData.address[0].state}` 
          : "",
        skills: "",
        openings: "1"
      };

      // Directly update the product with the job data using the existing endpoint
      const updateResponse = await axios.post(
        `https://chages-new-olx.onrender.com/updateproduct/${productId}`,
        {
          jobData: jobData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult({ message: "Job data updated successfully" });
      toast({
        title: "Job data fixed",
        description: "The job data has been updated successfully. Please refresh the page.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Refresh the page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err) {
      console.error("Error fixing job data:", err);
      setError(err.response?.data?.message || err.message || "An error occurred");
      toast({
        title: "Error",
        description: "Failed to fix job data. See details below.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box my={4} p={4} borderWidth="1px" borderRadius="lg" bg="yellow.50">
      <Text mb={4} fontWeight="bold">Job Data Fixer</Text>
      
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Error:</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {result && (
        <Alert status="success" mb={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Success:</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}
      
      <Button
        colorScheme="yellow"
        onClick={handleFixJobData}
        isLoading={isLoading}
        loadingText="Fixing..."
        width="full"
      >
        Fix Job Data
      </Button>
      
      <Text mt={2} fontSize="sm" color="gray.600">
        This will repair job data for this listing. Use this only if job details are not displaying correctly.
      </Text>
    </Box>
  );
};

export default FixJobData; 
