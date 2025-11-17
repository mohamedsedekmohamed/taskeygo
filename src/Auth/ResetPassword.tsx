import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const { email } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await axios.post(
        "https://taskatbcknd.wegostation.com/api/user/auth/local/resetPassword",
        {
          email,
          newPassword,
        }
      );

      setSuccessMsg("✅ Password updated successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-md gap-4 p-8 mx-auto bg-white shadow-2xl rounded-2xl"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Reset Password
        </h2>

        {error && (
          <p className="p-2 text-sm text-center text-red-600 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </p>
        )}
        {successMsg && (
          <p className="p-2 text-sm text-center text-green-700 bg-green-100 border border-green-300 rounded-lg">
            {successMsg}
          </p>
        )}

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
          className="px-4 py-3 transition border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700 hover:border-gray-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="py-3 font-semibold text-white transition bg-black rounded-xl hover:bg-gray-800 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
