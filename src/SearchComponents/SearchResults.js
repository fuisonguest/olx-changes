import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CatNavbar from '../CatNavbar';
import { Box, Button, Container, Grid, GridItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCards/ProductCard';
import SearchNotFound from '../resources/SearchNotFound';
import NotFound from '../resources/NotFound';
import Loading from '../resources/Loading';

export default function SearchResults() {
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get('query');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleproducts, setVisibleProducts] = useState(6);
  const hasMoreProductsToLoad = visibleproducts < results.length;

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/search?q=${query}`);
        
        // Sort products to prioritize promoted products
        const sortedResults = [...response.data].sort((a, b) => {
          if (a.isPromoted && !b.isPromoted) return -1;
          if (!a.isPromoted && b.isPromoted) return 1;
          return 0;
        });
        
        setResults(sortedResults);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  if (loading) {
    return <Loading />;
  }

if (results.length === 0) {
    return <SearchNotFound />;
}

  if (error) {
    return <NotFound />;
  }

  return (
    <Box>
      <CatNavbar />
      <Container maxW="container.xl">
      <Grid templateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(300px, 1fr))" }} gap={6}>
        {results.slice(0, visibleproducts).map((product) => (
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
