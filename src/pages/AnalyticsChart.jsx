import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { apiFetch, getToken } from "../utils/api";
import { useTranslation } from "react-i18next";

// Register Chart.js components ONCE
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsChartPage() {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/analytics", {}, getToken())
      .then(setAnalytics)
      .catch((err) => setError(err.message || "Failed to load analytics"));
  }, []);

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow my-8 text-red-500">
        {t("Error loading analytics")}: {error}
      </div>
    );
  }
  if (!analytics) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow my-8">
        {t("Loading")}...
      </div>
    );
  }

  const { pgCount, userCount, searchTrends } = analytics;

  const barData = {
    labels: Object.keys(searchTrends),
    datasets: [
      {
        label: t("Searches per day"),
        backgroundColor: "rgba(54,162,235,0.7)",
        data: Object.values(searchTrends),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: t("Search Trends by Date"),
      },
    },
    scales: {
      x: { title: { display: true, text: t("Date") } },
      y: {
        beginAtZero: true,
        title: { display: true, text: t("Number of Searches") },
      },
    },
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow my-8">
      <h1 className="text-2xl font-bold mb-4">{t("Admin Analytics")}</h1>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="bg-blue-50 px-6 py-4 rounded flex-1 text-center">
          <span className="block text-sm text-gray-500">{t("Total PGs")}</span>
          <span className="text-2xl font-bold">{pgCount}</span>
        </div>
        <div className="bg-green-50 px-6 py-4 rounded flex-1 text-center">
          <span className="block text-sm text-gray-500">
            {t("Total Users")}
          </span>
          <span className="text-2xl font-bold">{userCount}</span>
        </div>
      </div>
      <Bar data={barData} options={options} />
    </div>
  );
}
