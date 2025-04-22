import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import NotListedAnything from "./resources/NotListedAnything";
import ProductCardProfile from "./ProductCards/ProductCardProfile";

function MyadCards() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleproducts, setVisibleProducts] = useState(6);
  const hasMoreProductsToLoad = visibleproducts < ads.length;

  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:5000/myads_view", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setAds(data);
      setIsLoading(false);
    };
    fetchAds();
  }, []);

  if (ads.length === 0 && isLoading === false) {
    return <NotListedAnything />
  }

  return (
    <div>
      {isLoading ? (
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
          <Box className="container" p={5}>
            <Heading size="lg" mb={4}>
              Your Products
            </Heading>
            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
              {ads
                .filter(ad => ad) // Filter out null ads
                .slice(0, visibleproducts)
                .map((ad) => (
                  <ProductCardProfile key={ad._id} ad={ad}/>
                ))}
            </SimpleGrid>
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
          </Box>
        </>
      )}
    </div>
  );
}

export default MyadCards;
