import React, { useEffect, useState } from "react";
import {Box, Button, Container, Grid, GridItem, Text} from "@chakra-ui/react";
import CatNavbar from "./CatNavbar";
import ProductCard from "./ProductCards/ProductCard";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "./resources/Loading";
import { API_BASE_URL } from "./utils/config"; // Import the API base URL

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleproducts, setVisibleProducts] = useState(6);
  const [currentLocation, setCurrentLocation] = useState(null);
  const hasMoreProductsToLoad = visibleproducts < products.length;

  const getProducts = async () => {
    try {
      const savedLocation = localStorage.getItem('userLocation');
      const locationData = savedLocation ? JSON.parse(savedLocation) : null;
      setCurrentLocation(locationData?.name);

      const response = await axios.get(`${API_BASE_URL}/getProducts`);
      
      // Filter and sort products based on location hierarchy
      let filteredProducts = response.data;
      if (locationData?.address) {
        // Sort products by location relevance
        filteredProducts.sort((a, b) => {
          const aAddress = a.address?.[0] || {};
          const bAddress = b.address?.[0] || {};
          const userAddress = locationData.address;

          // Calculate relevance score (higher = more relevant)
          const getRelevanceScore = (address) => {
            let score = 0;
            // Exact area match (highest priority)
            if (address.area?.toLowerCase() === userAddress.area?.toLowerCase()) score += 4;
            // City match (high priority)
            if (address.city?.toLowerCase() === userAddress.city?.toLowerCase()) score += 2;
            // State match (lower priority)
            if (address.state?.toLowerCase() === userAddress.state?.toLowerCase()) score += 1;
            return score;
          };

          const scoreA = getRelevanceScore(aAddress);
          const scoreB = getRelevanceScore(bAddress);

          // Sort by relevance score (higher first)
          if (scoreB !== scoreA) return scoreB - scoreA;
          
          // If same relevance, sort by date
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Filter out products from other states
        filteredProducts = filteredProducts.filter(product => {
          const productAddress = product.address?.[0];
          return productAddress?.state?.toLowerCase() === locationData.address.state?.toLowerCase();
        });
      }

      // Apply promotion sorting within the location-based results
      const sortedProducts = filteredProducts.sort((a, b) => {
        if (a.isPromoted && !b.isPromoted) return -1;
        if (!a.isPromoted && b.isPromoted) return 1;
        return 0;
      });
      
      setProducts(sortedProducts);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Listen for location changes
  useEffect(() => {
    const handleLocationChange = () => {
      getProducts();
    };

    window.addEventListener('locationChanged', handleLocationChange);
    return () => window.removeEventListener('locationChanged', handleLocationChange);
  }, []);

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Count promoted products for display
  const promotedCount = products.filter(product => product.isPromoted).length;

  return (
    <Box>
      <CatNavbar />
      <Container maxW="container.xl">
        {promotedCount > 0 && (
          <Text 
            fontSize="lg" 
            fontWeight="bold" 
            mb={4} 
            mt={4} 
            color="green.600"
          >
            Featured Products ({promotedCount})
          </Text>
        )}
        <Grid templateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(300px, 1fr))" }} gap={6}>
          {products.slice(0, visibleproducts).map((product) => (
            <GridItem key={product._id}>
              <Link to={`/preview_ad/${product._id}`}>
                <ProductCard product={product} />
              </Link>
            </GridItem>
          ))}
        </Grid>
        {hasMoreProductsToLoad && (
        <Button
          className="mb-2"
          bgGradient="linear(to-r, teal.400, cyan.600)"
          color="white"
          _hover={{
            bgGradient: "linear(to-r, teal.600, cyan.800)",
          }}
          _active={{
            bgGradient: "linear(to-r, teal.800, cyan.900)",
          }}
          onClick={() => {
            setVisibleProducts((prev) => prev + 10);
          }}
        >
          Load More
        </Button>
        )}
      </Container>
    </Box>
  );
}

export default Home;
