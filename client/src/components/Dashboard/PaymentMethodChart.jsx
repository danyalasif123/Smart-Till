import { Link } from "react-router-dom";

import "./PaymentMethodChart.css";

import {

  PieChart,

  Pie,

  Cell,

  ResponsiveContainer,

  Tooltip,

} from "recharts";

const COLORS = [

  "#2563eb",

  "#10b981",

  "#f59e0b",

  "#ef4444",

  "#8b5cf6",

];

const formatCurrency = (amount) =>
  new Intl.NumberFormat(
    "en-GB",
    {
      style: "currency",
      currency: "GBP",
    }
  ).format(amount || 0);

const PaymentMethodChart = ({
  data = [],
}) => {

  const totalRevenue = data.reduce(
    (sum, item) =>
      sum + Number(item.amount),
    0
  );

  return (

    <div className="payment-card">

      <div className="payment-header">

        <div>

          <h2>
            Payment Methods
          </h2>

          <p>
            Revenue by payment type
          </p>

        </div>

        <Link
          to="/admin/reports"
          className="payment-link"
        >
          View Report →
        </Link>

      </div>

      <div className="payment-chart">

        <ResponsiveContainer
  width="100%"
  height={120}
>

          <PieChart>
<Pie
  data={data}
  dataKey="amount"
  nameKey="_id"
  innerRadius={35}
  outerRadius={55}
  paddingAngle={2}
>

              {data.map(
                (
                  entry,
                  index
                ) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />

                )
              )}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      <div className="payment-total">

        Total Revenue

        <strong>

          {formatCurrency(
            totalRevenue
          )}

        </strong>

      </div>

      <div className="payment-list">

        {data.map(
          (
            item,
            index
          ) => (

            <div
              className="payment-row"
              key={item._id}
            >

              <div className="payment-name">

                <span
                  className="payment-dot"
                  style={{
                    background:
                      COLORS[
                        index %
                          COLORS.length
                      ],
                  }}
                />

                {item._id}

              </div>

              <strong>

                {formatCurrency(
                  item.amount
                )}

              </strong>

            </div>

          )
        )}

      </div>

    </div>

  );

};

export default PaymentMethodChart;