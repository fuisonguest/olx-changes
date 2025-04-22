import React, { useEffect } from "react";
import { Navbar } from "react-bootstrap";
import { categories } from "./resources/Catagories";
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Grid,
  GridItem,
  Text,
  Button,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useMediaQuery } from "@chakra-ui/react";
import { Link } from "react-router-dom";
// Import Material-UI icons
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ChairIcon from '@mui/icons-material/Chair';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import PetsIcon from '@mui/icons-material/Pets';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import WorkIcon from '@mui/icons-material/Work';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
// Add new icon imports
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import BusinessIcon from '@mui/icons-material/Business';
import TvIcon from '@mui/icons-material/Tv';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ConstructionIcon from '@mui/icons-material/Construction';

// Map categories to icons
const categoryIcons = {
  'Home': HomeIcon,
  'Retrend (Cars)': DirectionsCarIcon,
  'Properties': ApartmentIcon,
  'Mobiles': SmartphoneIcon,
  'Jobs': WorkIcon,
  'Bikes': TwoWheelerIcon,
  'Electronics & Appliances': TvIcon,
  'Commercial Vehicles & Spares': LocalShippingIcon,
  'Furniture': ChairIcon,
  'Fashion': CheckroomIcon,
  'Books, Sports & Hobbies': SportsSoccerIcon,
  'Pets': PetsIcon,
  'Services': BusinessIcon,
  'Kids': ChildCareIcon,
  'Agriculture': AgricultureIcon,
  'Gaming': SportsEsportsIcon,
  'Music': MusicNoteIcon,
  'Tools & Machinery': ConstructionIcon,
};

export default function CatNavbar() {
  const [isMobile] = useMediaQuery("(max-width: 480px)");
  
  // Use effect to remove any badges that might get added dynamically
  useEffect(() => {
    // Function to remove badges from category navbar
    const removeBadges = () => {
      const catNavLinks = document.querySelectorAll('.cat-nav-link, [data-category-nav="true"]');
      
      catNavLinks.forEach(link => {
        // Find any badges that might have been added and remove them
        const badges = link.querySelectorAll('.best-one-badge, .mobile-badge');
        badges.forEach(badge => {
          badge.remove();
        });
      });
    };
    
    // Run on mount
    removeBadges();
    
    // Set up a mutation observer to catch dynamically added badges
    const observer = new MutationObserver(removeBadges);
    
    // Target the whole category navbar
    const catNavbar = document.querySelector('.cat-navbar');
    if (catNavbar) {
      observer.observe(catNavbar, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }
    
    // Clean up
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <Navbar bg="light" expand="md" className="mt-1 cat-navbar" variant="light" style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <Flex justify="space-between" align="center" w="100%" px={3}>
        <Box mr={2}>
          {!isMobile && (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Menu"
                icon={<HamburgerIcon />}
                colorScheme="blue"
                variant="outline"
              />
              <MenuList maxW="80vw" maxH="80vh" overflowY="auto" boxShadow="lg" p={2}>
                <Grid
                  templateColumns={[
                    "repeat(2, 1fr)",
                    "repeat(3, 1fr)",
                    "repeat(4, 1fr)",
                    "repeat(5, 1fr)",
                  ]}
                  gap={4}
                >
                  {categories.map((category, index) => (
                    <GridItem key={index}>
                      <Box 
                        p={3} 
                        fontWeight="bold" 
                        borderBottom="2px solid" 
                        borderColor="blue.200"
                        color="blue.700"
                        display="flex"
                        alignItems="center"
                      >
                        {categoryIcons[category.title] && React.createElement(categoryIcons[category.title], { 
                          style: { marginRight: '8px' },
                          fontSize: "small",
                          color: "primary"
                        })}
                        <Text fontSize="sm">{category.title}</Text>
                      </Box>
                      <VStack align="stretch" mt={2} spacing={1}>
                        {category.items.map((subCategory, subIndex) => {
                          return (
                            <Link 
                              key={`${index}-${subIndex}`} 
                              to={`/${subCategory}`} // Using the original URL format
                              style={{ textDecoration: 'none' }}
                            >
                              <MenuItem 
                                _hover={{ bg: 'blue.50', color: 'blue.600' }}
                                fontSize="xs"
                                py={1}
                              >
                                {subCategory}
                              </MenuItem>
                            </Link>
                          );
                        })}
                      </VStack>
                      {index !== categories.length - 1 && <Divider my={2} />}
                    </GridItem>
                  ))}
                </Grid>
              </MenuList>
            </Menu>
          )}
        </Box>
        
        <Flex 
          justify="center" 
          align="center" 
          flexWrap="wrap" 
          className="category-buttons-container"
          overflowX="auto"
          css={{
            '&::-webkit-scrollbar': {
              height: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
            }
          }}
          pb={1}
        >
          {categories.map((category, index) => {
            // Get the icon component
            const IconComponent = categoryIcons[category.title];
            
            return (
              <Box key={index} mx={1} my={1} className="category-link-container cat-nav-item">
                {/* Use Link as wrapper like in your original code */}
                <Link 
                  to={`/${category.title}`} // Using the original URL format
                  style={{ textDecoration: 'none' }}
                  className="category-link cat-nav-link"
                  data-category-nav="true" // Add this attribute to identify category nav links
                >
                  <Button 
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontWeight="medium"
                    color="gray.700"
                    className="cat-button"
                    transition="all 0.2s"
                    boxShadow="sm"
                    _hover={{ 
                      bg: 'blue.100', 
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Render icon and text separately to match your original structure */}
                    {IconComponent && <IconComponent style={{ fontSize: '1.2rem', marginRight: '8px' }} />}
                    <Text display="inline">{category.title}</Text>
                  </Button>
                </Link>
              </Box>
            );
          })}
        </Flex>
      </Flex>
    </Navbar>
  );
}