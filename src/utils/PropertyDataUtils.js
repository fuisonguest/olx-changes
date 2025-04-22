/**
 * Utility functions for property data handling
 */

/**
 * Attempts to parse property data from various formats
 * @param {Object|String} propertyData - The property data to parse
 * @returns {Object} Normalized property data object
 */
export const parsePropertyData = (propertyData) => {
  if (!propertyData) return {};
  
  // If already an object, use it directly
  if (typeof propertyData === 'object' && !Array.isArray(propertyData)) {
    return propertyData;
  }
  
  // If it's a string, try to parse it as JSON
  if (typeof propertyData === 'string') {
    try {
      return JSON.parse(propertyData);
    } catch (e) {
      console.error('Failed to parse property data string:', e);
      return {};
    }
  }
  
  return {};
};

/**
 * Validates and normalizes property data
 * @param {Object} propertyData - The property data to validate
 * @returns {Object} Normalized property data with correct types
 */
export const normalizePropertyData = (propertyData) => {
  const data = parsePropertyData(propertyData);
  
  // Define the expected property types
  const stringFields = [
    'propertyType', 'bhk', 'bathrooms', 'furnishing', 
    'projectStatus', 'listedBy', 'superBuiltupArea', 
    'carpetArea', 'maintenance', 'totalFloors', 
    'floorNo', 'carParking', 'facing', 'projectName',
    'age', 'balconies', 'description'
  ];
  
  // Create a normalized object
  const normalized = {};
  
  // Process string fields
  stringFields.forEach(field => {
    if (data[field] !== undefined) {
      normalized[field] = String(data[field]);
    }
  });
  
  // Process amenities if they exist
  if (data.amenities && typeof data.amenities === 'object') {
    normalized.amenities = {};
    
    // Ensure all amenity values are boolean
    Object.entries(data.amenities).forEach(([key, value]) => {
      normalized.amenities[key] = Boolean(value);
    });
  }
  
  return normalized;
};

/**
 * Fetches property data from a product
 * @param {Object} product - The product object from the API
 * @returns {Object} Parsed and normalized property data
 */
export const extractPropertyData = (product) => {
  if (!product) return {};
  
  // Try to get property data from various possible locations
  let propertyData = product.propertyData;
  
  // If we have nested property data, extract it
  if (propertyData && typeof propertyData === 'object' && 
      Object.keys(propertyData).length === 1 && propertyData.propertyData) {
    propertyData = propertyData.propertyData;
  }
  
  // Parse and normalize the data
  return normalizePropertyData(propertyData);
};

/**
 * Get formatted amenities list
 * @param {Object} amenities - The amenities object
 * @returns {String[]} Array of formatted amenity names
 */
export const getFormattedAmenities = (amenities) => {
  if (!amenities || typeof amenities !== 'object') return [];
  
  return Object.entries(amenities)
    .filter(([_, value]) => value === true)
    .map(([key]) => {
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
    });
};

/**
 * Gets property type label
 * @param {String} propertyType - The raw property type 
 * @returns {String} Formatted property type
 */
export const getPropertyTypeLabel = (propertyType) => {
  if (!propertyType) return '';
  
  const typeMap = {
    'flat': 'Flat / Apartment',
    'house': 'House / Villa',
    'plot': 'Plot / Land',
    'office': 'Office Space',
    'shop': 'Shop / Showroom',
    'other': 'Other Property'
  };
  
  return typeMap[propertyType.toLowerCase()] || 
    propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
};

export default {
  parsePropertyData,
  normalizePropertyData,
  extractPropertyData,
  getFormattedAmenities,
  getPropertyTypeLabel
}; 