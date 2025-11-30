import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../PublicPage/Navbar";
import ParticlesBackground from "../Ui/ParticlesBackground";

const UsersLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-white">

      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Background Particles */}
      <div className="absolute inset-0 -z-0">
        <ParticlesBackground />
      </div>

      {/* Page Content */}
      <div className="relative z-10 p-6">
        <Outlet />
      </div>

    </div>
  );
};

export default UsersLayout;
