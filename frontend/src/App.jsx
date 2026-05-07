import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Campaigns from "./pages/Campaigns";
import CreateCampaign from "./pages/CreateCampaign";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME PAGE FIRST */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PAGES */}
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
