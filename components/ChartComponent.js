import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Set default text color for all charts to be visible on light background
ChartJS.defaults.color = "#333"; // Darker color for text
ChartJS.defaults.font.size = 14; // Slightly larger font for better readability

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const ChartComponent = ({ type, data, options, title }) => {
  const renderChart = () => {
    switch (type) {
      case "bar":
        return <Bar data={data} options={options} />;
      case "pie":
        return <Pie data={data} options={options} />;
      case "line":
        return <Line data={data} options={options} />;
      default:
        return <p>Invalid chart type</p>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-96 flex flex-col justify-center items-center">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="w-full h-full flex items-center justify-center">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartComponent;
