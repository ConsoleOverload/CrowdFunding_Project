import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Campaigns from "./pages/Campaigns";
import CampaignDetails from "./pages/CampaignDetails";
import CreateCampaign from "./pages/CreateCampaign";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

function App() {
return ( <BrowserRouter> <Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/campaigns" element={<Campaigns />} />
<Route path="/campaign/:id" element={<CampaignDetails />} />
<Route path="/create" element={<CreateCampaign />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/admin" element={<Admin />} />
<Route path="*" element={<NotFound />} /> </Routes> </BrowserRouter>
);
}

export default App;
