import "./WeeklySalesChart.css";

import {

  ResponsiveContainer,

  LineChart,

  Line,

  XAxis,

  YAxis,

  CartesianGrid,

  Tooltip,

} from "recharts";

const WeeklySalesChart = ({
  data = [],
}) => {

  return (

    <div className="chart-card">

      <div className="chart-header">

        <h2>
          Weekly Sales
        </h2>

      </div>

    <ResponsiveContainer width="100%" height={220}>
  <LineChart
    data={data}
    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
    <YAxis tick={{ fontSize: 11 }} />
    <Tooltip />
    <Line
      type="monotone"
      dataKey="sales"
      stroke="#2563eb"
      strokeWidth={3}
      dot={false}
    />
  </LineChart>
</ResponsiveContainer>


    </div>

  );

};

export default WeeklySalesChart;