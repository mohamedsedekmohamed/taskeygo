import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../Component/Loading";
import { Layers } from "lucide-react"; // أيقونة ثابتة
import { useNavigate } from "react-router-dom";

interface Plan {
  _id: string;
  name: string;
  price_monthly: number;
  price_annually: number;
  projects_limit: number;
  members_limit: number;
}

const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
 const nav=useNavigate()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://taskatbcknd.wegostation.com/api/user/plans",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setPlans(response.data.data.plans);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const truncate = (str: string, limit = 15) =>
    str.length > limit ? str.slice(0, limit) + "..." : str;

  if (loading)
    return (
      <div className="min-h-screen text-center">
        <Loader color={"#000000"} />
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen p-6 max-w-screen">
      <h1 className="z-10 mb-12 text-4xl font-extrabold text-center text-black">
        Our Plans
      </h1>

      <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={plan._id}
            className="flex flex-col p-8 transition-all duration-300 bg-white border shadow-xl rounded-3xl border-black/10 hover:shadow-2xl hover:-translate-y-1 animate-fadeIn"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* أيقونة ثابتة */}
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-5 border border-black shadow-sm rounded-2xl">
              <Layers className="w-10 h-10 text-black" />
            </div>

            {/* العنوان */}
            <h2 className="mb-4 text-2xl font-bold text-center text-black break-words">
              {truncate(plan.name)}
            </h2>

            {/* الأسعار */}
            <div className="mb-6 space-y-3 text-center text-black">
              <p className="text-lg">
                <span className="font-semibold">Monthly:</span> ${plan.price_monthly}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Annually:</span> ${plan.price_annually}
              </p>
            </div>

            {/* Projects & Members */}
            <div className="flex flex-col items-center w-full gap-3 mb-8">
              <span className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium transition-all duration-300 border border-black rounded-full hover:bg-black hover:text-white">
                {plan.projects_limit} Projects
              </span>

              <span className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium transition-all duration-300 border border-black rounded-full hover:bg-black hover:text-white">
                {plan.members_limit} Members
              </span>
            </div>

            <button
              onClick={() => nav("/user/payment", { state: { id: plan._id,kind:"Plans" } })}
            className="w-full py-3 mt-auto text-lg font-semibold text-white transition-all duration-300 bg-black shadow-md rounded-xl hover:scale-105">
              Choose Plan
            </button>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Plans;
