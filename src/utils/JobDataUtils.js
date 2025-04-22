/**
 * Utility functions for normalizing job data
 */

/**
 * Attempts to parse job data from various formats
 * @param {Object|String} jobData - The job data to parse
 * @returns {Object} Normalized job data object
 */
export const parseJobData = (jobData) => {
  if (!jobData) return {};
  
  // If already an object, use it directly
  if (typeof jobData === 'object' && !Array.isArray(jobData)) {
    return jobData;
  }
  
  // If it's a string, try to parse it as JSON
  if (typeof jobData === 'string') {
    try {
      return JSON.parse(jobData);
    } catch (e) {
      console.error('Failed to parse job data string:', e);
      return {};
    }
  }
  
  return {};
};

/**
 * Normalize job data to ensure all fields are present and in the correct format
 * @param {Object} jobData - The raw job data
 * @returns {Object} - Normalized job data
 */
export const normalizeJobData = (jobData) => {
  const data = parseJobData(jobData);
  
  if (!data || Object.keys(data).length === 0) {
    return {};
  }

  // Define string fields to normalize
  const stringFields = [
    'jobRole',
    'jobCategory',
    'companyName',
    'positionType',
    'salaryPeriod',
    'salaryFrom',
    'salaryTo',
    'educationRequired',
    'experienceRequired',
    'jobLocation',
    'skills',
    'openings'
  ];
  
  // Create a normalized object
  const normalized = {};
  
  // Process string fields
  stringFields.forEach(field => {
    if (data[field] !== undefined) {
      normalized[field] = String(data[field] || '');
    } else {
      // Set default values for missing required fields
      switch (field) {
        case 'positionType':
          normalized[field] = 'Full-time';
          break;
        case 'salaryPeriod':
          normalized[field] = 'Monthly';
          break;
        case 'educationRequired':
          normalized[field] = 'Any';
          break;
        case 'experienceRequired':
          normalized[field] = 'Fresher';
          break;
        case 'openings':
          normalized[field] = '1';
          break;
        default:
          normalized[field] = '';
      }
    }
  });

  return normalized;
};

/**
 * Extract and normalize job data from product data
 * @param {Object} product - The product data from the API
 * @returns {Object} - Normalized job data
 */
export const extractJobData = (product) => {
  // Check if there's job data
  if (!product) return {};
  
  // Try to get job data from various possible locations
  let jobData = product.jobData;
  
  // If we have nested job data, extract it
  if (jobData && typeof jobData === 'object' && 
      Object.keys(jobData).length === 1 && jobData.jobData) {
    jobData = jobData.jobData;
  }
  
  console.log("Raw job data pre-normalization:", jobData);
  
  // Return normalized job data
  return normalizeJobData(jobData);
};

/**
 * Format salary for display
 * @param {Object} jobData - Normalized job data
 * @returns {String} Formatted salary text
 */
export const formatSalaryDisplay = (jobData) => {
  if (!jobData) return "Not specified";
  
  if (!jobData.salaryFrom && !jobData.salaryTo) return "Not specified";
  
  if (jobData.salaryFrom && jobData.salaryTo) {
    return `₹${jobData.salaryFrom} - ₹${jobData.salaryTo} per ${jobData.salaryPeriod?.toLowerCase() || 'month'}`;
  }
  
  if (jobData.salaryFrom) {
    return `₹${jobData.salaryFrom}+ per ${jobData.salaryPeriod?.toLowerCase() || 'month'}`;
  }
  
  if (jobData.salaryTo) {
    return `Up to ₹${jobData.salaryTo} per ${jobData.salaryPeriod?.toLowerCase() || 'month'}`;
  }
};

export default {
  parseJobData,
  normalizeJobData,
  extractJobData,
  formatSalaryDisplay
}; 