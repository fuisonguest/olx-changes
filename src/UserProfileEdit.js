import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Stack,
  StackDivider,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { CloseIcon, EditIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import { MDBInput } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CatNavbar from "./CatNavbar";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import GppBadIcon from "@mui/icons-material/GppBad";
import logo from "./resources/logo.jpeg";
import StartIcon from "@mui/icons-material/Start";

export default function UserProfileEdit() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isSending, setSending] = useState(false);
  const [verifyscr, Setverifyscr] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [pin, setPin] = useState("");
  const toast = useToast();
  const picture = localStorage.getItem("authpicture");

  const OverlayOne = () => (
    <ModalOverlay bg="blackAlpha.100" backdropFilter="blur(6px)" />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const authemail = localStorage.getItem("authemail");
  const authphone = localStorage.getItem("authphone");

  useEffect(() => {
    const authname = localStorage.getItem("authname");
    if (authname) {
      setName(authname);
    }
    if (authemail) {
      setEmail(authemail);
    }
    if (authphone) {
      setPhoneNumber(authphone);
    }
  }, []);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/verification-status?email=${authemail}`);
        const data = await response.json();
        // Update the isVerified state based on the response
        setIsVerified(data.isVerified);
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    };

    verifyEmail();
  }, [authemail]);
  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handlePhoneChange(event) {
    setPhoneNumber(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  const handleSendOtp = async (event) => {
    setSending(true);
    try {
      const response = await axios.post("http://localhost:5000/send-verification-email", { email });
      // Handle the response from the server
      console.log(response); // or perform any other action
      Setverifyscr(true);
      // Display success toast
      toast({
        title: "Verification Email Sent",
        description: "Enter 4-digit OTP.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      // Handle error
      console.error(error);

      // Display error toast
      toast({
        title: "Error",
        description: "An error occurred while sending the verification email.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSending(false);
    }
  };

  const handlePinSubmit = async (value) => {
    setPin(value);
    setSending(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5000/verify-email",
        { pin: value, email: email },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      localStorage.setItem("authemail", response.data.email);
      localStorage.setItem("authname", response.data.name);
      localStorage.setItem("authToken", response.data.token);
      onClose();
      Setverifyscr(false);

      console.log("Email verification response:", response.data);
      toast({
        title: "Success",
        description: "Email verified successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Do something with the response if needed
    } catch (error) {
      console.error("Error verifying email:", error);
      toast({
        title: "Error",
        description: "Email verification failed.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      // Handle the error
    } finally {
      setSending(false);
    }
  };

  const [imageUrl, setImageUrl] = useState(picture); // State to hold the uploaded image URL
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result); // Update the state with the uploaded image URL
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    // Validate phone number
    if (phoneNumber.length !== 10) {
      toast({
        title: 'Error',
        description: 'Phone number should be 10 digits.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    // Set loading state to true
    setIsLoading(true);
  
    try {
      let imageUrlToSend = imageUrl;
  
      if (imageUrl.length > 200) {
        const formData = new FormData();
        formData.append('file', imageUrl);
        formData.append('upload_preset', 'random');
  
        const { data } = await axios.post(
          'https://api.cloudinary.com/v1_1/dlpjayfhf/image/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        imageUrlToSend = data.secure_url;
      }
  
      // Retrieve the authorization token from localStorage
      const authToken = localStorage.getItem('authToken');
  
      const response = await axios.post(
        'http://localhost:5000/profile_edit',
        { name, imageUrl: imageUrlToSend, phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      localStorage.setItem('authname', response.data.name);
      localStorage.setItem('authphone', response.data.phone);
      localStorage.setItem('authpicture', response.data.picture);
  
      // Handle the successful response and display a success toast
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error during image upload or profile update:', error);
  
      // Handle the error response and display an error toast
      toast({
        title: 'Error',
        description: 'An error occurred while updating the profile.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // Set loading state to false after the request is completed
      setIsLoading(false);
    }
  };
  
  
  return (
    <div>
      <CatNavbar />
      <div className="container">
        <Card className="mt-4 mb-4">
          <form onSubmit={handleFormSubmit}>
            <CardHeader>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Heading size="md" className="mt-3">
                  Edit Profile
                </Heading>
                <Link to="/profile">
                  <Button className="mt-2">View Profile</Button>
                </Link>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <Stack divider={<StackDivider />} spacing={4}>
                <Box>
                  <Heading
                    size="xs"
                    textTransform="uppercase"
                    mr={2}
                    textAlign="left"
                  >
                    Basic information
                  </Heading>
                  <div className="custom-file-input mt-4">
                    <MDBInput
                      label="Name"
                      id="name"
                      value={name}
                      onChange={handleNameChange}
                      required
                    />
                  </div>
                </Box>
                <Box>
                  <Heading
                    size="xs"
                    textTransform="uppercase"
                    mr={2}
                    textAlign="left"
                  >
                    Contact information
                  </Heading>
                  <div className="custom-file-input mt-4">
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <EmailIcon color="green.300" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={authemail}
                        onClick={() => {
                          setOverlay(<OverlayOne />);
                          onOpen();
                        }}
                        required
                      />
                      {isVerified ? (
                        <Badge
                          className="mx-2 mb-2 my-2"
                          mt={4}
                          variant="solid"
                          colorScheme="green"
                        >
                          <VerifiedUserIcon />
                          {"Verified"}
                        </Badge>
                      ) : (
                        <Badge
                          className="mx-2 mb-2 my-2"
                          mt={4}
                          variant="solid"
                          colorScheme="red"
                        >
                          <GppBadIcon />
                          {"Not Verified"}
                        </Badge>
                      )}
                    </InputGroup>
                    <InputGroup className="mt-3">
                      <InputLeftElement
                        pointerEvents="none"
                        children={<PhoneIcon color="green.300" />}
                      />
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        required
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                      />
                    </InputGroup>
                  </div>
                </Box>
                <Box>
                  <Heading
                    size="xs"
                    textTransform="uppercase"
                    mr={2}
                    textAlign="left"
                  >
                    Edit Picture
                  </Heading>
                  <div className="mt-4 mx-4">
                    <Box
                      position="relative"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {imageUrl && (
                        <Tooltip label="Clear Image" placement="top">
                          <IconButton
                            icon={<CloseIcon />}
                            size="sm"
                            borderRadius="full"
                            colorScheme="red"
                            position="absolute"
                            top="-8px"
                            left="-8px"
                            zIndex="1"
                            onClick={() =>
                              setImageUrl(
                                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                              )
                            }
                            _hover={{ color: "purple.600" }}
                          />
                        </Tooltip>
                      )}
                      <Image
                        borderRadius="full"
                        boxSize="100px"
                        src={imageUrl}
                        alt="Profile Picture"
                      />
                      <div className="custom-file-input">
                        <Input
                          className="mt-3"
                          type="file"
                          border="none"
                          onChange={handleImageChange}
                        />
                      </div>
                    </Box>
                  </div>
                </Box>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Link to="/profile">
                <Button variant="ghost" colorScheme="blue">
                  Discard
                </Button>
              </Link>
              <Button
                type="submit"
                variant="solid"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Saving..."
              >
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Verify Email Modal Here */}
      <Modal
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size="md"
      >
        {overlay}
        {verifyscr === false && (
          <ModalContent>
            <Flex
              alignItems="center"
              justifyContent="center"
              className="mt-4 mb-4"
            >
              <Image borderRadius="full" boxSize="70px" src={logo} alt="Logo" />
              <Box mx="8" color="blue.500">
                <StartIcon boxSize={10} />
              </Box>
              <Image
                borderRadius="full"
                boxSize="100px"
                src={picture}
                alt="Account Picture"
              />
            </Flex>
            <ModalHeader className="text-center">
              <Heading>
                <h5>Enter your email to verify your account</h5>
              </Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody className="mb-4 text-center">
              <Text color="rebeccapurple">
                We will send a confirmation code to your email
              </Text>
              <InputGroup className="mb-4 mt-2">
                <InputLeftElement
                  pointerEvents="none"
                  children={<EmailIcon color="gray.300" />}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </InputGroup>
              <small style={{ color: "gray" }}>
                The email you provide here is only used to verify your account.
                It will not be made public.
              </small>
            </ModalBody>
            <ModalFooter className="mt-4">
              <Flex justify="flex-end" align="center" w="100%">
                <Button
                  variant="solid"
                  borderRadius="10"
                  size="lg"
                  boxShadow="md"
                  borderWidth="1px"
                  borderColor="gray.300"
                  flex="1"
                  marginLeft="auto"
                  marginRight="auto"
                  onClick={handleSendOtp}
                  isLoading={isSending}
                  loadingText="Sending OTP..."
                >
                  Next
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        )}
        {verifyscr === true && (
          <ModalContent>
            <Flex
              alignItems="center"
              justifyContent="center"
              className="mt-4 mb-4"
            >
              <Image borderRadius="full" boxSize="70px" src={logo} alt="Logo" />
              <Box mx="8" color="blue.500">
                <StartIcon boxSize={10} />
              </Box>
              <Image
                borderRadius="full"
                boxSize="100px"
                src={picture}
                alt="Account Picture"
              />
            </Flex>
            <ModalHeader className="text-center">
              <Heading>
                <h5>Enter verification code</h5>
              </Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody className="mb-4 text-center">
              <Flex align="center">
                <Text color="rebeccapurple">
                  We sent a 4-digit code to <b>{email}</b>
                </Text>
                <Tooltip label="Edit email" placement="top">
                  <IconButton
                    icon={<EditIcon boxSize={10} color="blue" />}
                    onClick={() => Setverifyscr(false)}
                    _hover={{ color: "green.500" }}
                  />
                </Tooltip>
              </Flex>

              <InputGroup
                className="mb-4 mt-4"
                justifyContent="center"
                alignItems="center"
                display="flex"
                flexDir="column"
              >
                <HStack className="mt-4 mb-4" spacing={4}>
                  <PinInput size="lg" otp onComplete={handlePinSubmit}>
                    <PinInputField _focus={{ borderColor: "primary.500" }} />
                    <PinInputField _focus={{ borderColor: "primary.500" }} />
                    <PinInputField _focus={{ borderColor: "primary.500" }} />
                    <PinInputField _focus={{ borderColor: "primary.500" }} />
                  </PinInput>
                </HStack>
              </InputGroup>
              {isSending && (
                <div className="container">
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="black.200"
                    color="red.500"
                    size="xl"
                  />
                </div>
              )}
              <a href="#!" alt="Request a new code" onClick={handleSendOtp}>
                <small>Request a new code</small>
              </a>
            </ModalBody>
          </ModalContent>
        )}
      </Modal>
    </div>
  );
}
