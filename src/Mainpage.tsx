import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
// import { FaUserShield, FaUserTie, FaUser } from "react-icons/fa";
import { FaUserTie, FaUser } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Lenis from "@studio-freight/lenis";
import { Link } from "react-router-dom";
import Homepic from './assets/home.jfif';
import { LuCircleArrowOutDownRight } from "react-icons/lu";
import Footer from './Footer'
import { FiArrowUpRight } from "react-icons/fi";
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
    localStorage.clear()
    return () => lenisRef.current?.destroy();
  }, []);

  return <>{children}</>;
};

const Mainpage: React.FC = () => {

  return (
    <div className="relative min-h-screen text-white bg-black">
      <LenisWrapper>
        <Nav />
        <DrawCircleText />
        <Hero />
        <TextParallaxContentExample />
        {/* <LoginSection /> */}
        <Schedule />
        <Footer />
      </LenisWrapper>
    </div>
  );
};

// Nav
const TextParallaxContentExample = () => {
  return (
    <div className="">
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="Collaborate"
        heading="Built for all of us."
      >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="Quality"
        heading="Never compromise."
      >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1504610926078-a1611febcad3?q=80&w=2416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="Modern"
        heading="Dress for the best."
      >
        <ExampleContent />
      </TextParallaxContent>
    </div>
  );
};

const IMG_PADDING = 12;

const TextParallaxContent = ({ imgUrl, subheading, heading, children }) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-screen text-white"
    >
      <p className="mb-2 text-xl text-center md:mb-4 md:text-3xl">
        {subheading}
      </p>
      <p className="text-4xl font-bold text-center md:text-7xl">{heading}</p>
    </motion.div>
  );
};

const ExampleContent = () => (
  <div className="grid max-w-5xl grid-cols-1 gap-8 px-4 pt-12 pb-24 mx-auto md:grid-cols-12">
    <h2 className="col-span-1 py-2 text-3xl font-bold md:col-span-4">
      Organize Your Tasks , Collaborate Seamlessly.    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="text-xl mb-7 text-neutral-600 md:text-2xl">
       Manage projects, assign tasks, and stay connected with your team—all in one place. Track progress in real-time, set priorities, share files, and communicate effortlessly. Our platform helps you stay organized, meet deadlines, and boost productivity, making teamwork simple and efficient. </p>
      {/* <p className="mb-8 text-xl text-neutral-600 md:text-2xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
        reiciendis blanditiis aliquam aut fugit sint.
      </p> */}
    <Link
          to={"/login"} className="w-full py-4 mt-8 text-xl text-white transition-colors rounded bg-neutral-900 px-9 hover:bg-neutral-700 md:w-fit">
        Learn more <FiArrowUpRight className="inline" />
      </Link>
    </div>
  </div>
);
const Nav = () => (
  <nav className="top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 text-white md:px-6 md:fixed">
    <p className="text-xl font-semibold md:text-3xl">TaskeyGo</p>

    <div className="flex items-center justify-center w-full gap-3 px-2 mx-auto text-center md:gap-6 md:w-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex w-full gap-2 md:w-auto md:gap-4"
      >
        <Link
          to={"/login"}
          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white transition duration-300 border border-gray-700 shadow-lg md:gap-3 md:py-3 md:px-5 md:text-lg bg-black/70 hover:bg-black/90 rounded-xl backdrop-blur-sm"
        >
          <FaUserTie className="text-lg text-white md:text-2xl" />
          Login
        </Link>

        <Link
          to={"/signup"}
          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white transition duration-300 border border-gray-700 shadow-lg md:gap-3 md:py-3 md:px-5 md:text-lg bg-black/70 hover:bg-black/90 rounded-xl backdrop-blur-sm"
        >
          <FaUser className="text-lg text-white md:text-2xl" />
          Sign Up
        </Link>
      </motion.div>
    </div>

    <button
      onClick={() =>
        document.getElementById("launch-schedule")?.scrollIntoView({
          behavior: "smooth",
        })
      }
      className="flex items-center gap-1 text-[10px] md:text-xs text-gray-400 hover:text-white transition"
    >
      <FiArrowRight className="text-sm transition transform rotate-90 md:text-base" />
    </button>
  </nav>
);


