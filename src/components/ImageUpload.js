import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { CheckIcon } from '@chakra-ui/icons';

const ImageUpload = ({ onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('image', file);
        
        // Store the file in state
        setSelectedImage(file);
        
        // Call the parent component's handler with the file
        onImageUpload(file);
        
        // Mark as approved
        setIsApproved(true);
      } catch (error) {
        console.error('Error handling image:', error);
        toast({
          title: 'Error',
          description: 'Failed to process image. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <div className="image-upload-container">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="image-input"
        id="image-upload"
      />
      {selectedImage && (
        <div className="image-preview">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="preview-image"
          />
          {isApproved && (
            <div className="approval-badge">
              <CheckIcon color="green.500" /> Image Approved
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 