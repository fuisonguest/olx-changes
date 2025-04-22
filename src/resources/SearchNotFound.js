import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import CatNavbar from "../CatNavbar";


const SearchNotFound = () => {
  return (
    <div>
    <CatNavbar />
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minH="80vh"
    >
      <Box textAlign="center" py={10} px={6}>
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          Oops!
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          We can't seem to find that.
        </Text>
        <Text color={"gray.500"} mb={6}>
          Try searching for it again.
        </Text>

        <div className="icon-container">
          <SearchIcon className="search-icon" boxSize={8} />
        </div>

        <Button
          as="a"
          href="/"
          className='mt-4'
          colorScheme="teal"
          bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid"
        >
          Go to Home
        </Button>
      </Box>
    </Flex>
    </div>
  );
};

export default SearchNotFound;