const Hero = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, SECTION_HEIGHT], [25, 0]);
  const clip2 = useTransform(scrollY, [0, SECTION_HEIGHT], [75, 100]);
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;
  const backgroundSize = useTransform(scrollY, [0, SECTION_HEIGHT + 500], ["170%", "100%"]);
  const opacity = useTransform(scrollY, [SECTION_HEIGHT, SECTION_HEIGHT + 500], [1, 0]);

  return (
    <div style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }} className="relative w-full ">
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
const DrawCircleText = () => {
  return (
    <div className="grid px-4 py-24 place-content-center text-yellow-50">
      <h1 className="max-w-2xl text-5xl leading-snug text-center">
        Scale your{" "}
        <span className="relative">
          control
          <svg
            viewBox="0 0 286 73"
            fill="none"
            className="absolute top-0 bottom-0 translate-y-3 -left-2 -right-1"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{
                duration: 1.75,
                ease: "easeInOut",
              }}
              d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
              stroke="#FACC15"
              strokeWidth="3"
            />
          </svg>
        </span>{" "}
        with TasKeygo
      </h1>
    </div>
  );
};
// Login Section
// const LoginSection = () => (
//   <div className="flex flex-col items-center justify-center w-full max-w-md gap-6 px-6 py-16 mx-auto text-center">
//     <motion.h1
//       initial={{ opacity: 0, y: -40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="mb-12 text-4xl font-extrabold text-white sm:text-5xl drop-shadow-md"
//     >
//      <span className="px-2 text-white rounded-md">Login As</span>
//     </motion.h1>

//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.4, duration: 0.6 }}
//       className="flex flex-col w-full gap-6"
//     >
//       <Link
//         to={"/loginsuperadmin"}
//         className="flex items-center justify-center w-full gap-3 py-3 text-lg font-medium text-white transition duration-300 border border-gray-700 shadow-lg bg-black/70 hover:bg-black/90 rounded-xl backdrop-blur-sm"
//       >
//         <FaUserShield className="text-2xl text-white" />
//         Login Super Admin
//       </Link>

//       <Link
//         to={"/login"}
//         className="flex items-center justify-center w-full gap-3 py-3 text-lg font-medium text-white transition duration-300 border border-gray-700 shadow-lg bg-black/70 hover:bg-black/90 rounded-xl backdrop-blur-sm"
//       >
//         <FaUserTie className="text-2xl text-white" />
//         Login Admin
//       </Link>

//       <Link
//         to={"/login"}
//         className="flex items-center justify-center w-full gap-3 py-3 text-lg font-medium text-white transition duration-300 border border-gray-700 shadow-lg bg-black/70 hover:bg-black/90 rounded-xl backdrop-blur-sm"
//       >
//         <FaUser className="text-2xl text-white" />
//         Login User
//       </Link>
//     </motion.div>
//   </div>
// );

// Schedule
const Schedule = () => (
  <section id="launch-schedule" className="max-w-5xl px-4 py-48 mx-auto text-white ">
    <motion.h1
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="mb-20 text-4xl font-black text-gray-100 uppercase"
    >
      Features and Add-ons    </motion.h1>

    <ScheduleItem title="Project Management" date="Manage projects and tasks efficiently" />
    <ScheduleItem title="Issue Tracking" date="Track issues and bugs accurately" />
    <ScheduleItem title="Sprint Planning" date="Plan sprints and schedule work easily" />
    <ScheduleItem title="Team Collaboration" date="Collaborate seamlessly with your team" />
    <ScheduleItem title="Reporting & Analytics" date="Generate reports and insights" />
    <ScheduleItem title="Custom Workflows" date="Design workflows tailored to your team" />
    <ScheduleItem title="Notifications & Alerts" date="Stay updated with notifications" />
    <ScheduleItem title="Role & Permission Management" date="Control user roles and permissions" />
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
