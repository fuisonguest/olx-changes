/**
 * Initializes Razorpay checkout
 * @param {Object} options - Razorpay options
 * @returns {Promise} - Promise that resolves when payment is complete
 */
export const initializeRazorpay = (options) => {
  return new Promise((resolve, reject) => {
    console.log('Initializing Razorpay checkout...');
    
    // Ensure prefill.contact is properly set
    if (!options.prefill) {
      options.prefill = {};
    }
    
    // Make sure contact is an empty string if not provided
    // This allows users to enter their phone number in the checkout form
    if (!options.prefill.contact) {
      options.prefill.contact = '';
    }
    
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      console.log('Razorpay already loaded, creating checkout instance');
      try {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        resolve(razorpay);
      } catch (error) {
        console.error('Error creating Razorpay instance:', error);
        reject(error);
      }
      return;
    }
    
    console.log('Loading Razorpay SDK...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Razorpay SDK loaded successfully');
      try {
        if (!window.Razorpay) {
          throw new Error('Razorpay SDK loaded but window.Razorpay is not defined');
        }
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        resolve(razorpay);
      } catch (error) {
        console.error('Error creating Razorpay instance:', error);
        reject(error);
      }
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Razorpay SDK:', error);
      reject(new Error('Failed to load Razorpay SDK'));
    };
    
    document.body.appendChild(script);
  });
}; 