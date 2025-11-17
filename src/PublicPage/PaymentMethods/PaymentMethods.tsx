import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../Component/Loading";

interface Plan {
  _id: string;
  name: string;
  isActive: number;
  discription: string;
  logo_Url: string;
}

const PaymentMethods: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://taskatbcknd.wegostation.com/api/user/payment-methods",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setPlans(response.data.data.paymentmethods);
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
        Available Payment Methods
      </h1>

      <div className="grid w-full max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={plan._id}
            className="flex flex-col p-6 transition-all duration-500 transform bg-white shadow-lg opacity-0 cursor-pointer rounded-3xl hover:scale-105 hover:shadow-2xl animate-fadeIn"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <h2 className="mb-4 text-2xl font-bold text-black">{plan.name}</h2>

            <div className="mb-4 space-y-2 text-black">
              <p className="text-lg">
                <span className="font-semibold">Active:</span> {plan.isActive ? "Yes" : "No"}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Description:</span> {plan.discription}
              </p>
            </div>

            {plan.logo_Url && (
              <div className="flex justify-center mb-6">
                <img
                  src={plan.logo_Url}
                  alt={plan.name}
                  className="object-contain w-24 h-24 rounded-lg shadow-sm"
                />
              </div>
            )}

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

export default PaymentMethods;
