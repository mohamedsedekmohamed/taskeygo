import { Outlet } from "react-router-dom";
import Navbar from "../PublicPage/Navbar";
import ParticlesBackground from "../Ui/ParticlesBackground";
const UsersLayout = () => {
  return (
    <div className="max-w-screen ">
      <Navbar />
      <div className="relative p-6">
        <div className="absolute inset-0" ><ParticlesBackground/></div>
        <Outlet />
      </div>
    </div>
  );
};

export default UsersLayout;
