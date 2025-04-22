import React, { useState } from 'react';
import { Text, Button } from '@chakra-ui/react';
import ImageUpload from './ImageUpload';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PostAd = () => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    // ... other form fields
  });
  const navigate = useNavigate();

  const handleImageUpload = (file) => {
    setImages(prevImages => [...prevImages, file]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const postFormData = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        postFormData.append(key, formData[key]);
      });
      
      // Append images
      images.forEach((image, index) => {
        postFormData.append(`productpic${index + 1}`, image);
      });

      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5000/api/postad",
        postFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Your ad has been posted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error posting ad:", error);
      toast({
        title: "Error",
        description: "Failed to post your ad. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Other form fields */}
      
      <div className="image-upload-section">
        <Text mb={2}>Upload Images (Max 3)</Text>
        {[1, 2, 3].map((num) => (
          <ImageUpload
            key={num}
            onImageUpload={handleImageUpload}
            maxImages={3}
          />
        ))}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        colorScheme="blue"
        isLoading={isSubmitting}
        loadingText="Posting..."
      >
        Post Ad
      </Button>
    </form>
  );
};

export default PostAd; 