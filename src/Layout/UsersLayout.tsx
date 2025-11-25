// UsersLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../PublicPage/Navbar";
import ParticlesBackground from "../Ui/ParticlesBackground";

const UsersLayout = () => {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="relative z-10 ">
        <Navbar />
      </div>
      <div className="absolute inset-0 -z-0">
        <ParticlesBackground />
      </div>

      <div className="relative z-10 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default UsersLayout;
