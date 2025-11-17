import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative lg:grid lg:h-screen lg:place-content-center">
      <div className="w-full px-6 py-16 mx-auto max-w-7xl sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Understand user flow and{" "}
            <strong className="px-2 text-black bg-white rounded-md">increase</strong> conversions
          </h1>

          <p className="mt-6 text-lg text-gray-700 sm:text-xl sm:leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nisi. Natus, provident
            accusamus impedit minima harum corporis iusto.
          </p>

          <div className="flex justify-center gap-6 mt-10 sm:mt-12">
            <button
              onClick={() => navigate("/get-started")}
              className="relative inline-block px-6 py-3 overflow-hidden font-medium text-white transition-all duration-500 bg-black border-2 border-black rounded-md shadow-lg group hover:text-black hover:bg-white"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-500 bg-black group-hover:w-0"></span>
              <span className="relative z-10">Get Started</span>
            </button>

            <button
              onClick={() => navigate("/learn-more")}
              className="relative inline-block px-6 py-3 overflow-hidden font-medium text-black transition-all duration-500 bg-white border-2 border-black rounded-md shadow-lg group hover:text-white hover:bg-black"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-500 bg-white group-hover:w-0"></span>
              <span className="relative z-10">Learn More</span>
            </button>
          </div>
        </div>
      </div>

      {/* Animated floating circles background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <span className="absolute bg-black rounded-full w-72 h-72 opacity-5 -top-20 -left-20 animate-pulseSlow"></span>
        <span className="absolute bg-gray-900 rounded-full w-96 h-96 opacity-10 -bottom-32 -right-32 animate-pulseSlow"></span>
      </div>

      <style>
        {`
          @keyframes pulseSlow {
            0%, 100% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.3); opacity: 0.2; }
          }
          .animate-pulseSlow {
            animation: pulseSlow 8s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
};

export default Home;
