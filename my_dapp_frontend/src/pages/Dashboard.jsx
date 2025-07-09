import StatsOverview from "../components/dashboard/StatsOverview";

function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <StatsOverview />
      {/* You can add MetricsChart or other components here later */}
    </div>
  );
}

export default Dashboard;