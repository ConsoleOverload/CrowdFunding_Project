import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Campaigns from "./pages/Campaigns";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignDetails from "./pages/CampaignDetails";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";


function App() {
return ( <BrowserRouter>

  <Routes>

    {/* First Page */}
    <Route path="/" element={<Login />} />

    {/* Signup */}
    <Route path="/signup" element={<Signup />} />

    {/* Home */}
    <Route path="/home" element={<Home />} />

    {/* Campaigns */}
    <Route path="/campaigns" element={<Campaigns />} />

    {/* Create Campaign */}
    <Route path="/create" element={<CreateCampaign />} />

    {/* Campaign Details */}
    <Route path="/campaign/:id" element={<CampaignDetails />} />

    <Route path="/profile" element={<Profile />} />

    <Route path="/admin" element={<Admin />} />



  </Routes>

</BrowserRouter>


);
}

export default App;
