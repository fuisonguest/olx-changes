import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react';

const MaintenancePage = () => {
  return (
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
          Server is Down
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Why did the website go for free hosting?
          <br />
          Because it wanted to save up for a domain vacation! 😄
        </Text>
        <Text color={"gray.500"} mb={6}>
          We apologize for the inconvenience.
        </Text>
      </Box>
    </Flex>
  );
};

export default MaintenancePage;


