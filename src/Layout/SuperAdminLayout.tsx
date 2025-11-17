import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import Nav from "../Component/Nav";
import { useTheme } from "../Hooks/ThemeContext";
import { useTranslation } from "react-i18next";
import IconDashboard from "../Icons/IconDashboard";
import IconCoupon from "../Icons/IconCoupon";
import IconPayment from "../Icons/IconPayment";
import IconPaymentmethod from "../Icons/IconPaymentmethod";
import IconPlans from "../Icons/IconPlans";
import IconSubscription from "../Icons/IconSubscription";
import IconAdmin from "../Icons/IconAdmin";
const SuperAdminLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { theme } = useTheme();
  const { t } = useTranslation();


  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsOpen(true);
    }
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SuperAdminLinks = [
  { to: "dashboard", name: t("sidebar.dashboard"), icon: <IconDashboard />, iconActive: <IconDashboard active /> },
  { to: "admin", name: t("sidebar.admin"), icon: <IconAdmin />, iconActive: <IconAdmin active /> },
  { to: "coupon", name: t("sidebar.coupons"), icon: <IconCoupon />, iconActive: <IconCoupon active /> },
  { to: "payment", name: t("sidebar.payments"), icon: <IconPayment />, iconActive: <IconPayment active /> },
  { to: "paymentmethod", name: t("sidebar.paymentMethods"), icon: <IconPaymentmethod />, iconActive: <IconPaymentmethod active /> },
  { to: "plans", name: t("sidebar.plans"), icon: <IconPlans />, iconActive: <IconPlans active /> },
  { to: "subscription", name: t("sidebar.subscriptions"), icon: <IconSubscription />, iconActive: <IconSubscription active /> },
];

  return (
    <div
      className={`
        flex h-screen overflow-hidden relative text-maincolor
        transition-colors duration-300
        ${theme === "dark" ? "bg-[#0b0b0b]" : ""}
      `}
    >
      <aside
        className={`
          transition-all duration-300 relative
          ${isOpen ? "w-56" : "w-16"}
          ${theme === "dark" ? "bg-black border-gray-800" : "bg-white border-maincolor/20"}
          border-r p-1 z-10 h-screen
        `}
      >
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} links={SuperAdminLinks} mainlink={"/superadmin/dashboard"} main={"superadmin"}/>
      </aside>

      <div className="flex flex-col w-full overflow-auto">
        <header
          className={`
            sticky top-0 z-10 shadow-md transition-colors duration-300
            ${theme === "dark" ? "bg-black" : "bg-white"}
          `}
        >
          <Nav />
        </header>

        <main
          className={`
            flex-1 w-full p-4 transition-colors duration-300 text-maincolor
            ${theme === "dark" ? "bg-[#0b0b0b] " : " "}
          `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
