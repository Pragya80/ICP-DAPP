import React from "react";

const StatsOverview = () => {
  const stats = {
    totalProducts: 120,
    totalOrders: 85,
    deliveredOrders: 60,
    pendingOrders: 25,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="bg-white shadow rounded-xl p-4 text-center">
          <h2 className="text-xl font-bold">{value}</h2>
          <p className="text-sm text-gray-500">{key.replace(/([A-Z])/g, " $1")}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
