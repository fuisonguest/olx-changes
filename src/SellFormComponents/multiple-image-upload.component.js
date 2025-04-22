import React, { useState, useEffect } from "react";
import { MDBCardImage, MDBFile } from "mdb-react-ui-kit";
import { useToast, Spinner, Text, Box, Alert, AlertIcon, Button } from "@chakra-ui/react";
import axios from "axios";

export default function MultipleImageUploadComponent({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [moderationResult, setModerationResult] = useState(null);
  const [moderationError, setModerationError] = useState(null);
  const [bypassModeration, setBypassModeration] = useState(false);
  const toast = useToast();

  const checkImageContent = async (base64Image) => {
    setIsChecking(true);
    setModerationResult(null);
    setModerationError(null);
    
    try {
      console.log("Preparing image for moderation...");
      
      // Extract the base64 data without the prefix
      let pureBase64 = "";
      if (base64Image.includes('base64,')) {
        pureBase64 = base64Image.split('base64,')[1];
      } else {
        // Try to use the image data directly
        pureBase64 = base64Image;
      }
      
      if (!pureBase64) {
        console.error("Failed to extract base64 data from image");
        setModerationError("Could not process the image format");
        toast({
          title: "Image Processing Error",
          description: "Could not process the image format. Please try again with a different image.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
      
      console.log("Sending image for moderation...");
      
      try {
        const response = await axios.post('http://localhost:5000/moderate-image', {
          image: pureBase64
        }, {
          timeout: 60000 // Increased timeout to 60 seconds as Vision API may take longer
        });
        
        console.log("Moderation response:", response.data);
        
        // Check if the response is valid and contains the expected structure
        if (!response.data || typeof response.data.isAppropriate === 'undefined') {
          console.error("Invalid moderation response structure:", response.data);
          setModerationError("Unexpected moderation response");
          
          // Still accept the image if we can't properly validate it
          setModerationResult({ isAppropriate: true });
          return true;
        }
        
        const correctedResult = {
          ...response.data
        };
        
        setModerationResult(correctedResult);
        
        // Check if the image is appropriate (using corrected logic)
        if (!correctedResult.isAppropriate) {
          // Show a more detailed rejection message
          let rejectionReason = correctedResult.moderationDetails?.reason || "This image contains inappropriate content";
          
          // If we have content type information, add it to the rejection message
          if (correctedResult.moderationDetails?.contentType && 
              correctedResult.moderationDetails.contentType !== "unknown") {
            rejectionReason += ` (Content type: ${correctedResult.moderationDetails.contentType})`;
          }
          
          // If we detected adult content, show a specific message
          if (correctedResult.moderationDetails?.hasAdultContent) {
            rejectionReason = "Adult or explicit content detected. This content is not allowed.";
          }
          
          toast({
            title: "Image Rejected",
            description: rejectionReason,
            status: "error",
            duration: 8000,
            isClosable: true,
          });
          return false;
        }
        
        // Image is appropriate
        toast({
          title: "Image Approved",
          description: "Your image has been approved and will be included in your listing.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        return true;
      } catch (error) {
        console.error("Error during image moderation:", error);
        
        // If the server is down or there's a network issue, we'll still accept the image
        setModerationError("Server error during moderation");
        
        toast({
          title: "Moderation Service Unavailable",
          description: "We couldn't check your image content, but we've accepted it. Please ensure it follows community guidelines.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        
        // Return true to accept the image despite moderation failure
        return true;
      }
    } catch (error) {
      console.error("Error in image processing:", error);
      setModerationError("Error processing image");
      
      toast({
        title: "Error Processing Image",
        description: "There was an error processing your image. Please try again with a different image.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Reset states
      setModerationResult(null);
      setModerationError(null);
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // First show loading state
      setIsChecking(true);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target.result;
        
        // Show the image preview immediately, but mark as "checking"
        setImageSrc(result);
        
        try {
          // If bypass is enabled, skip moderation
          if (bypassModeration) {
            setSelectedFile(file);
            onFileSelect(file);
            setModerationResult({ isAppropriate: true });
            setIsChecking(false);
            return;
          }
          
          // Check image content before finalizing
          const isAppropriate = await checkImageContent(result);
          
          if (isAppropriate) {
            setSelectedFile(file);
            // Pass the actual file object to the parent component
            onFileSelect(file);
          } else {
            // If not appropriate, clear the selection but keep the preview
            setSelectedFile(null);
          }
        } catch (error) {
          console.error("Error in image processing:", error);
          setModerationError("Server could not process the image");
          
          // Still pass the file to parent component on error
          setSelectedFile(file);
          onFileSelect(file);
          
          toast({
            title: "Moderation Warning",
            description: "Image moderation service failed, but your image was accepted.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setIsChecking(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBypassModeration = () => {
    setBypassModeration(true);
    if (selectedFile) {
      onFileSelect(selectedFile);
      setModerationResult({ isAppropriate: true });
      setModerationError(null);
      toast({
        title: "Moderation Bypassed",
        description: "Image has been accepted without moderation. Please ensure it follows community guidelines.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="custom-file-input mt-3 mb-3">
      <MDBFile onChange={handleChange} />
      <div className="container mt-2 mx-4">
        {isChecking && (
          <Box display="flex" alignItems="center" mb={2}>
            <Spinner size="sm" color="blue.500" mr={2} />
            <Text fontSize="sm">Checking image content with AI...</Text>
          </Box>
        )}
        
        {moderationResult && moderationResult.isAppropriate && (
          <Alert status="success" size="sm" mb={2} borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">Image approved</Text>
          </Alert>
        )}
        
        {moderationResult && !moderationResult.isAppropriate && (
          <Alert status="error" size="sm" mb={2} borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontSize="sm" fontWeight="bold">Image rejected</Text>
              <Text fontSize="sm">{moderationResult.moderationDetails?.reason || "Inappropriate content"}</Text>
              {moderationResult.moderationDetails?.hasAdultContent && (
                <Text fontSize="sm" color="red.600" fontWeight="bold">Adult content detected</Text>
              )}
            </Box>
          </Alert>
        )}
        
        {moderationError && (
          <Box>
            <Alert status="warning" size="sm" mb={2} borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontSize="sm" fontWeight="bold">Moderation Error</Text>
                <Text fontSize="sm">There was an error checking the image content. You may try again or use a different image.</Text>
                <Button 
                  size="xs" 
                  colorScheme="blue" 
                  mt={1} 
                  onClick={handleBypassModeration}
                >
                  Use Image Anyway
                </Button>
              </Box>
            </Alert>
          </Box>
        )}
        
        {imageSrc && (
          <div className="mt-2">
            <MDBCardImage
              src={imageSrc}
              alt="Selected"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
              className="img-thumbnail"
            />
          </div>
        )}
      </div>
    </div>
  );
}
