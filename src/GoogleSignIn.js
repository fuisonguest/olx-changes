import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import axios from 'axios';
import { API_BASE_URL } from "./utils/config"; // Import the API base URL

function GoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Get user information from the result
      const user = result.user;
      console.log("Firebase auth successful:", user.email);
      
      const idToken = await user.getIdToken();
      console.log("ID token obtained, length:", idToken.length);
      
      // Send the token to your backend
      console.log("Sending token to backend...");
      const response = await axios.post(`${API_BASE_URL}/google-auth`, {
        credential: idToken,
      });
      
      console.log("Backend response:", response.data);
      
      // Handle the response from the server
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('authemail', response.data.email);
      localStorage.setItem('authname', response.data.name);
      localStorage.setItem('authphone', response.data.phone || "");
      localStorage.setItem('authpicture', response.data.picture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png");
      
      console.log("Authentication complete, redirecting...");
      window.location.href = '/';
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setError(error.message || "Authentication failed");
      
      if (error.response) {
        console.error("Server response error:", error.response.data);
        setError(`Server error: ${error.response.data.message || error.response.statusText}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      <button 
        onClick={handleGoogleSignIn}
        className="btn btn-primary"
        style={{ backgroundColor: '#4285F4', borderColor: '#4285F4' }}
        disabled={loading}
      >
        {loading ? (
          <span>
            <i className="fas fa-spinner fa-spin me-2"></i> Signing in...
          </span>
        ) : (
          <span>
            <i className="fab fa-google me-2"></i> Sign in with Google
          </span>
        )}
      </button>
    </div>
  );
}

export default GoogleSignIn;