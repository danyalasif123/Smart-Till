import { useEffect, useState } from "react";

import "./Dashboard.css";

import { getDashboard } from "../../services/dashboardService";

import SummaryCards from "../../components/Dashboard/SummaryCards";
import WeeklySalesChart from "../../components/Dashboard/WeeklySalesChart";

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
        Loading...
      </div>
    );

  }

  return (

    <div className="dashboard-page">

      <div className="dashboard-header">

        <div>

          <h1>Dashboard</h1>

          <p>
            Business overview and today's performance
          </p>

        </div>

      </div>

      <div className="dashboard-overview">

        <SummaryCards
          summary={dashboard?.summary}
        />

        <WeeklySalesChart
          data={dashboard?.weeklySales}
        />

      </div>

    </div>

  );

};

export default Dashboard;