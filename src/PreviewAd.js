import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useToast,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { Carousel } from "react-bootstrap";
import CurrencyRupeeTwoToneIcon from "@mui/icons-material/CurrencyRupeeTwoTone";
import { MDBCardImage, MDBCol, MDBRow } from "mdb-react-ui-kit";
import MapComponent from "./MapComponent";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Modallogin from "./Modallogin";
import Loading from "./resources/Loading";
import NotFoundComponent from "./resources/NotFound";
import { initializeRazorpay } from './razorpayUtils';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareProduct from "./components/ShareProduct";
import StaticMap from './components/StaticMap';
import { FaDirections } from 'react-icons/fa';
import PropertyDetailsDisplay from './components/PropertyDetailsDisplay';
import MobileDetailsDisplay from './components/MobileDetailsDisplay';
import JobDetailsDisplay from './components/JobDetailsDisplay';
import FixJobData from './components/FixJobData';
import { extractPropertyData } from './utils/PropertyDataUtils';
import { extractJobData } from './utils/JobDataUtils';

const PreviewAd = ({auth}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [own, setOwn] = useState();
  const [loading, setLoading] = useState(true);
  const [NotFound, setNotFound] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // New state for debug data
  const [debugData, setDebugData] = useState(null);
  const [debugLoading, setDebugLoading] = useState(false);
  const [debugError, setDebugError] = useState(null);

  // for register and login
  const [staticModal, setStaticModal] = useState(false);
  const toggleShow = () => setStaticModal(!staticModal);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/previewad/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setOwn(response.data.own);
      setData(response.data.product);
      setLoading(false); // Set loading state to false when data is fetched successfully
    } catch (error) {
      // console.error(error);
      // when not loged in
      // make changes for not loged in user as authToken is not updated so data is not recieved .
      setOwn(false);
      try{
        const notlogedindata = await axios.post(`http://localhost:5000/previewad/notloggedin/${id}`);
      setData(notlogedindata.data.product);
      setLoading(false); // Set loading state to false when data is fetched successfully
      }
      catch(e){
        setLoading(false);
        setNotFound(true); 
      }
    }
  };

  useEffect(() => {
    fetchData();
    // Also fetch debug data
    fetchDebugData();
  }, []);

  useEffect(() => {
    console.log("Full data:", data);
    console.log("Vehicle data:", data.vehicleData);
    console.log("Property data:", data.propertyData);
    console.log("Job data:", data.jobData);
    console.log("Property data type:", data.propertyData ? typeof data.propertyData : 'No property data');
    console.log("Job data type:", data.jobData ? typeof data.jobData : 'No job data');
    
    // Extract and normalize property data if it exists
    if (data && data.propertyData) {
      const normalizedPropertyData = extractPropertyData(data);
      
      if (Object.keys(normalizedPropertyData).length > 0) {
        console.log("Normalized property data:", normalizedPropertyData);
        
        // Only update if we have extracted valid property data
        setData(prevData => ({
          ...prevData,
          propertyData: normalizedPropertyData
        }));
      }
    }

    // Extract and normalize job data if it exists
    if (data && data.jobData) {
      try {
        let jobData = data.jobData;
        
        // Handle string vs object format
        if (typeof jobData === 'string') {
          try {
            console.log("Attempting to parse job data string");
            jobData = JSON.parse(jobData);
          } catch (e) {
            console.error("Failed to parse job data string:", e);
          }
        }
        
        if (jobData && typeof jobData === 'object') {
          // Use the exact data from the form without altering it
          console.log("Using original job data from database:", jobData);
          
          // Update state with original job data
          setData(prevData => ({
            ...prevData,
            jobData: jobData
          }));
        }
      } catch (error) {
        console.error("Error processing job data:", error);
      }
    } else if (data && (data.catagory === "Jobs" || (data.subcatagory && data.subcatagory.toLowerCase().includes("job")))) {
      // Create minimal job data for job listings that don't have any
      console.log("Creating minimal job data for job listing");
      const autoJobData = {
        jobRole: data.title || "",
        jobCategory: data.subcatagory || ""
      };
      
      setData(prevData => ({
        ...prevData,
        jobData: autoJobData
      }));
    }
  }, [data._id]); // Only run when the product ID changes

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!authToken || !id) return;
      
      try {
        const response = await axios.get(`http://localhost:5000/wishlist/check/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setIsInWishlist(response.data.inWishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };
    
    checkWishlistStatus();
  }, [authToken, id]);

  const handlePromoteClick = () => {
    onOpen();
  };

  const handlePromoteConfirm = async () => {
    try {
      console.log("Creating promotion order for product:", id);
      
      // If we're using client-side only integration (no server-side order creation)
      const useClientSideOnly = true; // Set this to true if you only have the key ID
      
      if (useClientSideOnly) {
        // Client-side only integration with just the key ID
        const options = {
          key: "rzp_live_FcuvdvTYCmLf7m", // Your Razorpay Key ID
          amount: 3000, // amount in paise (30 INR) - must be in paise (100 paise = 1 INR)
          currency: "INR",
          name: "OLX Clone",
          description: "Product Promotion Payment for 30 days",
          handler: async function (response) {
            console.log("Payment successful:", response);
            
            try {
              // Update promotion status in the database
              const updateResponse = await axios.post(
                "http://localhost:5000/update-promotion-status",
                { productId: id },
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );
              
              console.log("Promotion status updated:", updateResponse.data);
              
              // Update local state
              setData({
                ...data,
                isPromoted: true,
                promotionStartDate: new Date(),
                promotionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              });
              
              toast({
                title: "Promotion Successful",
                description: "Your product will be displayed at the top with a 'Best One' label for 30 days.",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
            } catch (error) {
              console.error("Error updating promotion status:", error);
              
              // Even if server update fails, still update UI
              setData({
                ...data,
                isPromoted: true,
                promotionStartDate: new Date(),
                promotionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              });
              
              toast({
                title: "Promotion Partially Successful",
                description: "Payment was successful but there was an issue updating the server. Your product will still be displayed as promoted.",
                status: "warning",
                duration: 5000,
                isClosable: true,
              });
            }
            
            onClose();
          },
          prefill: {
            name: data?.owner || "User",
            email: localStorage.getItem("userEmail") || "",
            contact: "" // Empty string allows user to enter their number
          },
          notes: {
            productId: id,
            productTitle: data.title
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: function() {
              console.log("Payment modal dismissed");
              toast({
                title: "Payment Cancelled",
                description: "You cancelled the payment process.",
                status: "info",
                duration: 3000,
                isClosable: true,
              });
            },
            confirm_close: true, // Ask for confirmation when closing the modal
            escape: true, // Allow closing with ESC key
            animation: true // Enable animations
          },
        };
        
        console.log("Initializing Razorpay with client-side only options");
        
        // Initialize Razorpay
        try {
          await initializeRazorpay(options);
        } catch (error) {
          console.error("Razorpay initialization error:", error);
          toast({
            title: "Payment Failed",
            description: "Could not initialize payment gateway. Please try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        
        return;
      }
      
      // Server-side integration (requires both key ID and secret)
      // Create Razorpay order
      const orderResponse = await axios.post(
        "http://localhost:5000/create-promotion-order",
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      console.log("Order created successfully:", orderResponse.data);
      
      const { orderId, amount, currency, keyId } = orderResponse.data;
      
      // Configure Razorpay options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "OLX Clone",
        description: "Product Promotion Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            console.log("Payment successful, verifying payment:", response);
            
            // Verify payment with server
            const verifyResponse = await axios.post(
              "http://localhost:5000/verify-promotion-payment",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                productId: id,
              },
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            
            console.log("Payment verified successfully:", verifyResponse.data);
            
            // Update local state
            setData({
              ...data,
              isPromoted: true,
              promotionStartDate: new Date(),
              promotionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
            
            toast({
              title: "Promotion Successful",
              description: "Your product will be displayed at the top with a 'Best One' label for 30 days.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            
            onClose();
          } catch (error) {
            console.error("Payment verification error:", error);
            
            let errorMessage = "There was an issue verifying your payment. Please contact support.";
            
            if (error.response && error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message;
            }
            
            toast({
              title: "Payment Verification Failed",
              description: errorMessage,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        },
        prefill: {
          name: "User",
          email: localStorage.getItem("userEmail") || "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
              status: "info",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      };
      
      console.log("Initializing Razorpay with options:", { ...options, key: options.key.substring(0, 8) + '...' });
      
      // Initialize Razorpay
      try {
        await initializeRazorpay(options);
      } catch (error) {
        console.error("Razorpay initialization error:", error);
        toast({
          title: "Payment Failed",
          description: "Could not initialize payment gateway. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      
    } catch (error) {
      console.error("Promotion error:", error);
      
      // Display more specific error message
      let errorMessage = "There was an issue creating the promotion order. Please try again.";
      
      if (error.response && error.response.data) {
        console.error("Server error response:", error.response.data);
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        if (error.response.data.error) {
          errorMessage += ` (${error.response.data.error})`;
        }
      }
      
      toast({
        title: "Promotion Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Add new function to fetch debug data
  const fetchDebugData = async () => {
    try {
      setDebugLoading(true);
      const response = await axios.get(`http://localhost:5000/debug/product/${id}`);
      console.log("Debug data:", response.data);
      setDebugData(response.data);
      setDebugError(null);
      
      // If we received valid property data from debug API but not from the normal API,
      // update the main data with debug property data
      if (response.data.rawProduct && 
          response.data.rawProduct.propertyData && 
          (!data.propertyData || typeof data.propertyData === 'undefined')) {
        console.log("Updating data with property data from debug API");
        setData(prev => ({
          ...prev,
          propertyData: response.data.rawProduct.propertyData
        }));
      }

      // If we received valid job data from debug API but not from the normal API,
      // update the main data with debug job data
      if (response.data.rawProduct && 
          response.data.rawProduct.jobData && 
          (!data.jobData || typeof data.jobData === 'undefined')) {
        console.log("Updating data with job data from debug API");
        setData(prev => ({
          ...prev,
          jobData: response.data.rawProduct.jobData
        }));
      }
    } catch (error) {
      console.error("Error fetching debug data:", error);
      setDebugError(error.message);
    } finally {
      setDebugLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (NotFound) {
      return <NotFoundComponent />;
  }

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await axios.delete(`http://localhost:5000/myads_delete/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setIsRemoving(false);
      toast({
        title: "Ad Removed",
        description: "The ad has been successfully removed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/myads");
    } catch (error) {
      console.error(error);
      setIsRemoving(false);
      toast({
        title: "Error",
        description: "There was an error removing the ad.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleClick = async function(){
    if(auth){
     window.location.href = `/chat/${id}/${data.useremail}`
    }
    else{
    toggleShow();
    }
  }
  const address = data.address?.[0] || {};

  const ProductPics = Object.keys(data)
    .filter((key) => key.startsWith("productpic") && data[key])
    .map((key) => data[key]);

  const createdAt = new Date(data.createdAt);
  const now = new Date();
  // Calculate the time difference in milliseconds
  const timeDiff = now.getTime() - createdAt.getTime();
  // Convert milliseconds to days
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  const handleWishlistToggle = async () => {
    if (!authToken) {
      toggleShow(); // Show login modal if not logged in
      return;
    }

    try {
      setIsWishlistLoading(true);
      
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`http://localhost:5000/wishlist/remove/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setIsInWishlist(false);
        toast({
          title: "Removed from Wishlist",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add to wishlist
        await axios.post(
          "http://localhost:5000/wishlist/add",
          { productId: id },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setIsInWishlist(true);
        toast({
          title: "Added to Wishlist",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Fix job data function
  const handleFixJobData = async () => {
    try {
      // Get the current auth token
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to fix job data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Log info about the current data
      console.log("Current data:", data);
      console.log("Product ID:", id);

      // Create basic job data with minimal defaults
      const jobData = {
        jobRole: data.title || "",
        jobCategory: data.subcatagory || "",
        positionType: "Full-time",
        salaryPeriod: "Monthly"
      };

      console.log("Simple job data to be sent:", jobData);

      // Update the product with the job data using the existing endpoint
      const updateResponse = await axios.post(
        `http://localhost:5000/updateproduct/${id}`,
        {
          jobData: jobData // Send the object directly
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update response:", updateResponse.data);

      toast({
        title: "Job data fixed",
        description: "The job data has been updated. Refreshing...",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh the page after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      console.error("Error fixing job data:", err);
      toast({
        title: "Error",
        description: "Failed to fix job data: " + (err.response?.data?.message || err.message || "An error occurred"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Add a new section to display debug data in the UI
  const renderDebugSection = () => {
    if (debugLoading) {
      return <Text>Loading debug data...</Text>;
    }
    
    if (debugError) {
      return <Text color="red.500">Error loading debug data: {debugError}</Text>;
    }
    
    if (!debugData) {
      return <Text>No debug data available</Text>;
    }
    
    // Create diagnostics for job data
    const jobDataType = data.jobData ? typeof data.jobData : 'undefined';
    const jobDataExists = !!data.jobData;
    const jobDataKeys = data.jobData ? Object.keys(data.jobData) : [];
    const jobDataStringified = data.jobData ? JSON.stringify(data.jobData, null, 2) : 'null';
    
    return (
      <Box border="1px" borderColor="red.200" p={4} borderRadius="md" bg="red.50">
        <Heading size="sm" color="red.500">Detailed Debug Information</Heading>
        <Text fontSize="xs" mt={2}>Database ID: {debugData.diagnostics.databaseId}</Text>
        
        <Divider my={2} />
        
        <Heading size="xs" color="red.500" mt={3}>Property Data</Heading>
        <Text fontSize="xs">Property Data Exists: {debugData.diagnostics.propertyDataExists ? 'Yes' : 'No'}</Text>
        <Text fontSize="xs">Property Data Type: {debugData.diagnostics.propertyDataType}</Text>
        <Text fontSize="xs">Property Data Keys: {debugData.diagnostics.propertyDataKeys.join(', ') || 'None'}</Text>
        
        <Heading size="xs" mt={3} mb={1}>Raw Property Data:</Heading>
        <Box 
          as="pre" 
          fontSize="2xs" 
          p={2} 
          bg="white" 
          borderRadius="sm" 
          maxHeight="200px" 
          overflowY="auto"
          whiteSpace="pre-wrap"
        >
          {debugData.diagnostics.propertyDataStringified || 'null'}
        </Box>
        
        <Divider my={2} />
        
        <Heading size="xs" color="red.500" mt={3}>Job Data</Heading>
        <Text fontSize="xs">Job Data Exists: {jobDataExists ? 'Yes' : 'No'}</Text>
        <Text fontSize="xs">Job Data Type: {jobDataType}</Text>
        <Text fontSize="xs">Job Data Keys: {jobDataKeys.join(', ') || 'None'}</Text>
        
        <Heading size="xs" mt={3} mb={1}>Raw Job Data:</Heading>
        <Box 
          as="pre" 
          fontSize="2xs" 
          p={2} 
          bg="white" 
          borderRadius="sm" 
          maxHeight="200px" 
          overflowY="auto"
          whiteSpace="pre-wrap"
        >
          {jobDataStringified || 'null'}
        </Box>
        
        <Button 
          size="xs" 
          colorScheme="red" 
          mt={3}
          onClick={() => {
            // If we have property data in debug response, try to update the main state
            if (debugData.rawProduct && debugData.rawProduct.propertyData) {
              setData(prev => ({
                ...prev,
                propertyData: debugData.rawProduct.propertyData
              }));
              toast({
                title: "Data updated",
                description: "Property data updated from debug info",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            }
            
            // If we have job data in debug response, try to update the main state
            if (debugData.rawProduct && debugData.rawProduct.jobData) {
              setData(prev => ({
                ...prev,
                jobData: debugData.rawProduct.jobData
              }));
              toast({
                title: "Data updated",
                description: "Job data updated from debug info",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            }
          }}
        >
          Try to fix with debug data
        </Button>
      </Box>
    );
  };

  return (
    <div>
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
        className="mt-3 ms-3"
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to={`/catagory/${data.catagory}`}>
            {data.catagory}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{data.subcatagory}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <MDBRow className="mt-3 mb-3">
        <MDBCol md="8">
          <Card>
            <CardBody>
              <Carousel>
                {data.productpic1 && (
                  <Carousel.Item>
                    <MDBCardImage
                      src={data.productpic1}
                      alt="First slide"
                      className="d-block w-100"
                      style={{ maxHeight: "500px", objectFit: "contain" }}
                    />
                  </Carousel.Item>
                )}
                {data.productpic2 && (
                  <Carousel.Item>
                    <MDBCardImage
                      src={data.productpic2}
                      alt="Second slide"
                      className="d-block w-100"
                      style={{ maxHeight: "500px", objectFit: "contain" }}
                    />
                  </Carousel.Item>
                )}
                {data.productpic3 && (
                  <Carousel.Item>
                    <MDBCardImage
                      src={data.productpic3}
                      alt="Third slide"
                      className="d-block w-100"
                      style={{ maxHeight: "500px", objectFit: "contain" }}
                    />
                  </Carousel.Item>
                )}
              </Carousel>
            </CardBody>
          </Card>
          <Card className="mt-3">
            <CardHeader>
              <Heading size="md">Details</Heading>
            </CardHeader>
            <CardBody>
              <Stack divider={<Divider />} spacing="4">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Price
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    <CurrencyRupeeTwoToneIcon />
                    {data.price}
                    {data.isPromoted && (
                      <Badge colorScheme="green" ml={2} className="best-one-badge">
                        Best One
                      </Badge>
                    )}
                    {data.isGoodForBestOne && (
                      <Badge colorScheme="blue" ml={2} className="good-for-best-one-badge">
                        Good for the best one
                      </Badge>
                    )}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Description
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {data.description}
                  </Text>
                </Box>
                {/* Vehicle Details Section */}
                {data.vehicleData && (
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      VEHICLE DETAILS
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      <div className="row">
                        {data.vehicleData.vehicleType && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Type: </span>
                            <span>{data.vehicleData.vehicleType === 'car' ? 'Car' : 'Bike'}</span>
                          </div>
                        )}
                        {data.vehicleData.brand && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Brand: </span>
                            <span>{data.vehicleData.brand}</span>
                          </div>
                        )}
                        {data.vehicleData.model && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Model: </span>
                            <span>{data.vehicleData.model}</span>
                          </div>
                        )}
                        {data.vehicleData.fuelType && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Fuel Type: </span>
                            <span>{data.vehicleData.fuelType.charAt(0).toUpperCase() + data.vehicleData.fuelType.slice(1)}</span>
                          </div>
                        )}
                        {data.vehicleData.year && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Year: </span>
                            <span>{data.vehicleData.year}</span>
                          </div>
                        )}
                        {data.vehicleData.month && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Month: </span>
                            <span>{data.vehicleData.month}</span>
                          </div>
                        )}
                        {data.vehicleData.ownership && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Ownership: </span>
                            <span>{data.vehicleData.ownership} owner</span>
                          </div>
                        )}
                        {data.vehicleData.kmDriven && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">KM Driven: </span>
                            <span>{data.vehicleData.kmDriven}</span>
                          </div>
                        )}
                        {data.vehicleData.color && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Color: </span>
                            <span>{data.vehicleData.color}</span>
                          </div>
                        )}
                        {data.vehicleData.registrationPlace && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Registration: </span>
                            <span>{data.vehicleData.registrationPlace}</span>
                          </div>
                        )}
                        {data.vehicleData.insurance && (
                          <div className="col-md-6 mb-2">
                            <span className="text-muted">Insurance: </span>
                            <span>{data.vehicleData.insurance}</span>
                          </div>
                        )}
                      </div>
                      
                      {data.vehicleData.features && (
                        <>
                          <Divider my={2} />
                          <Heading size="xs" mt={3} mb={2}>ADDITIONAL VEHICLE INFORMATION:</Heading>
                          <div className="row">
                            {data.vehicleData.features.abs !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">ABS: </span>
                                <span>{data.vehicleData.features.abs ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.accidental !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Accidental: </span>
                                <span>{data.vehicleData.features.accidental ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.adjustableMirror !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Adjustable External Mirror: </span>
                                <span>{data.vehicleData.features.adjustableMirror ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.adjustableSteering !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Adjustable Steering: </span>
                                <span>{data.vehicleData.features.adjustableSteering ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.airConditioning !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Air Conditioning: </span>
                                <span>{data.vehicleData.features.airConditioning ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.airbags && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Number of Airbags: </span>
                                <span>{data.vehicleData.features.airbags} airbags</span>
                              </div>
                            )}
                            {data.vehicleData.features.alloyWheels !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Alloy Wheels: </span>
                                <span>{data.vehicleData.features.alloyWheels ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.bluetooth !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Bluetooth: </span>
                                <span>{data.vehicleData.features.bluetooth ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.cruiseControl !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Cruise Control: </span>
                                <span>{data.vehicleData.features.cruiseControl ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.parkingSensors !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Parking Sensors: </span>
                                <span>{data.vehicleData.features.parkingSensors ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.powerSteering !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Power Steering: </span>
                                <span>{data.vehicleData.features.powerSteering ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.powerWindows !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Power Windows: </span>
                                <span>{data.vehicleData.features.powerWindows ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                            {data.vehicleData.features.rearCamera !== undefined && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted">Rear Parking Camera: </span>
                                <span>{data.vehicleData.features.rearCamera ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </Text>
                  </Box>
                )}
                
                {/* Category Data Section */}
                {data.categoryData && Object.keys(data.categoryData).length > 0 && (
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      {data.categoryData.type === "book" ? "BOOK DETAILS" : 
                       data.categoryData.type === "electronics" ? "ELECTRONICS DETAILS" :
                       data.categoryData.type === "furniture" ? "FURNITURE DETAILS" :
                       data.categoryData.type === "property" ? "PROPERTY DETAILS" :
                       data.categoryData.type === "mobile" ? "MOBILE DETAILS" :
                       data.categoryData.type === "fashion" ? "FASHION DETAILS" :
                       data.categoryData.type === "job" ? "JOB DETAILS" :
                       data.categoryData.type === "sports_hobbies" ? "SPORTS & HOBBIES DETAILS" :
                       data.categoryData.type === "pet" ? "PET DETAILS" : "DETAILS"}
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      <div className="row">
                        {/* Dynamic display of category-specific fields */}
                        {Object.entries(data.categoryData).map(([key, value]) => {
                          // Skip the type field since we use it for the heading
                          if (key === 'type') return null;
                          
                          // Format the key for display
                          const formattedKey = key.replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase())
                            .replace(/([a-z])([A-Z])/g, '$1 $2');
                          
                          // Format boolean values
                          let displayValue = value;
                          if (typeof value === 'boolean') {
                            displayValue = value ? 'Yes' : 'No';
                          }
                          
                          return (
                            <div className="col-md-6 mb-2" key={key}>
                              <span className="text-muted">{formattedKey}: </span>
                              <span>{displayValue}</span>
                            </div>
                          );
                        })}
                      </div>
                    </Text>
                  </Box>
                )}
                
                {/* Property Data Section */}
                {data && data.propertyData && (
                  <PropertyDetailsDisplay propertyData={data.propertyData} />
                )}
                
                {/* Mobile Data Section */}
                {data && data.categoryData && data.categoryData.type === "mobile" && (
                  <MobileDetailsDisplay mobileData={data.categoryData} />
                )}
                
                {/* Job Data Section */}
                {data && data.jobData ? (
                  // Try to parse job data if it's a string
                  typeof data.jobData === 'string' ? (
                    (() => {
                      try {
                        const parsedJobData = JSON.parse(data.jobData);
                        return <JobDetailsDisplay jobData={parsedJobData} />;
                      } catch (e) {
                        console.error("Failed to parse job data string:", e);
                        return (
                          <Box 
                            padding="4" 
                            bg="yellow.50" 
                            borderRadius="md" 
                            borderWidth="1px" 
                            borderColor="yellow.200"
                            mt="4"
                          >
                            <Text color="yellow.700">
                              Job details could not be parsed. Please try fixing the data.
                            </Text>
                            <Button 
                              mt="2" 
                              size="sm" 
                              colorScheme="yellow" 
                              onClick={handleFixJobData}
                            >
                              Try to fix data
                            </Button>
                          </Box>
                        );
                      }
                    })()
                  ) : (
                    // It's already an object, just display it
                    <JobDetailsDisplay jobData={data.jobData} />
                  )
                ) : (
                  // No job data at all
                  data.catagory === "Jobs" || (data.subcatagory && data.subcatagory.toLowerCase().includes("job")) ? (
                    <Box 
                      padding="4" 
                      bg="yellow.50" 
                      borderRadius="md" 
                      borderWidth="1px" 
                      borderColor="yellow.200"
                      mt="4"
                    >
                      <Text color="yellow.700">
                        Job details are not available. Please try refreshing the page or contact support.
                      </Text>
                      <Button 
                        mt="2" 
                        size="sm" 
                        colorScheme="yellow" 
                        onClick={handleFixJobData}
                      >
                        Try to fix data
                      </Button>
                    </Box>
                  ) : null
                )}
              </Stack>
            </CardBody>
          </Card>
        </MDBCol>
        <MDBCol md="4">
          <Card>
            <CardHeader>
              <Heading size="md">Seller Information</Heading>
            </CardHeader>
            <CardBody>
              <Flex>
                <Image
                  borderRadius="full"
                  boxSize="50px"
                  src={data.ownerpicture}
                  alt={data.owner}
                  mr="12px"
                />
                <Stack>
                  <Heading size="sm">{data.owner}</Heading>
                  <Text>Member since 2023</Text>
                </Stack>
              </Flex>
            </CardBody>
            <CardFooter>
              {own ? (
                <Flex width="100%" justifyContent="space-between">
                  <Button
                    colorScheme="red"
                    onClick={handleRemove}
                    isLoading={isRemoving}
                  >
                    Remove Ad
                  </Button>
                  {!data.isPromoted && (
                    <Button
                      colorScheme="green"
                      onClick={handlePromoteClick}
                    >
                      Promote Ad
                    </Button>
                  )}
                </Flex>
              ) : (
                <Flex width="100%" justifyContent="space-between">
                  <Button
                    colorScheme="blue"
                    width="60%"
                    onClick={authToken ? handleClick : toggleShow}
                  >
                    Chat with Seller
                  </Button>
                  <ShareProduct productId={id} title={data.title} />
                  <Button
                    variant="solid"
                    size="md"
                    colorScheme={isInWishlist ? "red" : "pink"}
                    onClick={handleWishlistToggle}
                    isLoading={isWishlistLoading}
                    width="15%"
                  >
                    {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </Button>
                </Flex>
              )}
            </CardFooter>
          </Card>
          <Card className="mt-3">
            <CardHeader>
              <Heading size="md">Posted in</Heading>
            </CardHeader>
            <CardBody>
              <Text>
                {data.address && data.address[0] && data.address[0].area},{" "}
                {data.address && data.address[0] && data.address[0].city},{" "}
                {data.address && data.address[0] && data.address[0].state},{" "}
                {data.address && data.address[0] && data.address[0].postcode}
              </Text>
              <MapComponent 
                location={{
                  lat: data.latitude || (data.address && data.address[0] ? data.address[0].latitude : null),
                  lng: data.longitude || (data.address && data.address[0] ? data.address[0].longitude : null)
                }} 
              />
            </CardBody>
          </Card>
        </MDBCol>
      </MDBRow>

      {/* Promotion Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Promote Your Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Promote your product for ₹30 to make it appear at the top of search results with a "Best One" label for 30 days.
            </Text>
            <Box p={4} borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">{data.title}</Text>
              <Text>Price: ₹{data.price}</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePromoteConfirm}>
              Pay ₹30
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {staticModal && <Modallogin toggleShow={toggleShow} />}
    </div>
  );
};

export default PreviewAd;
