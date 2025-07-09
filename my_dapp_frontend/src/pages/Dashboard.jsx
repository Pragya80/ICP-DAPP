import React from 'react';
import ManufacturerDashboard from '../components/dashboard/ManufacturerDashboard';
import DistributorDashboard from '../components/dashboard/DistributorDashboard';
import RetailerDashboard from '../components/dashboard/RetailerDashboard';
import CustomerDashboard from '../components/dashboard/CustomerDashboard';

const Dashboard = () => {
  
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  switch (role) {
    case 'Manufacturer':
      return <ManufacturerDashboard />;
    case 'Distributor':
      return <DistributorDashboard />;
    case 'Retailer':
      return <RetailerDashboard />;
    case 'Customer':
      return <CustomerDashboard />;
    default:
      return <div className="text-red-500 p-6">Invalid role or user not found</div>;
  }
};

export default Dashboard;
