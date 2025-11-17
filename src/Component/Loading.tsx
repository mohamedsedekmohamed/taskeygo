import { useTheme } from "../Hooks/ThemeContext";
import { motion } from "framer-motion";

interface Coloer{
  color?:string
}
const Loader: React.FC<Coloer> = ({color}) => {
  const { mainColor } = useTheme();
  const iconColor =color|| mainColor || "#3B82F6"; // Default Tailwind blue-500

  return (
    <div className="flex flex-col items-center justify-center w-full h-[70vh] space-y-6">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      >
        <div
          className="absolute inset-0 border-4 border-transparent rounded-full"
          style={{
            borderTopColor: iconColor,
            boxShadow: `0 0 20px ${iconColor}80`, // glow effect
          }}
        ></div>
      </motion.div>

      {/* Animated Text */}
      <motion.p
        className="text-lg font-medium tracking-wide"
        style={{ color: iconColor }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loader;
  