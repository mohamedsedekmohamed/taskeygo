import { useEffect, useState } from "react";
import axios from "axios";

import { FaUser, FaExclamationTriangle, FaCalendarAlt, FaStar } from "react-icons/fa";
import { MdOutlineAttachEmail } from "react-icons/md";
import Loader from "../../Component/Loading";

interface Rejection {
  _id: string;
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  reasonId?: {
    _id?: string;
    reason?: string;
    points?: number;
  };
  taskId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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

        setData(res.data.data.userRejection ?? []);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader color={"#000000"} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Section */}
      <div className="px-6 py-12 text-white bg-black shadow-xl">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-3 text-5xl font-black tracking-tight md:text-6xl">
            Rejections
          </h1>
          <p className="text-lg text-gray-300">
            Review and manage rejection records
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-12 mx-auto max-w-7xl">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex items-center justify-center w-24 h-24 mb-6 bg-gray-200 rounded-full">
              <FaExclamationTriangle className="text-5xl text-gray-400" />
            </div>
            <p className="mb-2 text-2xl font-semibold text-gray-800">No Rejections Found</p>
            <p className="text-gray-500">There are no rejection records to display at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((item, index) => {
              const userName = item.userId?.name ?? "Unknown User";
              const userEmail = item.userId?.email ?? "No Email";
              const reasonText = item.reasonId?.reason ?? "No Reason Provided";
              const points = item.reasonId?.points ?? 0;
              const createdAt = item.createdAt ? new Date(item.createdAt) : null;

              return (
                <div
                  key={item._id ?? index}
                  className="p-6 transition-all duration-300 transform bg-white border-2 border-gray-200 group rounded-2xl hover:border-black hover:shadow-2xl hover:-translate-y-2 animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card Header */}
                  <div className="pb-4 mb-4 border-b-2 border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 transition-transform duration-300 bg-black rounded-full group-hover:scale-110">
                        <FaUser className="text-xl text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 truncate">
                          {userName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MdOutlineAttachEmail className="flex-shrink-0 text-gray-400" />
                          <p className="text-sm text-gray-500 truncate">
                            {userEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-3">
                    {/* Reason */}
                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-start gap-2">
                        <FaExclamationTriangle className="flex-shrink-0 mt-1 text-gray-700" />
                        <div className="flex-1 min-w-0">
                          <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                            Reason
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {reasonText}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Points & Date */}
                    <div className="flex gap-3">
                      {/* Points */}
                      <div className="flex-1 p-3 text-center text-white bg-black rounded-lg">
                        <FaStar className="inline-block mb-1" />
                        <p className="mb-1 text-xs font-semibold tracking-wide uppercase opacity-80">
                          Points
                        </p>
                        <p className="text-2xl font-bold">
                          {points}
                        </p>
                      </div>

                      {/* Date */}
                      <div className="flex-1 p-3 text-center bg-gray-100 border border-gray-200 rounded-lg">
                        <FaCalendarAlt className="inline-block mb-1 text-gray-700" />
                        <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                          Date
                        </p>
                        <p className="text-xs font-medium text-gray-900">
                          {createdAt ? createdAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : "Unknown Date"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {createdAt ? createdAt.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Rejections;
