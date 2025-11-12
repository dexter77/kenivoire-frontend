import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Ads from './pages/Ads';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AuthProvider from './context/AuthContext';
import CreateAd from './pages/CreateAd';
import AdDetails from './pages/AdDetail';
import Navbar from './components/Navbar';
import MyAds from './pages/MyAds';
import EditAd from './pages/EditAd';
import Conversations from './pages/Conversations';
import ConversationDetail from './pages/ConversationDetail';
// import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <AuthProvider>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ads" element={<Ads />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-ad" element={<CreateAd />} />
          <Route path="/ads/new" element={<CreateAd />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/ads/:id" element={<AdDetails />} />
          <Route path="/my-ads/:id" element={<MyAds />} />
          <Route path="/ads/edit/:adId" element={<EditAd />} />
          <Route path="/messages" element={<Conversations />} />
          <Route path="/messages/:conversationId" element={<ConversationDetail />} />
          
        </Routes>
      </div>
      {/* <Footer /> */}
      </AuthProvider>
    </Router>
  );
}

export default App;
