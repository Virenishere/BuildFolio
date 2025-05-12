import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Dashboard from "./features/dashboard/Dashboard";
import CustomisedResume from "./features/resume/CustomisedResume";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import AboutUs from "./pages/About";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

const App = () => {
  return(
    <div>
      <Routes>
        {/* public routes */}
      <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/howitworks" element={<HowItWorks />} />
      <Route path="/features" element={<Features/>} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      </Route>

      {/* private routes  */}
      <Route element={<PrivateLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/editresume" element={<CustomisedResume />} />
      </Route>

      <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster theme="system" richColors />
    </div>
  )
};

export default App;
