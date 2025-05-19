import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import  AppSidebar  from "@/components/AppSidebar"


const PrivateLayout = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if no token is found
      navigate("/signin");
    }
  }, [navigate]);


  useEffect(() => {
    // Simulate auth check
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="mb-4 cursor-pointer" />
      <Outlet />
    </SidebarProvider>
  );
};

export default PrivateLayout;
