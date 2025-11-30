import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Component/Loading";
import type { ChangeEvent } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: string;
  totalRejectedPoints: number;
  createdAt: string;
  updatedAt: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token"); // لو بتستخدم JWT

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "https://taskatbcknd.wegostation.com/api/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data?.data?.user);
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  // ------------------ UPDATE PROFILE ------------------
  const updateProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      await axios.put(
        "https://taskatbcknd.wegostation.com/api/user/profile",
        {
          name: user.name,
          email: user.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ DELETE ACCOUNT ------------------
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await axios.delete(
        "https://taskatbcknd.wegostation.com/api/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Account deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ------------------ HANDLE INPUT ------------------
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: keyof User
  ) => {
    if (!user) return;
    setUser({ ...user, [key]: e.target.value });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user)
      return (
      <div className="min-h-screen text-center bg-white">
        <Loader color={"#000000"} />
      </div>
    );
  return (
    <div className="flex items-center justify-center min-h-screen px-4 ">
      <div className="w-full max-w-md bg-white border border-black rounded-2xl p-6 shadow-[4px_4px_0_#000]">

        {/* Title */}
        <h2 className="mb-6 text-3xl font-bold text-center text-black">
          User Profile
        </h2>

        {/* Name */}
        <label className="block mb-1 font-semibold text-black">Name</label>
        <input
          type="text"
          disabled={!editMode}
          value={user.name}
          onChange={(e) => handleChange(e, "name")}
          className={`w-full border border-black rounded-xl p-2 mb-4 
          ${editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
        />

        {/* Email */}
        <label className="block mb-1 font-semibold text-black">Email</label>
        <input
          type="email"
          disabled={!editMode}
          value={user.email}
          onChange={(e) => handleChange(e, "email")}
          className={`w-full border border-black rounded-xl p-2 mb-6 
          ${editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
        />

        {/* Buttons */}
        <div className="flex justify-between gap-3">

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="w-full py-2 font-bold text-black transition border border-black rounded-xl hover:bg-black hover:text-white"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={updateProfile}
              className="w-full py-2 font-bold text-white transition bg-black border border-black rounded-xl hover:opacity-80"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          )}

          <button
            onClick={deleteAccount}
            className="w-full py-2 font-bold text-black transition border border-black rounded-xl hover:bg-red-600 hover:text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
