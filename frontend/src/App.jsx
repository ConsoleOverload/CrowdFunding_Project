import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home
from "./pages/Home";

import Login
from "./pages/Login";

import Signup
from "./pages/Signup";

import Campaigns
from "./pages/Campaigns";

import CreateCampaign
from "./pages/CreateCampaign";

import CampaignDetails
from "./pages/CampaignDetails";

import Profile
from "./pages/Profile";

import AdminDashboard
from "./pages/AdminDashboard";

import AdminProfile
from "./pages/AdminProfile";

import NotFound
from "./pages/NotFound";

import ProtectedRoutes
from "./routes/ProtectedRoutes";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/campaigns"
          element={<Campaigns />}
        />

        <Route
          path="/campaigns/:id"
          element={<CampaignDetails />}
        />

        {/* PROTECTED */}

        <Route
          path="/create"
          element={
            <ProtectedRoutes>
              <CreateCampaign />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />

        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin"
          element={
            <ProtectedRoutes>
              <AdminDashboard />
            </ProtectedRoutes>
          }
        />

        {/* ADMIN PROFILE */}

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoutes>
              <AdminProfile />
            </ProtectedRoutes>
          }
        />

        {/* 404 */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
