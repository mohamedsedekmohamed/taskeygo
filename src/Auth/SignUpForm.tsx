import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

const SignUpForm = () => {
  const [form, setForm] = useState<SignUpData>({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const nav = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = (): boolean => {
    setError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.name) return setError("Name is required"), false;
    if (!emailRegex.test(form.email)) return setError("Enter a valid email"), false;
    if (!form.password || form.password.length < 8)
      return setError("Password must be at least 8 characters"), false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "https://taskatbcknd.wegostation.com/api/user/auth/local/signup",
        form
      );

      if (res.data?.data?.userId) {
        setSuccess("✅ Account created successfully! Redirecting...");
        setTimeout(() => {
          nav("/verifyCode", { state: { user: res.data.data.userId } });
        }, 1200);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Sign Up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900">Create Account</h2>

        {error && (
          <div className="p-2 mb-3 text-sm text-center text-red-600 bg-red-100 rounded">{error}</div>
        )}

        {success && (
          <div className="p-2 mb-3 text-sm text-center text-green-700 bg-green-100 rounded">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 transition border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700 hover:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 transition border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700 hover:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 transition border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700 hover:border-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition bg-black rounded-xl hover:bg-gray-800 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => nav("/login")}
            className="font-semibold text-black hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
