import { Bar } from "react-chartjs-2";

function AnalyticsChart({ pgCount = 0, userCount = 0, searchTrends = {} }) {
  const data = {
    labels: Object.keys(searchTrends),
    datasets: [
      {
        label: "Searches",
        backgroundColor: "rgba(54,162,235,0.5)",
        data: Object.values(searchTrends),
      },
    ],
  };
  return (
    <div>
      <h3 className="font-bold">
        PGs: {pgCount} | Users: {userCount}
      </h3>
      <Bar data={data} />
    </div>
  );
}
export default AnalyticsChart;
