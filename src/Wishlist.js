import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Heading,
  Grid,
  GridItem,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import ProductCardProfile from "./ProductCards/ProductCardProfile";
import NotListedAnything from "./resources/NotListedAnything";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast({
            title: "Authentication Required",
            description: "Please login to view your wishlist",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          navigate("/");
          return;
        }

        const response = await axios.get("https://chages-new-olx.onrender.com/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data) {
          setWishlistItems(response.data);
        } else {
          setWishlistItems([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        if (err.response?.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please login again to view your wishlist",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          localStorage.removeItem("authToken");
          navigate("/");
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch wishlist items. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <ReactLoading type="spin" color="#0000FF" height={100} width={100} />
      </div>
    );
  }

  return (
    <Container maxW="container.xl" mt={5}>
      <Heading as="h2" size="xl" textAlign="center" mb={5}>
        My Wishlist
      </Heading>
      
      {wishlistItems.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <NotListedAnything />
          <Text mt={4}>You haven't added any items to your wishlist yet.</Text>
        </div>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {wishlistItems
            .filter(item => item.productId)
            .map((item) => (
              <GridItem key={item._id}>
                <ProductCardProfile ad={item.productId} />
              </GridItem>
            ))}
        </Grid>
      )}
    </Container>
  );
} 
