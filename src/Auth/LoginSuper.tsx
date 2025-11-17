import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Hooks/ThemeContext";
import { FaEnvelope, FaLock, FaPaperPlane, FaUserShield } from "react-icons/fa";

interface LoginForm {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    message: string;
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

const LoginSuper: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("https://taskatbcknd.wegostation.com/api/superadmin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", result.data.user.role);
        localStorage.setItem("user", JSON.stringify(result.data.user) );

        setMessage("✅ Login successful!");

        setTimeout(() => {
          navigate("/superadmin/dashboard");
        }, 1000);
      } else {
        setMessage("❌ Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 transition-all duration-700 relative ${
        theme === "dark"
          ? "bg-gradient-to-br from-maincolor via-maincolor/60 to-black text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border ${
          theme === "dark"
            ? "bg-maincolor/80 border-gray-700"
            : "bg-white/90 border-gray-200"
        } backdrop-blur-md`}
      >
        <motion.h2
          className="flex items-center justify-center gap-2 mb-6 text-3xl font-bold text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaUserShield
            className={`${
              theme === "dark" ? "text-white" : "text-maincolor"
            }`}
          />
          <span
            className={`${
              theme === "dark" ? "text-white" : "text-maincolor"
            }`}
          >
            SuperAdmin Login
          </span>
        </motion.h2>

        {/* Inputs */}
        <div className="flex flex-col gap-5">
          <div className="relative">
            <FaEnvelope className="absolute text-lg text-maincolor top-4 left-3" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              }`}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute text-lg text-maincolor top-4 left-3" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              }`}
            />
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.9 }}
            className={`mt-2 py-3 text-lg font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              theme === "dark"
                ? "bg-maincolor hover:bg-maincolor/80 text-white shadow-lg shadow-blue-800/40"
                : "bg-maincolor/80 hover:bg-maincolor/60 text-white shadow-lg shadow-blue-300/40"
            }`}
          >
            <FaPaperPlane className="text-xl" />
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-3 text-center font-medium ${
                message.startsWith("✅")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </motion.p>
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default LoginSuper;
