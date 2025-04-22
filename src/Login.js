import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
  MDBCheckbox,
}
from 'mdb-react-ui-kit';
import { Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import GoogleSignIn from './GoogleSignIn';
import { useToast } from "@chakra-ui/react";
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider } from 'firebase/auth';


function Login() {
  const [err, setErr] = useState();
  const [justifyActive, setJustifyActive] = useState('tab1');
  const [registered, setRegistered] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Clean up reCAPTCHA when component unmounts
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    // Clean up reCAPTCHA when switching tabs
    if (justifyActive === 'tab3' && value !== 'tab3') {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.log("Error clearing reCAPTCHA:", error);
        }
        window.recaptchaVerifier = null;
      }
      
      // Reset phone auth state
      setOtpSent(false);
      setVerificationCode('');
      setVerificationId('');
      
      // Clear the recaptcha container
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = '';
      }
    }

    setJustifyActive(value);
  };

  function register(event){
      event.preventDefault();
      var email = document.getElementById("reemail").value;
      var password = document.getElementById("repassword").value;
      var rpassword = document.getElementById("rpassword").value;
      var name = document.getElementById("name").value;
      if (password === rpassword){
      axios
      .post("http://localhost:5000/register", {
          email,password,name,
      })
      .then((response) => {
        console.log(response.data);
        setRegistered(true)
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      })
      .catch((error) => {
        console.log(error);
        if(error.response.status === 409){
          setErr(409);
        }
      });
    }
    else{
      document.getElementById("alert").innerHTML = "Passwords do not match";
    }
  }

    function login(event){
      event.preventDefault();
      var email = document.getElementById("email").value;
      var password = document.getElementById("password").value;
      axios
      .post("http://localhost:5000/login", {
          email,password,
      })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('authemail', response.data.email);
        localStorage.setItem('authname', response.data.name);
        localStorage.setItem('authphone', response.data.phone);
        localStorage.setItem('authpicture', response.data.picture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png");
        window.location.href = '/';
      })
      .catch((error) => {
        console.log(error);
        if(error.response.status === 404){
          setErr(404);
        }
        else if(error.response.status === 400){
          setErr(400);
        }
      });
    }

  // Setup reCAPTCHA verifier
  const setupRecaptcha = () => {
    // Clear any existing reCAPTCHA instances first
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (error) {
        console.log("Error clearing reCAPTCHA:", error);
      }
      window.recaptchaVerifier = null;
    }
    
    // Create a unique ID for the reCAPTCHA container
    const recaptchaContainerId = `recaptcha-container-${Date.now()}`;
    
    // Create a new div element for the reCAPTCHA
    const recaptchaContainer = document.getElementById('recaptcha-container');
    recaptchaContainer.innerHTML = ''; // Clear any existing content
    const recaptchaElement = document.createElement('div');
    recaptchaElement.id = recaptchaContainerId;
    recaptchaContainer.appendChild(recaptchaElement);
    
    // Initialize the reCAPTCHA verifier with the new element
    window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      'size': 'invisible',
      'callback': (response) => {
        console.log("reCAPTCHA verified");
      },
      'expired-callback': () => {
        console.log("reCAPTCHA expired");
        toast({
          title: 'reCAPTCHA expired',
          description: "Please try again",
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };

  // Send OTP to phone number
  const sendOTP = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: 'Invalid phone number',
        description: "Please enter a valid phone number",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setLoading(true);
      setupRecaptcha();
      
      // Format phone number with country code if not already included
      const formattedPhoneNumber = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+91${phoneNumber}`; // Assuming India (+91) as default
      
      const appVerifier = window.recaptchaVerifier;
      
      // Render the reCAPTCHA widget
      await appVerifier.render();
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      
      // Save the verification ID
      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true);
      
      toast({
        title: 'OTP sent',
        description: `We've sent an OTP to ${formattedPhoneNumber}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: 'Error sending OTP',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (clearError) {
          console.log("Error clearing reCAPTCHA:", clearError);
        }
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (e) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: "Please enter a valid 6-digit OTP",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Create credential
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      
      // Sign in with credential
      const result = await auth.signInWithCredential(credential);
      const user = result.user;
      
      // Get ID token for backend verification
      const idToken = await user.getIdToken();
      
      // Send token to backend
      const response = await axios.post('http://localhost:5000/phone-auth', {
        credential: idToken,
        phoneNumber: user.phoneNumber
      });
      
      // Store auth data
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('authemail', response.data.email || '');
      localStorage.setItem('authname', response.data.name || user.phoneNumber);
      localStorage.setItem('authphone', user.phoneNumber);
      localStorage.setItem('authpicture', response.data.picture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png");
      
      toast({
        title: 'Login successful',
        description: "You've been successfully logged in",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: 'Error verifying OTP',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="p-3 mt-1 mb-1 my-5 d-flex flex-column">
      <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
            Register
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab3')} active={justifyActive === 'tab3'}>
            Phone Login
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent >

        <MDBTabsPane show={justifyActive === 'tab1'}>

          <div className="text-center mb-3">
            <p>Sign in with:</p>

            <div className="d-flex justify-content-center mb-4">
              <GoogleSignIn />
            </div>

            <p className="text-center mt-3">or:</p>
          </div>
          <form onSubmit={login}>
          <div className="mb-4">
                <MDBInput label='Your Email' id='email' type='email' required/>
              </div>

              <div className="mb-4">
                <MDBInput label='Password' id='password' type='password' required/>
              </div>

          <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div>

          <MDBBtn className="mb-4 w-100" type="submit">Sign in</MDBBtn>
          </form>
          {err === 404 && <Alert variant='danger'> Incorrect Email</Alert>}
          {err === 400 && <Alert variant='danger'> Incorrect Password</Alert>}
          <p className="text-center">Not a member? <a href='#' onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>Register</a></p>

        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === 'tab2'}>

          <div className="text-center mb-3">
            <p>Sign up with:</p>

            <div className="d-flex justify-content-center mb-4">
              <GoogleSignIn />
            </div>

            <p className="text-center mt-3">or:</p>
          </div>
          {registered === false &&
          <form onSubmit={register}>
          <MDBInput wrapperClass='mb-4' label='Name' id='name' type='text' required/>
          <MDBInput wrapperClass='mb-4' label='Email' id='reemail' type='email' required/>
          <MDBInput wrapperClass='mb-4' label='Password' id='repassword' type='password' required/>
          <MDBInput wrapperClass='mb-4' label='Repeat your password' id='rpassword' type='password' required/>

          <Badge id="alert" className="mb-1" bg="danger"></Badge>

          <div className='d-flex justify-content-center mb-4'>
            <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I have read and agree to the terms' required/>
          </div>
          {err === 409 && <Alert variant='danger'>User Already Exist,Please Login</Alert>}
          <MDBBtn className="mb-4 w-100" type='submit '>Sign up</MDBBtn>
          </form>
}
          {registered === true && <Alert variant='success'> Registered successfully</Alert>}

        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === 'tab3'}>
          <div className="text-center mb-3">
            <p>Sign in with Phone Number:</p>
          </div>
          
          {/* reCAPTCHA container - styled to be invisible but accessible */}
          <div 
            id="recaptcha-container" 
            style={{ 
              position: 'relative',
              minHeight: '60px',
              marginBottom: '10px',
              overflow: 'hidden'
            }}
          ></div>
          
          <form onSubmit={sendOTP}>
            <MDBInput 
              wrapperClass='mb-4' 
              label='Phone Number (with country code, e.g., +91xxxxxxxxxx)' 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              type='tel' 
              required
              disabled={otpSent || loading}
            />
            
            {!otpSent && (
              <MDBBtn className="mb-4 w-100" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </MDBBtn>
            )}
          </form>
          
          {otpSent && (
            <form onSubmit={verifyOTP}>
              <MDBInput 
                wrapperClass='mb-4' 
                label='Enter 6-digit OTP' 
                value={verificationCode} 
                onChange={(e) => setVerificationCode(e.target.value)} 
                type='text' 
                required
                disabled={loading}
                maxLength={6}
              />
              
              <MDBBtn className="mb-4 w-100" type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </MDBBtn>
              
              <p className="text-center">
                Didn't receive the code?{' '}
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  // Reset reCAPTCHA and OTP state
                  if (window.recaptchaVerifier) {
                    try {
                      window.recaptchaVerifier.clear();
                    } catch (error) {
                      console.log("Error clearing reCAPTCHA:", error);
                    }
                    window.recaptchaVerifier = null;
                  }
                  
                  // Clear the recaptcha container
                  const recaptchaContainer = document.getElementById('recaptcha-container');
                  if (recaptchaContainer) {
                    recaptchaContainer.innerHTML = '';
                  }
                  
                  setOtpSent(false);
                  setVerificationCode('');
                  setVerificationId('');
                  
                  // Trigger the OTP send process again after a short delay
                  setTimeout(() => {
                    sendOTP(new Event('click'));
                  }, 500);
                }}>
                  Resend OTP
                </a>
              </p>
            </form>
          )}
        </MDBTabsPane>

      </MDBTabsContent>

    </MDBContainer>
  );
}

export default Login;
