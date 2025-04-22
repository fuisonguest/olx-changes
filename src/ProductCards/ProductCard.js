import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Image,
  Stack,
  Text,
  Badge,
  Box,
} from "@chakra-ui/react";
import React from "react";
import CurrencyRupeeTwoToneIcon from "@mui/icons-material/CurrencyRupeeTwoTone";

export default function ProductCard({ product }) {
  const address = product.address?.[0] || {};
  const createdAt = new Date(product.createdAt);
  const now = new Date();
  // Calculate the time difference in milliseconds
  const timeDiff = now.getTime() - createdAt.getTime();
  // Convert milliseconds to days
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return (
    <div>
      <Card maxW="sm" className="mt-2 mb-2" position="relative">
        {product.isPromoted && (
          <Badge 
            colorScheme="green"
            className="best-one-badge"
          >
            Best One
          </Badge>
        )}
        {product.isGoodForBestOne && (
          <Badge 
            colorScheme="blue"
            className="good-for-best-one-badge"
          >
            Good for the best one
          </Badge>
        )}
        <CardBody>
        <div style={{display: "flex", justifyContent: "center"}}>
          <Image
            src={product.productpic1}
            alt={product.subcategory}
            borderRadius="lg"
            maxH="200px"
            maxW="400px"
          />
          </div>
          <Stack mt="6" spacing="3">
            <Text>{product.title}</Text>
            <Text color="blue.600" fontSize="2xl">
              <CurrencyRupeeTwoToneIcon />
              {product.price}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <Stack spacing="1">
            <Flex justify="space-between">
              <Text color="blue.600" fontSize="xs">
                {`${address.area}, ${address.city}, ${address.state}, ${address.postcode}`}
              </Text>
              <Text color="blue.600" mx="4" fontSize="xs">
                {`${daysAgo} days ago`}
              </Text>
            </Flex>
          </Stack>
        </CardFooter>
      </Card>
    </div>
  );
}
