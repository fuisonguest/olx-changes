import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { categories } from "./resources/Catagories";
import NotFound from "./resources/NotFound";
import axios from "axios";
import { Box, Button, Container, Grid, GridItem } from "@chakra-ui/react";
import ProductCard from "./ProductCards/ProductCard";
import SearchNotFound from "./resources/SearchNotFound";
import CatNavbar from "./CatNavbar";
import Loading from "./resources/Loading";


export default function CatagoryView() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleproducts, setVisibleProducts] = useState(6);
  const hasMoreProductsToLoad = visibleproducts < products.length;

  const isValidCategory = categories.some(
    (cat) => cat.title.toLowerCase() === category.toLowerCase()
  );
  const isValidItem = categories.some((cat) => cat.items.includes(category));

  useEffect(() => {
    if (!isValidCategory && !isValidItem) {
      return;
    }

    const getProductsbyCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getProductsbyCategory/${category}`);
        
        // Sort products to prioritize promoted products
        const sortedProducts = [...response.data].sort((a, b) => {
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

    getProductsbyCategory();
  }, [category, isValidCategory, isValidItem]);

  if (!isValidCategory && !isValidItem) {
    return <NotFound />;
  }

  if (products.length === 0) {
    return <SearchNotFound />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Box>
      <CatNavbar />
      <Container maxW="container.xl">
        <Grid templateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(250px, 1fr))" }} gap={4}>
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
