import React from 'react'
import { Routes, Route,Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import NotificationsPage from './pages/NotificationsPage'
import FriendsPage from './pages/FriendsPage'
import {Toaster} from 'react-hot-toast'
import PageLoader from './components/PageLoader'
import useAuthUser from './hooks/useAuthUser'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.js'
import UserProfilePage from './pages/UserProfilePage.jsx'
import AddNewPostPage from './pages/AddNewPostPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import EmailVerificationPage from './pages/EmailVerificationPage.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'


const App = () => {

  const {isLoading, authUser } = useAuthUser();

  const {theme} = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = Boolean(authUser?.isOnboarded);
  const isVerified = Boolean(authUser?.isVerified);

  if(isLoading){
    return <PageLoader />
  }


  return (
  <div className="h-screen" data-theme={theme}>
    <Routes>
      {/* --- Protected Routes (Home, Chat, Profile, etc.) --- */}
      {/* Logic: Must be Auth + Verified + Onboarded. If not, redirect to the specific missing step. */}
      
      <Route
        path="/"
        element={
          !isAuthenticated ? <Navigate to="/login" /> :
          !isVerified ? <Navigate to="/verify-email" /> :
          !isOnboarded ? <Navigate to="/onboarding" /> :
          <Layout showSidebar={true} showSearchBar={true}><HomePage /></Layout>
        }
      />

      <Route
        path="/chat/:id"
        element={
          !isAuthenticated ? <Navigate to="/login" /> :
          !isVerified ? <Navigate to="/verify-email" /> :
          !isOnboarded ? <Navigate to="/onboarding" /> :
          <Layout showSidebar={false}><ChatPage /></Layout>
        }
      />

      <Route
        path="/call/:id"
        element={
          !isAuthenticated ? <Navigate to="/login" /> :
          !isVerified ? <Navigate to="/verify-email" /> :
          !isOnboarded ? <Navigate to="/onboarding" /> :
          <CallPage />
        }
      />

      <Route
        path="/notifications"
        element={
          !isAuthenticated ? <Navigate to="/login" /> :
          !isVerified ? <Navigate to="/verify-email" /> :
          !isOnboarded ? <Navigate to="/onboarding" /> :
          <Layout showSidebar={true}><NotificationsPage /></Layout>
        }
      />

      <Route
        path="/friends"
        element={
          !isAuthenticated ? <Navigate to="/login" /> :
          !isVerified ? <Navigate to="/verify-email" /> :
          !isOnboarded ? <Navigate to="/onboarding" /> :
          <Layout showSidebar={true} showSearchBar={true}><FriendsPage /></Layout>
        }
      />

      <Route
        path="/user-profile"
        element={
          !isAuthenticated ? <Navigate to="/login" /> :
          !isVerified ? <Navigate to="/verify-email" /> :
          !isOnboarded ? <Navigate to="/onboarding" /> :
          <Layout showSidebar={true}><UserProfilePage /></Layout>
        }
      />

      <Route
        path="/add-post"
        element={
          !isAuthenticated ? <Navigate to="/login" /> :
          !isVerified ? <Navigate to="/verify-email" /> :
          !isOnboarded ? <Navigate to="/onboarding" /> :
          <Layout showSidebar={true}><AddNewPostPage /></Layout>
        }
      />

      <Route
        path="/user-profile/:id"
        element={
          !isAuthenticated ? <Navigate to="/login" /> :
          !isVerified ? <Navigate to="/verify-email" /> :
          !isOnboarded ? <Navigate to="/onboarding" /> :
          <Layout showSidebar={true}><ProfilePage /></Layout>
        }
      />

      {/* --- Public / Entry Routes --- */}
      
      <Route
        path="/signup"
        element={
          !isAuthenticated ? <SignUpPage /> :
          !isVerified ? <Navigate to="/verify-email" /> :
          !isOnboarded ? <Navigate to="/onboarding" /> :
          <Navigate to="/" />
        }
      />

      <Route
        path="/login"
        element={
          !isAuthenticated ? <LoginPage /> :
          !isVerified ? <Navigate to="/verify-email" /> :
          !isOnboarded ? <Navigate to="/onboarding" /> :
          <Navigate to="/" />
        }
      />

      {/* --- Intermediate Steps --- */}

      <Route
        path="/verify-email"
        element={
          !isAuthenticated ? <Navigate to="/login" /> :
          isVerified ? <Navigate to="/" /> : 
          <EmailVerificationPage />
        }
      />

      <Route
        path="/onboarding"
        element={
          !isAuthenticated ? <Navigate to="/login" /> :
          !isVerified ? <Navigate to="/verify-email" /> :
          isOnboarded ? <Navigate to="/" /> :
          <OnboardingPage />
        }
      />

      <Route path = "/forgot-password" element={ <ForgotPassword />} />

      <Route path = "/reset-password/:token" element={ <ResetPassword />} />

    </Routes>
    <Toaster />
  </div>
);
}

export default App
