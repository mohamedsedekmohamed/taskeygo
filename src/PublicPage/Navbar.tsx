import  { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { FaSignOutAlt } from "react-icons/fa";
// import { motion } from "framer-motion";
import { FaTasks } from "react-icons/fa";
import { FaUserAstronaut } from "react-icons/fa6";

const navLinks = [
  { name: "Home", href: "/user/home" },
  { name: "Plans", href: "/user/plan" },
  { name: "Rejections", href: "/user/rejections" },
  { name: "Project", href: "/user/project" },
  // { name: "Task", href: "/user/task" },
  // { name: "payment Methods", href: "/user/PaymentMethods" },
];

const Navbar = () => {
  // const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

// const handleLogout = () => {
//     localStorage.clear();
//     navigate("/mainpage");   
//   };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-black">
      <div className="px-4 mx-auto sm:px-3 lg:px-5">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-between flex-1 gap-4 md:justify-start">
            <a className="block text-teal-600 dark:text-teal-300" href="/user/home">
              <span className="sr-only">Home</span>
             <FaTasks className="text-2xl text-white"/>
            </a>

            <button
              className="inline-flex items-center justify-center p-2 text-gray-600 rounded-md md:hidden dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          <nav className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="relative px-3" ref={dropdownRef}>
            <button
              onClick={() => navigate("/user/profile")}
              type="button"
              className="overflow-hidden border border-gray-300 rounded-full shadow-inner "
            >
              <span className="sr-only">Toggle dashboard menu</span>
            <FaUserAstronaut className="text-4xl text-white"/>
            </button>

            {/* {dropdownOpen && (
              <div className="absolute right-0 z-100 top-2 mt-0.5 w-56 rounded-md border border-gray-100  shadow-lg dark:border-gray-800  bg-black">
                <div className="flex justify-end p-2">
            
                   <motion.button
      onClick={handleLogout}
      whileTap={{ scale: 0.9 }}
      className="flex items-center justify-center w-full gap-2 px-1 py-1 text-white transition-all duration-300 bg-red-500 rounded-lg shadow-md hover:bg-red-600"
    >
      <FaSignOutAlt className="text-xl" /> <p>Log out</p>
    </motion.button>
                  </div>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="bg-white border-t border-gray-200 md:hidden dark:bg-black dark:border-gray-700">
          <ul className="flex flex-col gap-2 p-4">
            {navLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};


export default Navbar