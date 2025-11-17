import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { FaUserShield, FaUserTie, FaUser } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Lenis from "@studio-freight/lenis";
import { Link } from "react-router-dom";
import Homepic from './assets/home.jfif';
import { LuCircleArrowOutDownRight } from "react-icons/lu";

const SECTION_HEIGHT = 1500;

// Lenis wrapper
const LenisWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({ lerp: 0.05, smooth: true } as any);

    const animate = (time: number) => {
      lenisRef.current?.raf(time);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => lenisRef.current?.destroy();
  }, []);

  return <>{children}</>;
};

const Mainpage: React.FC = () => {
  return (
    <div className="relative min-h-screen text-white bg-black">
      <LenisWrapper>
        <Nav />
        <Hero />
        <LoginSection />
        <Schedule />
      </LenisWrapper>
    </div>
  );
};

// Nav
const Nav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 text-white">
    <p className="text-3xl">TeskeyGo</p> 
    <button
      onClick={() => document.getElementById("launch-schedule")?.scrollIntoView({ behavior: "smooth" })}
      className="flex items-center gap-1 text-xs text-gray-400"
    >
      <FiArrowRight />
    </button>
  </nav>
);

// Hero
const Hero = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, SECTION_HEIGHT], [25, 0]);
  const clip2 = useTransform(scrollY, [0, SECTION_HEIGHT], [75, 100]);
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;
  const backgroundSize = useTransform(scrollY, [0, SECTION_HEIGHT + 500], ["170%", "100%"]);
  const opacity = useTransform(scrollY, [SECTION_HEIGHT, SECTION_HEIGHT + 500], [1, 0]);

  return (
    <div style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }} className="relative w-full">
      <motion.div
        className="sticky top-0 w-full h-screen"
        style={{
          clipPath,
          backgroundSize,
          opacity,
          backgroundImage: `url(${Homepic})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-gray-900/0 to-gray-900" />
    </div>
  );
};

// Login Section
const LoginSection = () => (
  <div className="flex flex-col items-center justify-center w-full max-w-md gap-6 px-6 py-16 mx-auto text-center">
    <motion.h1
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 text-4xl font-extrabold text-white sm:text-5xl drop-shadow-md"
    >
     <span className="px-2 text-white rounded-md">Login As</span>
    </motion.h1>

    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="flex flex-col w-full gap-6"
    >
      <Link
        to={"/loginsuperadmin"}
        className="flex items-center justify-center w-full gap-3 py-3 text-lg font-medium text-white transition duration-300 border border-gray-700 shadow-lg bg-black/70 hover:bg-black/90 rounded-xl backdrop-blur-sm"
      >
        <FaUserShield className="text-2xl text-white" />
        Login Super Admin
      </Link>

      <Link
        to={"/login"}
        className="flex items-center justify-center w-full gap-3 py-3 text-lg font-medium text-white transition duration-300 border border-gray-700 shadow-lg bg-black/70 hover:bg-black/90 rounded-xl backdrop-blur-sm"
      >
        <FaUserTie className="text-2xl text-white" />
        Login Admin
      </Link>

      <Link
        to={"/login"}
        className="flex items-center justify-center w-full gap-3 py-3 text-lg font-medium text-white transition duration-300 border border-gray-700 shadow-lg bg-black/70 hover:bg-black/90 rounded-xl backdrop-blur-sm"
      >
        <FaUser className="text-2xl text-white" />
        Login User
      </Link>
    </motion.div>
  </div>
);

// Schedule
const Schedule = () => (
  <section id="launch-schedule" className="max-w-5xl px-4 py-48 mx-auto text-white">
    <motion.h1
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="mb-20 text-4xl font-black text-gray-100 uppercase"
    >
Features and Add-ons    </motion.h1>

    <ScheduleItem title="Project Management" date="Manage projects and tasks efficiently"  />
    <ScheduleItem title="Issue Tracking" date="Track issues and bugs accurately"  />
    <ScheduleItem title="Sprint Planning" date="Plan sprints and schedule work easily"  />
    <ScheduleItem title="Team Collaboration" date="Collaborate seamlessly with your team"  />
    <ScheduleItem title="Reporting & Analytics" date="Generate reports and insights"  />
    <ScheduleItem title="Custom Workflows" date="Design workflows tailored to your team" />
    <ScheduleItem title="Notifications & Alerts" date="Stay updated with notifications"  />
    <ScheduleItem title="Role & Permission Management" date="Control user roles and permissions"  />
  </section>
);

const ScheduleItem = ({ title, date }: { title: string; date: string; }) => (
  <motion.div
    initial={{ y: 48, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ ease: "easeInOut", duration: 0.75 }}
    className="flex items-center justify-between px-3 border-b border-gray-800 mb-9 pb-9"
  >
    <div>
      <p className="mb-1.5 text-xl text-gray-100">{title}</p>
      <p className="text-sm text-gray-500 uppercase">{date}</p>
    </div>
    <div className="flex items-center gap-1.5 text-end text-sm uppercase text-gray-500">
      <LuCircleArrowOutDownRight />
    </div>
  </motion.div>
);

export default Mainpage;
