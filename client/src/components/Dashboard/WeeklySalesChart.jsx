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

      <ResponsiveContainer
        width="100%"
        height={240}
      >

        <LineChart
          data={data}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="day"
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#2563eb"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

};

export default WeeklySalesChart;