import Chart from "react-apexcharts";

const Payment = () => {
  const data = [400, 800, 600, 1200];
  const labels = ["Jan", "Feb", "Mar", "Apr"];

  return (
    <div className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">

      <div className="p-4 bg-white shadow rounded-xl">
        <h2 className="mb-2 font-semibold">Monthly Sales</h2>
        <Chart type="line" height={200} series={[{ data }]} options={{ xaxis: { categories: labels } }} />
      </div>

      <div className="p-4 bg-white shadow rounded-xl">
        <h2 className="mb-2 font-semibold">Revenue</h2>
        <Chart type="bar" height={200} series={[{ data }]} options={{ xaxis: { categories: labels } }} />
      </div>

      <div className="p-4 bg-white shadow rounded-xl">
        <h2 className="mb-2 font-semibold">Order Status</h2>
        <Chart type="pie" height={200} series={[65, 25, 10]} options={{ labels: ["Success", "Pending", "Failed"] }} />
      </div>

    </div>
  );
};

export default Payment;
