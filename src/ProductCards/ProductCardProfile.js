import { Box, Card, Heading, Image, Stack, Text } from '@chakra-ui/react'
import React from 'react'

export default function ProductCardProfile({ad}) {
  // Return early if ad is null or undefined
  if (!ad) {
    return null; // Or a placeholder card that doesn't depend on ad properties
  }
  
  return (
    <Card key={ad._id} variant={"filled"} maxW="xl">
                  <a href={`/preview_ad/${ad._id}`}>
                    <Stack className="mt-2" direction="row" spacing={4}>
                      <Image
                        src={ad.productpic1}
                        alt={ad.title}
                        w="100px"
                        h="100px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <Stack spacing={2} flex={1}>
                        <Heading size="md">{ad.title}</Heading>
                        <Text fontSize="sm">{ad.description}</Text>
                        <Box textAlign="center">
                          <Text color="blue.600" fontSize="2xl">
                            &#x20b9;{ad.price}
                          </Text>
                        </Box>
                      </Stack>
                    </Stack>
                  </a>
                </Card>
  )
}
