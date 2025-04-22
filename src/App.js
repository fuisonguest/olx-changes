import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import "./App.css"
import Footer from "./Footer";
import Home from "./Home";
import MaintenancePage from "./resources/MaintenancePage";
import Sell from "./Sell";
import Modallogin from "./Modallogin";
import SellForm from "./SellForm";
import AdSuccess from "./SellFormComponents/AdSuccess";
import UserProfileEdit from "./UserProfileEdit";
import Profile from "./Profile";
import NotFound from "./resources/NotFound";
import Myads from "./Myads";
import PreviewAd from "./PreviewAd";
import CatagoryView from "./CatagoryView";
import SearchResults from "./SearchComponents/SearchResults";
import MyChat from "./MyChat";
import SearchProfile from "./SearchProfile";
import Loading from "./resources/Loading";
import Wishlist from "./Wishlist";
import { API_BASE_URL } from "./utils/config"; // Import the API base URL

function App() {
  // for modal 
  const [staticModal, setStaticModal] = useState(true);
  const toggleShow = () => setStaticModal(!staticModal);

  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [backendStatus, setBackendStatus] = useState('online'); // Track backend status

  async function checkBackendStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-status`);
      const data = await response.json();
      setBackendStatus(data.status);
    } catch (error) {
      setBackendStatus('offline');
    } finally {
      setLoading(false);
    }
  }

  // Function to check user authentication status
  async function checkAuthentication() {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.log('User is not authenticated');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/auth-endpoint`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await response.json();

      if (data.isAuthenticated) {
        console.log('User is authenticated');
        setAuth(true)
      } else {
        console.log('User is not authenticated');
        setAuth(false)
      }
    } catch (error) {
      console.error(error);
    }
     finally {
      // Authentication check is complete, update loading state
      setLoading(false);
    }
  }
  

  useEffect(() => {
    checkBackendStatus();
    checkAuthentication();
  }, []);

    if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      {backendStatus === 'online' ? (
        <Router>
          <Navbar auth={auth} setAuth={setAuth} />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/adsuccess" element={<AdSuccess />} />
            <Route path="/preview_ad/:id" element={<PreviewAd auth={auth} />} />
            <Route path="/attributes/:category/:item" element={<SellForm />} />
            {auth === true && <Route path="/chat/:id/:useremail" element={<MyChat />} />}
            {auth === true && <Route path="/chat" element={<MyChat />} />}
            {auth === true && <Route path="/editprofile" element={<UserProfileEdit />} />}
            {auth === true && <Route path="/profile" element={<Profile />} />}
            {auth === true && <Route path="/myads" element={<Myads />} />}
            {auth === true && <Route path="/sell" element={<Sell />} />}
            {auth === false && <Route path="/sell" element={[<Modallogin setStaticModal={setStaticModal} toggleShow={toggleShow} staticModal={staticModal} />, <Home />]} />}
            <Route path="/:category" element={<CatagoryView />} />
            <Route path="/results" element={<SearchResults />} />
            <Route path="/profile/:useremail" element={<SearchProfile />} />
            {auth === true && <Route path="/wishlist" element={<Wishlist />} />}
            {auth === false && <Route path="/wishlist" element={[<Modallogin setStaticModal={setStaticModal} toggleShow={toggleShow} staticModal={staticModal} />, <Home />]} />}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Footer />
        </Router>
      ) : (
        // Render the maintenance page when the backend is down
        <>
          <Navbar auth={auth} setAuth={setAuth} />
          <MaintenancePage />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;