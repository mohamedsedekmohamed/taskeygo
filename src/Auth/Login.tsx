import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginData {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    message: string;
    token: string;
    name: string;
    userId: string;
    role: string;
  };
}

const Login = () => {
  const [form, setForm] = useState<LoginData>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(
        "https://taskatbcknd.wegostation.com/api/user/auth/local/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const result: ApiResponse = await response.json();

      if (result.data) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", result.data.role);
        localStorage.setItem("user", result.data.name);

        setMessage("✅ Login successful!");

        const data = result.data;
        setTimeout(() => {
          navigate(data.role === "admin" ? "/admin/dashboard" : "/user/home");
        }, 800);
      } else {
        setError("❌ Incorrect email or password");
      }
    } catch {
      setError("❌ Login failed, try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-md p-8 overflow-hidden bg-white shadow-2xl rounded-2xl">
        {/* Title */}
        <h2 className="mb-6 text-3xl font-extrabold text-center text-gray-900">
          Welcome Back 👋
        </h2>

        {/* Status Messages */}
        {error && (
          <p className="p-3 mb-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </p>
        )}
        {message && (
          <p className="p-3 mb-4 text-center text-green-700 bg-green-100 border border-green-300 rounded-lg">
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-800">Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-3 transition border border-gray-300 outline-none rounded-xl bg-gray-50 hover:border-gray-600 focus:ring-2 focus:ring-gray-700"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-800">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="px-4 py-3 transition border border-gray-300 outline-none rounded-xl bg-gray-50 hover:border-gray-600 focus:ring-2 focus:ring-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold text-white transition bg-black rounded-xl hover:bg-gray-800 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="flex justify-between mt-5 text-sm font-medium text-gray-700">
          <button
            onClick={() => navigate("/signup")}
            className="transition hover:underline hover:text-gray-900"
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/forget")}
            className="transition hover:underline hover:text-gray-900"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
