import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaTasks } from "react-icons/fa";
import { useTheme } from "../Hooks/ThemeContext";
import type { ReactElement } from "react";


interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  links: SidebarLink[];
  mainlink: string;
  main:string
}

interface SidebarLink {
  to: string;
  name: string;
    icon: ReactElement<any, any>;
  iconActive: ReactElement<any, any>;
}

const Sidebar: React.FC<SidebarProps> = ({ setIsOpen, isOpen, links, mainlink ,main}) => {
  const [isActive, setIsActive] = useState<string>(mainlink);
  const location = useLocation();
  const { theme } = useTheme();

 useEffect(() => {
  const customPaths: Record<string, string> = {
    "/SuperAdmin/addadmin": "/SuperAdmin/admin",
    "/SuperAdmin/addcoupon": "/SuperAdmin/coupon",
    "/SuperAdmin/addpayment": "/SuperAdmin/payment",
    "/SuperAdmin/addpaymentmethod": "/SuperAdmin/paymentmethod",
    "/SuperAdmin/addplans": "/SuperAdmin/plans",
    "/SuperAdmin/addsubscription": "/SuperAdmin/subscription",
    "/admin/addproject": "/admin/project",
    "/admin/adddepartment": "/admin/department",
    "/admin/addrejected": "/admin/rejected",
    "/admin/addtask": "/admin/task",
    "/admin/usertaskproject": "/admin/task",
    "/admin/userproject": "/admin/project",
    "/user/addusers": "/user/users",
  };

  let newPath = location.pathname;

if (location.pathname.startsWith("/admin/adduserproject/")) {
  newPath = "/admin/project";
} 
else if (location.pathname.startsWith("/admin/addusertaskproject/")) {
  newPath = "/admin/task";
} 
else {
  newPath = customPaths[location.pathname] || location.pathname;
}

  setIsActive(newPath.toLowerCase());
}, [location.pathname]);

  useEffect(() => {
    if (window.innerWidth >= 1024) setIsOpen(true);
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className={`block md:hidden h-screen rounded-r-3xl top-0 z-50 transition-all duration-300 ${theme === "dark" ? "bg-[#0b0b0b]" : "bg-white"
          } ${isOpen ? "absolute " : ""}`}
      >
        <div
          className={`flex items-center ${isOpen ? "justify-start gap-4 px-4" : "justify-center"
            } py-4 cursor-pointer`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-center z-100">
            <FaTasks className={`h-8 w-8 text-maincolor`} />
          </div>
          {isOpen && (
            <h1 className={`font-bold text-[14px] lg:text-[20px] text-maincolor`}>
              TaskeyGo
            </h1>
          )}
        </div>

        <nav
          className="space-y-3 pt-6 text-center px-2 h-[calc(100vh-100px)] overflow-y-auto"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {links.map((link) => {
            const isCurrent = isActive === `/${main}/${link.to}`;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex items-center transition-all duration-200 rounded-3xl h-[48px] ${isOpen ? "w-full pl-3 gap-2" : "justify-center w-full"
                  } relative`}
              >
                <div
                  className={`absolute h-12 z-10 rounded-r-[12px] w-1 left-0 top-0 ${isCurrent ? "bg-maincolor" : ""
                    }`}
                />
                <div className="w-6 h-6">
                  {React.cloneElement(isCurrent ? link.iconActive : link.icon, {
                    className: `w-[22px] h-[22px] ${isCurrent
                        ? "text-maincolor font-extrabold"
                        : theme === "dark"
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`,
                  })}
                </div>
                {isOpen && (
                  <span
                    className={`font-bold text-[8px] ${isCurrent
                        ? "text-maincolor"
                        : theme === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                  >
                    {link.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div
        className={`hidden md:block h-screen sticky rounded-tr-3xl top-0 z-50 transition-all duration-300 ${theme === "dark" ? "bg-[#0b0b0b]" : "bg-white"
          }`}
      >
        <div
          className={`flex items-center ${isOpen ? "justify-start gap-4 px-4" : "justify-center"
            } py-4 cursor-pointer`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-center z-100">
            <FaTasks className={`h-8 w-8 text-maincolor`} />
          </div>
          {isOpen && (
            <h1 className={`font-bold text-[14px] lg:text-[24px] text-maincolor`}>
              TaskeyGo
            </h1>
          )}
        </div>

        <nav
          className="space-y-3 pt-6 text-center px-2 h-[calc(100vh-100px)] overflow-y-auto"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {links.map((link) => {
            const isCurrent = isActive === `/${main}/${link.to}`;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex items-center transition-all gap-5 duration-200 rounded-2xl h-[48px] ${isOpen ? "w-full pl-2 gap-1" : "justify-center w-full"
                  } relative`}
              >
                <div
                  className={`absolute h-12 z-10 rounded-r-[12px] w-2 right-43 top-0 ${isCurrent ? "bg-maincolor" : ""
                    }`}
                />
                <div className="w-6 h-6">
                  {React.cloneElement(isCurrent ? link.iconActive : link.icon, {
                    className: `w-[22px] h-[22px] pt-1 ${isCurrent
                        ? "text-maincolor"
                        : theme === "dark"
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`,
                  })}
                </div>
                {isOpen && (
                  <span
                    className={`font-normal text-[10px] mt-2 lg:text-[12px] transform transition-all duration-500 ${isCurrent
                        ? "lg:text-[14px] font-extrabold text-maincolor"
                        : theme === "dark" 
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                  >
                    {link.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
