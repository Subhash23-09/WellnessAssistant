// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import WellnessPage from "./components/WellnessPage.jsx";
import HistoryPage from "./components/HistoryPage.jsx";

function AppShell() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const navigate = useNavigate();

  // ---- load from localStorage on first mount ----
  useEffect(() => {
    document.title = "Arogya Wellness Assistant";

    const saved = localStorage.getItem("arogya_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.user_id) {
          setUserId(parsed.user_id);
          setUserName(parsed.full_name || "");
          setProfileCompleted(!!parsed.profileCompleted);
          setShowLandingPage(false);
        }
      } catch {
        // ignore parse error
      }
    }
  }, []);

  const persistUser = (uid, name, profileDone = false) => {
    localStorage.setItem(
      "arogya_user",
      JSON.stringify({
        user_id: uid,
        full_name: name || "",
        profileCompleted: profileDone,
      })
    );
  };

  const clearUser = () => {
    localStorage.removeItem("arogya_user");
  };

  const handleLogout = () => {
    setUserId("");
    setUserName("");
    setProfileCompleted(false);
    setShowLandingPage(true);
    clearUser();
    navigate("/");
  };

  const handleLoginClick = () => {
    setShowLandingPage(false);
    navigate("/login");
  };

  const handleRegisterClick = () => {
    setShowLandingPage(false);
    navigate("/register");
  };

  const RequireAuth = ({ children }) =>
    userId ? children : <Navigate to="/login" replace />;

  return (
    <Routes>
      {/* Landing */}
      <Route
        path="/"
        element={
          showLandingPage && !userId ? (
            <HomePage
              onLoginClick={handleLoginClick}
              onRegisterClick={handleRegisterClick}
            />
          ) : userId ? (
            <Navigate
              to={profileCompleted ? "/wellness" : "/profile"}
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          !userId ? (
            <LoginPage
              onLogin={(uid, name) => {
                setUserId(uid);
                setUserName(name);
                setProfileCompleted(false);
                setShowLandingPage(false);
                persistUser(uid, name, false);
                navigate("/profile");
              }}
              onBackClick={() => {
                setShowLandingPage(true);
                navigate("/");
              }}
            />
          ) : (
            <Navigate
              to={profileCompleted ? "/wellness" : "/profile"}
              replace
            />
          )
        }
      />

      {/* Register (reuses LoginPage for now) */}
      <Route
        path="/register"
        element={
          !userId ? (
            <LoginPage
              onLogin={(uid, name) => {
                setUserId(uid);
                setUserName(name);
                setProfileCompleted(false);
                setShowLandingPage(false);
                persistUser(uid, name, false);
                navigate("/profile");
              }}
              onBackClick={() => {
                setShowLandingPage(true);
                navigate("/");
              }}
            />
          ) : (
            <Navigate
              to={profileCompleted ? "/wellness" : "/profile"}
              replace
            />
          )
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage
              userId={userId}
              onProfileSaved={() => {
                setProfileCompleted(true);
                persistUser(userId, userName, true);
                navigate("/wellness");
              }}
            />
          </RequireAuth>
        }
      />

      {/* Wellness */}
      <Route
        path="/wellness"
        element={
          <RequireAuth>
            {profileCompleted ? (
              <WellnessPage
                userId={userId}
                userName={userName}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/profile" replace />
            )}
          </RequireAuth>
        }
      />

      {/* History */}
      <Route
        path="/history"
        element={
          <RequireAuth>
            <HistoryPage
              userId={userId}
              onBack={() => navigate("/wellness")}
            />
          </RequireAuth>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppShell;
