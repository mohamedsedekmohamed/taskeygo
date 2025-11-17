import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyPasswordCoda = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await axios.post(
        "https://taskatbcknd.wegostation.com/api/user/auth/local/verify-code",
        { email, code }
      );
if(res){
  
  setSuccessMsg("✅ Verification successful!");
  setTimeout(() => navigate("/resetpassword", { state: { email } }), 1500);
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
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Verify Email
        </h2>

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

        {/* EMAIL */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700">Email</label>
          <input
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 transition border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700 hover:border-gray-600"
            required
          />
        </div>

        {/* CODE */}
        <input
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          maxLength={6}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
          required
          className="px-4 py-2 text-center transition border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700 hover:border-gray-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="py-3 font-semibold text-white transition bg-black rounded-xl hover:bg-gray-800 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyPasswordCoda;
