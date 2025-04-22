import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Box,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import NotListedAnything from "./resources/NotListedAnything";
import { initializeRazorpay } from './razorpayUtils';

export default function Myads() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingCardId, setDeletingCardId] = useState(null);
  const [visibleproducts, setVisibleProducts] = useState(6);
  const hasMoreProductsToLoad = visibleproducts < ads.length;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/myads_view", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAds(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    getProducts();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      setDeletingCardId(id);
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/myads_delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAds(ads.filter((ad) => ad._id !== id));
      setDeletingCardId(null); // Reset the deleting card ID
    } catch (error) {
      console.error(error);
      setDeletingCardId(null); // Reset the deleting card ID
    }
  };

  const handlePromoteClick = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handlePromoteConfirm = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      console.log("Creating promotion order for product:", selectedProduct._id);
      
      // If we're using client-side only integration (no server-side order creation)
      const useClientSideOnly = true; // Set this to true if you only have the key ID
      
      if (useClientSideOnly) {
        // Client-side only integration with just the key ID
        const options = {
          key: "rzp_live_FcuvdvTYCmLf7m", // Your Razorpay Key ID
          amount: 300, // amount in paise (30 INR) - must be in paise (100 paise = 1 INR)
          currency: "INR",
          name: "OLX Clone",
          description: "Product Promotion Payment for 30 days",
          handler: async function (response) {
            console.log("Payment successful:", response);
            
            try {
              // Update promotion status in the database
              const updateResponse = await axios.post(
                "http://localhost:5000/update-promotion-status",
                { productId: selectedProduct._id },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              
              console.log("Promotion status updated:", updateResponse.data);
              
              // Update local state
              const updatedAds = ads.map(ad => 
                ad._id === selectedProduct._id 
                  ? { 
                      ...ad, 
                      isPromoted: true,
                      promotionStartDate: new Date(),
                      promotionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    } 
                  : ad
              );
              
              setAds(updatedAds);
              
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
              const updatedAds = ads.map(ad => 
                ad._id === selectedProduct._id 
                  ? { 
                      ...ad, 
                      isPromoted: true,
                      promotionStartDate: new Date(),
                      promotionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    } 
                  : ad
              );
              
              setAds(updatedAds);
              
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
            name: selectedProduct?.owner || "User",
            email: localStorage.getItem("userEmail") || "",
            contact: "9912937061" // Empty string allows user to enter their number
          },
          notes: {
            productId: selectedProduct._id,
            productTitle: selectedProduct.title
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
        { productId: selectedProduct._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
                productId: selectedProduct._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            
            console.log("Payment verified successfully:", verifyResponse.data);
            
            // Update local state
            const updatedAds = ads.map(ad => 
              ad._id === selectedProduct._id 
                ? { ...ad, isPromoted: true } 
                : ad
            );
            
            setAds(updatedAds);
            
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

  return (
    <div>
      {loading ? (
        <div className="back">
          <div className="lo-container">
            <ReactLoading
              type="spin"
              color="green"
              height={"10%"}
              width={"10%"}
            />
          </div>
        </div>
      ) : (
        <>
          <Container maxW="container.xl" mt={5}>
            <Heading as="h2" size="xl" textAlign="center" mb={5}>
              My Ads
            </Heading>
            {ads.length === 0 ? (
              <NotListedAnything />
            ) : (
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(auto-fit, minmax(300px, 1fr))",
                }}
                gap={6}
              >
                {ads.slice(0, visibleproducts).map((ad) => (
                  <GridItem key={ad._id}>
                    <Card maxW="sm">
                      <CardBody>
                        <Link to={`/preview_ad/${ad._id}`}>
                          <Image
                            src={ad.productpic1}
                            alt={ad.title}
                            borderRadius="lg"
                            maxH="200px"
                            maxW="400px"
                          />
                        </Link>
                        <Stack mt="6" spacing="3">
                          <Heading size="md">{ad.title}</Heading>
                          <Text color="blue.600" fontSize="2xl">
                            ₹{ad.price}
                            {ad.isPromoted && (
                              <Badge colorScheme="green" ml={2}>
                                Promoted
                              </Badge>
                            )}
                          </Text>
                        </Stack>
                      </CardBody>
                      <Divider />
                      <CardFooter>
                        <Flex justifyContent="space-between" width="100%">
                          <Link to={`/preview_ad/${ad._id}`}>
                            <Button variant="solid" colorScheme="blue">
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="solid"
                            colorScheme="red"
                            onClick={() => handleDelete(ad._id)}
                            isLoading={deletingCardId === ad._id}
                          >
                            Delete
                          </Button>
                          {!ad.isPromoted && (
                            <Button
                              colorScheme="green"
                              onClick={() => handlePromoteClick(ad)}
                            >
                              Promote
                            </Button>
                          )}
                        </Flex>
                      </CardFooter>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            )}
            {hasMoreProductsToLoad && (
              <Flex justifyContent="center" mt={5}>
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    setVisibleProducts((prev) => prev + 10);
                  }}
                >
                  Load More
                </Button>
              </Flex>
            )}
          </Container>

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
                {selectedProduct && (
                  <Box p={4} borderWidth="1px" borderRadius="lg">
                    <Text fontWeight="bold">{selectedProduct.title}</Text>
                    <Text>Price: ₹{selectedProduct.price}</Text>
                  </Box>
                )}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handlePromoteConfirm}>
                  Pay ₹30
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  );
}
