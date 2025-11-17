import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

interface VerifyResponse {
  success: boolean;
  message: string;
}

const VerifyCodeForm = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.user;

  if (!userId) {
    return (
      <p className="text-lg font-semibold text-center text-red-500">
        ❌ User not found. Please Sign Up 
        again. 
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await axios.post<VerifyResponse>(
        "https://taskatbcknd.wegostation.com/api/user/auth/local/verify-email",
        { userId, code }
      );
   if(res){
    
     setSuccessMsg("✅ Verification successful!");
     setTimeout(() => navigate("/login"), 1500);
    }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-md gap-5 p-8 mx-auto bg-white shadow-2xl rounded-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Verify Email
        </h2>

        {/* Status Messages */}
        {error && (
          <p className="p-3 text-center text-red-600 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </p>
        )}
        {successMsg && (
          <p className="p-3 text-center text-green-700 bg-green-100 border border-green-300 rounded-lg">
            {successMsg}
          </p>
        )}

        {/* CODE INPUT */}
        <input
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          maxLength={6}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
          required
          className="px-4 py-3 text-center transition border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700 hover:border-gray-600"
        />

        {/* VERIFY BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="py-3 font-semibold text-white transition bg-black rounded-xl hover:bg-gray-800 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Ve rify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyCodeForm;
