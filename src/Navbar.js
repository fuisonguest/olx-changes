import React, { useState, useEffect, useRef } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBBtn,
  MDBIcon,
  MDBNavbarNav,
} from "mdb-react-ui-kit";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Center,
  IconButton,
  Flex,
  Box,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import { ChatIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";

import Modallogin from "./Modallogin";
import Searchbar from "./SearchComponents/Searchbar";

export default function Navbar({ auth, setAuth }) {
  const [showNavNoTogglerSecond, setShowNavNoTogglerSecond] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // for register and login
  const [staticModal, setStaticModal] = useState(false);
  const toggleShow = () => setStaticModal(!staticModal);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('India');
  const [coordinates, setCoordinates] = useState(null);

  // Add new state variables for location search
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Modify the location dropdown to include popular locations
  const popularLocations = [
    { name: "Kolkata", state: "West Bengal" },
    { name: "Mumbai", state: "Maharashtra" },
    { name: "Chennai", state: "Tamil Nadu" },
    { name: "Pune", state: "Maharashtra" }
  ];

  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (!auth) return;
      
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("https://chages-new-olx.onrender.com/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishlistItems(response.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
    
    fetchWishlistCount();
  }, [auth]);

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authemail");
    localStorage.removeItem("authname");
    localStorage.removeItem("authpicture");
    localStorage.removeItem("authphone");

    window.location.href = "/";
    setAuth(false);
  }
  const name = localStorage.getItem("authname");
  const picture = localStorage.getItem("authpicture");

  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const addressParts = response.data.address;
      
      // Create a more detailed address object
      const address = {
        area: addressParts.suburb || addressParts.neighbourhood || addressParts.residential,
        city: addressParts.city || addressParts.town || addressParts.municipality,
        state: addressParts.state,
        postcode: addressParts.postcode
      };

      // Set display name as area name if available, otherwise city
      const displayName = address.area || address.city || address.state;
      setCurrentLocation(displayName);

      // Store complete location data
      localStorage.setItem('userLocation', JSON.stringify({ 
        name: displayName,
        address: address,
        coordinates: { lat, lng } 
      }));

      // Trigger product refresh
      window.dispatchEvent(new Event('locationChanged'));
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  // Function to fetch location suggestions
  const fetchLocationSuggestions = async (query) => {
    if (!query.trim()) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5&countrycodes=in`
      );

      const suggestions = response.data.map(location => ({
        area: location.address.suburb || location.address.neighbourhood || location.address.residential,
        city: location.address.city || location.address.town || location.address.municipality,
        state: location.address.state,
        displayName: [
          location.address.suburb || location.address.neighbourhood || location.address.residential,
          location.address.city || location.address.town || location.address.municipality,
          location.address.state
        ].filter(Boolean).join(', '),
        coordinates: {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon)
        }
      }));

      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    }
  };

  // Handle location search input
  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setIsSearching(true);
    fetchLocationSuggestions(value);
  };

  // Handle location suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    // Create a display name that includes city and state
    const displayName = [
      suggestion.area,
      suggestion.city,
      suggestion.state
    ].filter(Boolean).join(', ');

    setCurrentLocation(displayName);
    setSearchQuery(displayName);
    setIsSearching(false);
    setLocationSuggestions([]);

    localStorage.setItem('userLocation', JSON.stringify({
      name: displayName,
      address: {
        area: suggestion.area,
        city: suggestion.city,
        state: suggestion.state
      },
      coordinates: suggestion.coordinates
    }));

    window.dispatchEvent(new Event('locationChanged'));
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getProducts = async () => {
    try {
      const savedLocation = localStorage.getItem('userLocation');
      const locationData = savedLocation ? JSON.parse(savedLocation) : null;
      
      const response = await axios.get("https://chages-new-olx.onrender.com/getProducts", {
        params: {
          location: locationData?.name || 'India'
        }
      });
      
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Update the location button style to match OLX's blue button with pin
  const LocationButton = () => (
    <Button
      onClick={() => setIsSearching(true)}
      leftIcon={<MDBIcon fas icon="map-marker-alt" />}
      bg="white"
      color="black"
      _hover={{ 
        bg: "transparent", 
        textDecoration: "underline" 
      }}
      borderRadius="md"
      width="250px"
      display="flex"
      justifyContent="flex-start"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      border="1px solid"
      borderColor="gray.200"
    >
      {currentLocation}
    </Button>
  );

  return (
    <div className="">
      <MDBNavbar
        expand="lg"
        className="mdb-navbar"
        style={{ 
          background: "linear-gradient(90deg, #FFFBF5, #C5BAFF 100%)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
        }}
      >
        <MDBContainer fluid>
          <Link to="/" className="d-flex align-items-center">
            <img 
              src="/honey (4 x 3 in) (1.8 x 0.9 in).png" 
              alt="RETREND" 
              className="logo" 
              style={{width:"180px",height:"100px"}}
            />
          </Link>
          <div className="d-flex align-items-center" style={{ marginLeft: "20px" }} ref={searchRef}>
            <Box position="relative" width="250px">
              <LocationButton />
              
              {isSearching && (
                <Box
                  position="absolute"
                  top="100%"
                  left="0"
                  right="0"
                  bg="white"
                  boxShadow="lg"
                  borderRadius="md"
                  zIndex={1000}
                  border="1px solid"
                  borderColor="gray.200"
                  mt={2}
                >
                  <Input
                    placeholder="Search city, area or locality"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    border="none"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    borderRadius="0"
                    p={4}
                    autoFocus
                  />
                  
                  <Box maxH="400px" overflowY="auto">
                    <List>
                      <ListItem
                        p={3}
                        cursor="pointer"
                        _hover={{ bg: "transparent" }}
                        onClick={() => {
                          if (navigator.geolocation) {
                            setCurrentLocation('Detecting location...');
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const { latitude, longitude } = position.coords;
                                setCoordinates({ lat: latitude, lng: longitude });
                                fetchLocationName(latitude, longitude);
                              },
                              (error) => {
                                console.error('Error:', error);
                                setCurrentLocation('India');
                                localStorage.setItem('userLocation', JSON.stringify({ 
                                  name: 'India', 
                                  coordinates: null 
                                }));
                              }
                            );
                          }
                          setIsSearching(false);
                        }}
                      >
                        <Flex align="center" color="gray.700">
                          <MDBIcon fas icon="location-arrow" className="me-2" />
                          <Text fontWeight="500">Use current location</Text>
                        </Flex>
                      </ListItem>

                      {searchQuery ? (
                        // Show search results
                        locationSuggestions.map((suggestion, index) => (
                          <ListItem
                            key={index}
                            p={3}
                            cursor="pointer"
                            bg={currentLocation === suggestion.displayName ? "gray.50" : "white"}
                            _hover={{ bg: "transparent" }}
                            onClick={() => handleSuggestionSelect(suggestion)}
                          >
                            <Flex align="center">
                              <MDBIcon fas icon="map-marker-alt" className="me-2" />
                              <Box>
                                <Text fontWeight="500">{suggestion.area || suggestion.city}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {suggestion.city}, {suggestion.state}
                                </Text>
                              </Box>
                            </Flex>
                          </ListItem>
                        ))
                      ) : (
                        <>
                          <Text p={2} fontSize="sm" color="gray.500" fontWeight="bold" bg="gray.50">
                            POPULAR LOCATIONS
                          </Text>
                          {popularLocations.map((loc, index) => (
                            <ListItem
                              key={index}
                              p={3}
                              cursor="pointer"
                              bg={currentLocation === `${loc.name}, ${loc.state}` ? "gray.50" : "white"}
                              _hover={{ bg: "transparent" }}
                              onClick={() => handleSuggestionSelect({
                                area: null,
                                city: loc.name,
                                state: loc.state,
                                displayName: `${loc.name}, ${loc.state}`
                              })}
                            >
                              <Flex align="center">
                                <MDBIcon fas icon="map-marker-alt" className="me-2" />
                                <Box>
                                  <Text fontWeight="500">{loc.name}</Text>
                                  <Text fontSize="sm" color="gray.500">{loc.state}</Text>
                                </Box>
                              </Flex>
                            </ListItem>
                          ))}
                        </>
                      )}
                    </List>
                  </Box>
                </Box>
              )}
            </Box>
          </div>
          <MDBNavbarToggler
            type="button"
            data-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setShowNavNoTogglerSecond(!showNavNoTogglerSecond)}
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>
          <MDBCollapse navbar show={showNavNoTogglerSecond}>
            <MDBNavbarNav className="mr-auto mb-2 mb-lg-0" style={{ padding: "0 10px" }}>
              <div className="search-container d-flex flex-grow-1 mx-lg-5 align-items-center">
                <Searchbar />
              </div>
              {auth ? (
                <>
                  <MDBNavbarItem className="d-flex align-items-center" style={{ marginRight: "15px" }}>
                    <Link to="/sell">
                      <MDBBtn
                        className="mx-2"
                        color="info"
                        style={{ 
                          borderRadius: "20px", 
                          padding: "8px 20px",
                          boxShadow: "none",
                          fontWeight: "600",
                          backgroundColor: "#37bac1",
                          border: "none",
                          color: "white",
                          transition: "all 0.3s ease",
                          position: "relative",
                          zIndex: "1"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.textDecoration = "underline";
                          e.currentTarget.style.backgroundColor = "#37bac1";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.textDecoration = "none";
                          e.currentTarget.style.backgroundColor = "#37bac1";
                        }}
                      >
                        <MDBIcon fas icon="plus" className="me-2" />
                        SELL
                      </MDBBtn>
                    </Link>
                  </MDBNavbarItem>
                  <MDBNavbarItem className="d-flex align-items-center" style={{ marginRight: "15px" }}>
                    <Link to="/chat">
                      <IconButton
                        aria-label="Chat"
                        icon={<ChatIcon />}
                        colorScheme="teal"
                        variant="ghost"
                        className="mx-2"
                        _hover={{
                          bg: "transparent",
                          textDecoration: "underline"
                        }}
                      />
                    </Link>
                  </MDBNavbarItem>
                  <MDBNavbarItem className="d-flex align-items-center" style={{ marginRight: "15px" }}>
                    <Link to="/wishlist">
                      <Box position="relative">
                        <IconButton
                          aria-label="Wishlist"
                          icon={wishlistItems.length > 0 ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                          colorScheme="red"
                          variant="ghost"
                          className="mx-2"
                          _hover={{
                            bg: "transparent",
                            textDecoration: "underline"
                          }}
                        />
                        {wishlistItems.length > 0 && (
                          <Box
                            position="absolute"
                            top="-8px"
                            right="-8px"
                            borderRadius="full"
                            bg="red.500"
                            color="white"
                            fontSize="xs"
                            fontWeight="bold"
                            width="20px"
                            height="20px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            className="wishlist-notification-badge"
                          >
                            {wishlistItems.length}
                          </Box>
                        )}
                      </Box>
                    </Link>
                  </MDBNavbarItem>
                  <MDBNavbarItem className="d-flex align-items-center" style={{ marginRight: "15px" }}>
                    <Menu>
                      <MenuButton
                        as={Button}
                        rounded="full"
                        variant="link"
                        cursor="pointer"
                        minW={0}
                        className="avatar-container"
                        _hover={{
                          textDecoration: "underline"
                        }}
                      >
                        <Avatar size="sm" src={picture} />
                      </MenuButton>
                      <MenuList>
                        <Center>
                          <p>{name}</p>
                        </Center>
                        <MenuDivider />
                        <MenuItem as={Link} to="/profile">
                          <AccountBoxIcon className="me-2" /> Profile
                        </MenuItem>
                        <MenuItem as={Link} to="/myads">
                          <MDBIcon fas icon="clipboard-list" className="me-2" /> My Ads
                        </MenuItem>
                        <MenuItem as={Link} to="/wishlist">
                          <FavoriteTwoToneIcon className="me-2" /> Wishlist
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                          <LogoutIcon className="me-2" /> Logout
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </MDBNavbarItem>
                </>
              ) : (
                <MDBNavbarItem className="d-flex align-items-center">
                  <MDBNavbarLink>
                    <Button
                      onClick={toggleShow}
                      colorScheme="teal"
                      variant="outline"
                      style={{ 
                        borderRadius: "20px", 
                        padding: "8px 20px",
                        transition: "all 0.3s ease"
                      }}
                      _hover={{
                        textDecoration: "underline",
                        boxShadow: "none",
                        bg: "transparent"
                      }}
                    >
                      Login
                    </Button>
                  </MDBNavbarLink>
                </MDBNavbarItem>
              )}
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
      {staticModal && <Modallogin toggleShow={toggleShow} />}
    </div>
  );
}
