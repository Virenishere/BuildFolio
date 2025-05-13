import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import LoadingSpinner from "@/components/LoadingSpinner";

const PrivateLayout = () => {
  const [loading, setLoading] = useState(true);

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
    <div>
      <Outlet />
    </div>
  );
};

export default PrivateLayout;
