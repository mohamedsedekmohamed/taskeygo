import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../Component/Loading";
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

  if (loading) return <div className="min-h-screen text-center "><Loader color={"#000000"}/></div>;

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      <h1 className="z-10 mb-12 text-4xl font-extrabold text-center text-black">
        Our Plans
      </h1>

      <div className="grid w-full max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={plan._id}
            className="flex flex-col p-8 transition-all duration-500 transform bg-white shadow-xl opacity-0 cursor-pointer rounded-3xl hover:scale-105 hover:shadow-2xl animate-fadeIn"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <h2 className="mb-6 text-3xl font-bold text-black">{plan.name}</h2>

            <div className="mb-6 space-y-3 text-black">
              <p className="text-xl">
                <span className="font-semibold">Monthly:</span> ${plan.price_monthly}
              </p>
              <p className="text-xl">
                <span className="font-semibold">Annually:</span> ${plan.price_annually}
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-black transition-all duration-300 border border-black rounded-full hover:bg-black hover:text-white">
                {plan.projects_limit} Projects
              </span>
              <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-black transition-all duration-300 border border-black rounded-full hover:bg-black hover:text-white">
                {plan.members_limit} Members
              </span>
            </div>

            <button className="py-3 mt-auto text-lg font-semibold text-white transition-all duration-300 bg-black rounded-lg hover:bg-black hover:scale-105">
              Choose Plan
            </button>
          </div>
        ))}
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px);}
            100% { opacity: 1; transform: translateY(0);}
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
