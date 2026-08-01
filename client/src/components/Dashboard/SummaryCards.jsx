import "./SummaryCards.css";

const money = (value) =>

  new Intl.NumberFormat(
    "en-GB",
    {
      style: "currency",
      currency: "GBP",
    }
  ).format(value || 0);

const SummaryCards = ({
  summary = {},
}) => {

  return (

    <div className="summary-cards">

      <div className="summary-card">

        <span>Today's Sales</span>

        <h2>
          {money(summary.todaySales)}
        </h2>

      </div>

      <div className="summary-card">

        <span>Today's Profit</span>

        <h2>
          {money(summary.todayProfit)}
        </h2>

      </div>

      <div className="summary-card">

        <span>Today's Purchases</span>

        <h2>
          {money(summary.todayPurchases)}
        </h2>

      </div>

      <div className="summary-card">

        <span>Transactions</span>

        <h2>
          {summary.todayTransactions || 0}
        </h2>

      </div>

    </div>

  );

};

export default SummaryCards;