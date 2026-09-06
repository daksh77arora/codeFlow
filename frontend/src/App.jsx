import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import HomePage from "./pages/HomePage";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import SnippetsPage from "./pages/SnippetsPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoaded && isSignedIn && location.pathname === "/") {
      navigate(location.state?.redirect || "/dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, location.pathname, location.state, navigate]);

  // this will get rid of the flickering effect
  if (!isLoaded) {
    return <div className="min-h-screen bg-base-100" />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problem/:id" element={<ProblemPage />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to="/" state={{ redirect: `/session/${window.location.pathname.split("/").pop()}` }} replace />} />

        {/* New Routes */}
        <Route path="/profile" element={isSignedIn ? <ProfilePage /> : <Navigate to={"/"} />} />
        <Route path="/leaderboard" element={isSignedIn ? <LeaderboardPage /> : <Navigate to={"/"} />} />
        <Route path="/snippets" element={isSignedIn ? <SnippetsPage /> : <Navigate to={"/"} />} />
        <Route path="/analytics" element={isSignedIn ? <AnalyticsPage /> : <Navigate to={"/"} />} />
        <Route path="/recordings" element={<Navigate to={isSignedIn ? "/dashboard" : "/"} replace />} />
        <Route path="*" element={<Navigate to={isSignedIn ? "/dashboard" : "/"} replace />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
