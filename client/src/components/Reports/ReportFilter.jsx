const ReportFilter = ({
  period,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onPeriodChange,
  onApply,
  loading,
  dateRange,
}) => {
  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================
  // PERIODS
  // ==========================================

  const periods = [
    {
      value: "today",
      label: "Today",
    },
    {
      value: "week",
      label: "This Week",
    },
    {
      value: "month",
      label: "This Month",
    },
    {
      value: "year",
      label: "This Year",
    },
    {
      value: "custom",
      label: "Custom",
    },
  ];


  return (
    <div className="report-filter-card">

      {/* PERIOD BUTTONS */}

      <div className="report-period-buttons">

        {periods.map((item) => (
          <button
            key={item.value}
            type="button"
            className={
              period === item.value
                ? "active"
                : ""
            }
            onClick={() =>
              onPeriodChange(
                item.value
              )
            }
          >
            {item.label}
          </button>
        ))}

      </div>


      {/* CUSTOM RANGE */}

      {period === "custom" && (

        <div className="report-custom-filter">

          <div>
            <label>
              From
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
            />
          </div>


          <div>
            <label>
              To
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
            />
          </div>


          <button
            type="button"
            className="report-apply-button"
            onClick={onApply}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Apply"}
          </button>

        </div>

      )}


      {/* ACTIVE RANGE */}

      {dateRange && (

        <div className="report-active-range">

          Showing data from{" "}

          <strong>
            {formatDate(
              dateRange.start
            )}
          </strong>

          {" "}to{" "}

          <strong>
            {formatDate(
              dateRange.end
            )}
          </strong>

        </div>

      )}

    </div>
  );
};

export default ReportFilter;