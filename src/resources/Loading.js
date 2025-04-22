import { Flex, Spinner, Text } from '@chakra-ui/react'
import React from 'react'

export default function Loading() {
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
        <Spinner
          size="xl"
          color="green.500"
          thickness="4px"
          speed="0.65s"
          mb="4"
        />
        <Text fontSize="xl" fontWeight="bold" color="gray.600">
          Please Wait....
        </Text>
      </Flex>
  )
}
