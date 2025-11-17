import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!validateEmail(email)) {
      setError("❌ Enter a valid email");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://taskatbcknd.wegostation.com/api/user/auth/local/forgot-password",
        { email }
      );

      setSuccessMsg("📩 Reset code sent to your email");

      setTimeout(() => {
        navigate("/VerifyPasswordCoda", { state: { email } });
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-md gap-6 p-8 mx-auto bg-white shadow-2xl rounded-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Forget Password
        </h2>

        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        {successMsg && (
          <p className="text-sm text-center text-green-700">{successMsg}</p>
        )}

        <input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-3 transition border border-gray-300 rounded-lg outline-none bg-gray-50 focus:ring-2 focus:ring-gray-700 focus:border-gray-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="py-3 font-semibold text-white transition bg-black rounded-lg disabled:opacity-50 hover:bg-gray-800"
        >
          {loading ? "Sending..." : "Send Code"}
        </button>

        <p className="text-sm text-center text-gray-700">
          Remember password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="font-medium text-gray-900 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default ForgetPasswordForm;
