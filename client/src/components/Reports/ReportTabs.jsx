const ReportTabs = ({
  reportType,
  onChange,
}) => {
  const reports = [
    {
      value: "sales",
      label: "Sales Report",
    },
    {
      value: "profit",
      label: "Profit Report",
    },
    {
      value: "purchases",
      label: "Purchase Report",
    },
    {
      value: "inventory",
      label: "Inventory Report",
    },
    {
      value: "low-stock",
      label: "Low Stock",
    },
    {
      value: "customers",
      label: "Customers",
    },
    {
      value: "products",
      label: "Products",
    },
    {
      value: "cashiers",
      label: "Cashiers",
    },
  ];

  return (
    <div className="report-type-tabs">

      {reports.map((report) => (
        <button
          key={report.value}
          type="button"
          className={
            reportType ===
            report.value
              ? "active"
              : ""
          }
          onClick={() =>
            onChange(report.value)
          }
        >
          {report.label}
        </button>
      ))}

    </div>
  );
};

export default ReportTabs;