import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../Component/Loading";
import { CreditCard } from "lucide-react"; // أيقونة ثابتة جديدة
import { useNavigate } from "react-router-dom";
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
 const nav=useNavigate()
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
        console.error("Error fetching payment methods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen text-center">
        <Loader color={"#000000"} />
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-white max-w-screen">
      <h1 className="z-10 mb-12 text-4xl font-extrabold text-center text-black">
        Available Payment Methods
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
              <CreditCard className="w-10 h-10 text-black" />
            </div>

            {/* الاسم */}
            <h2 className="mb-4 text-2xl font-bold text-center text-black">
              {plan.name}
            </h2>

            {/* البيانات */}
            <div className="mb-6 space-y-3 text-center text-black">
              <p className="text-lg">
                <span className="font-semibold">Active:</span>{" "}
                {plan.isActive ? "Yes" : "No"}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Description:</span>{" "}
                {plan.discription || "No description"}
              </p>
            </div>

            {plan.logo_Url && (
              <div className="flex justify-center mb-6">
                <img
                  src={plan.logo_Url}
                  alt={plan.name}
                  className="object-contain w-24 h-24 border rounded-lg shadow-sm border-black/10"
                />
              </div>
            )}

           <button
  onClick={() => nav("/user/payment", { state: { id: plan._id ,kind:"PaymentMethods" } })}
  className="w-full py-3 mt-auto text-lg font-semibold text-white transition-all duration-300 bg-black shadow-md rounded-xl hover:scale-105"
>
  Choose Method
</button>

          </div>
        ))}
      </div>

      {/* Animation */}
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

export default PaymentMethods;
