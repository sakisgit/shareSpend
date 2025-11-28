
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Footer from "../homepage/Footer/Footer";
import Header from "../homepage/Header/Header";
import StatsNavBar from "../../NavBar/StatsNavBar";

ChartJS.register(ArcElement, Tooltip, Legend);

// Fake data για gauges
const gaugeUserData = {
  labels: ["Used", "Remaining"],
  datasets: [
    {
      data: [70, 30],
      backgroundColor: ["#36A2EB", "#E5E5E5"],
      borderWidth: 0,
    },
  ],
};

const gaugeGroupData = {
  labels: ["Used", "Remaining"],
  datasets: [
    {
      data: [50, 50],
      backgroundColor: ["#FF6384", "#E5E5E5"],
      borderWidth: 0,
    },
  ],
};

// Fake Pie data
const categoryData = {
  labels: ["Food", "Transport", "Bills", "Entertainment"],
  datasets: [
    {
      data: [400, 300, 500, 200],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      borderWidth: 1,
    },
  ],
};

// StatsSummary component
const StatsSummary = ({ title, value }: { title: string; value: string | number }) => (
  <div className="bg-white shadow-md rounded-xl p-6 w-64 text-center">
    <h3 className="text-gray-500">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

const Stats = () => {
  return (
    <>
      <Header NavBarComponent={StatsNavBar} />

      {/* Hero / Title */}
      <section className="p-6 text-center">
        <h1 className="text-3xl font-semibold">Stats Overview</h1>
        <p className="text-gray-600 mt-2">Here you can see your app stats at a glance</p>
      </section>

      {/* Stats Summary Boxes */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 justify-center">
        <StatsSummary title="Total Expenses" value="1200€" />
        <StatsSummary title="Total Paid" value="8" />
        <StatsSummary title="Active Users" value="25" />
        <StatsSummary title="Pending Expenses" value="5" />
      </section>

      {/* Charts */}
      <section className="flex flex-wrap justify-center gap-6 p-6">
        {/* User Expenses Gauge */}
        <div className="p-4 border rounded shadow text-center w-64">
          <h2 className="font-semibold mb-2">User Expenses Progress</h2>
          <Doughnut
            data={gaugeUserData}
            options={{ cutout: "70%", plugins: { legend: { display: false } } }}
          />
          <p className="mt-2 font-semibold text-blue-500">70%</p>
        </div>

        {/* Group Expenses Gauge */}
        <div className="p-4 border rounded shadow text-center w-64">
          <h2 className="font-semibold mb-2">Group Expenses Progress</h2>
          <Doughnut
            data={gaugeGroupData}
            options={{ cutout: "70%", plugins: { legend: { display: false } } }}
          />
          <p className="mt-2 font-semibold text-red-500">50%</p>
        </div>

        {/* Pie Chart */}
        <div className="p-4 border rounded shadow text-center w-64">
          <h2 className="font-semibold mb-2">Where Expenses Gone</h2>
          <Pie data={categoryData} />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Stats;
