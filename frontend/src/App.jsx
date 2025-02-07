import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/home/HomePage.jsx";
import LoginPage from "./pages/auth/login/LoginPage.jsx";
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function App() {
	
	const getAuthUser = async () => {
		try {
			const res = await axios.get("/api/auth/me");
			console.log("Auth User", res.data);
			return res.data;
		} catch (error) {
			// console.error("Error fetching auth user:", error);
	
			// Handle specific error cases
			if (error.response) {
				// Server responded with a status code outside 2xx range
				throw new Error(error.response.data.message || "Failed to fetch user");
			} else if (error.request) {
				// Request was made, but no response received
				throw new Error("No response from server. Please try again.");
			} else {
				// Something else caused the error
				throw new Error("An unexpected error occurred.");
			}
		}
	};
	
	const { data: authUser, isLoading, isError, error } = useQuery({
		queryKey: ["authUser"],
		queryFn: getAuthUser, // Pass function reference,
		retry: false, // Retry once before failing
		// refetchOnWindowFocus: false, // Avoid refetching on window focus
	});

if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  return (
    <div className="flex max-w-6xl mx-auto">
      {/*    this is common component  */}
      {authUser && <Sidebar />}
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path="/home" element={ authUser ? <HomePage /> : <Navigate to='/login' /> } />
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to='/' /> } />
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path="/notifications" element={ authUser ? <NotificationPage /> : <Navigate to='/login' /> } />
        <Route path="/profile/:username" element={ authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>
      { <RightPanel /> && authUser }
      <Toaster />
    </div>
  );
}

export default App;
