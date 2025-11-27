import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../Component/Loading";
import { FaUser, FaExclamationTriangle, FaCalendarAlt, FaStar } from "react-icons/fa";
import { MdOutlineAttachEmail } from "react-icons/md";

interface Rejection {
  _id: string;
  createdAt: string;
  reason: {
    _id: string;
    reason: string;
    points: number;
  };
  points: number;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

const Rejections = () => {
  const [data, setData] = useState<Rejection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRejections = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://taskatbcknd.wegostation.com/api/user/user-rejections",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setData(res.data.data.userRejection || []);
      } catch (error) {
        console.error("Error fetching rejections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRejections();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader color={"#000000"} />
      </div>
    );

  return (
    <div className="p-6">
 <h1 className="py-4 text-5xl font-extrabold text-center">
 Rejections          </h1>
      {data.length === 0 ? (
        <p className="text-gray-500">No rejection records found.</p>
      ) : (
       <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {data.map((item, index) => (
    <li
      key={item._id}
      className="p-4 transition duration-500 transform border rounded-lg shadow-sm hover:scale-105 animate-fadeInUp"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <p className="flex items-center gap-2">
        <FaUser className="text-blue-500" /> 
        <strong>User:</strong> {item.user.name} 
      </p>

      <p className="flex items-center gap-2 mt-1">
        <MdOutlineAttachEmail className="text-black" /> 
        <strong>Email:</strong>  {item.user.email}
              </p>

      <p className="flex items-center gap-2 mt-1">
        <FaExclamationTriangle className="text-red-500" /> 
        <strong>Reason:</strong> {item.reason.reason}
      </p>

      <p className="flex items-center gap-2 mt-1">
        <FaStar className="text-yellow-500" /> 
        <strong>Points:</strong> {item.reason.points}
      </p>

      <p className="flex items-center gap-2 mt-1">
        <FaCalendarAlt className="text-green-500" /> 
        <strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}
      </p>
    </li>
  ))}
</ul>

      )}
    </div>
  );
};

export default Rejections;
