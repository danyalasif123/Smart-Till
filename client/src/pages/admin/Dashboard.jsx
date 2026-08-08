import { useEffect, useState } from "react";
import "./Dashboard.css";

import { getDashboard } from "../../services/dashboardService";
import SummaryCards from "../../components/Dashboard/SummaryCards";
import WeeklySalesChart from "../../components/Dashboard/WeeklySalesChart";
import TopProducts from "../../components/Dashboard/TopProducts";
import RecentSales from "../../components/Dashboard/RecentSales";
import LowStockProducts from "../../components/Dashboard/LowStockProducts";
import RecentPurchases from "../../components/Dashboard/RecentPurchases";
import PaymentMethodChart from "../../components/Dashboard/PaymentMethodChart";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await getDashboard();
      setDashboard(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Business overview and today's performance</p>
      </div>

      <div className="dashboard-top">
        <SummaryCards summary={dashboard?.summary} />
        <WeeklySalesChart data={dashboard?.weeklySales} />
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-bottom-left">
          <TopProducts products={dashboard?.topProducts} />
          <LowStockProducts products={dashboard?.lowStockItems} />
          <PaymentMethodChart data={dashboard?.paymentMethods} />
        </div>

        <div className="dashboard-right-grid">
          <RecentSales sales={dashboard.recentSales} />
          <RecentPurchases purchases={dashboard?.recentPurchases} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
