import { useEffect, useState } from "react";
import axios from "axios";

const Rejections = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRejections = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://taskatbcknd.wegostation.com/api/user/user-rejections",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>User Rejections</h2>

      {data.length === 0 ? (
        <p>No rejection records found.</p>
      ) : (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              {/* {item.reason || "No reason available"} */}
              {item || "No reason available"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Rejections;
