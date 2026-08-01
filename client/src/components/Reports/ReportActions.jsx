const ReportActions = ({
  report,
  reportType,
  period,
}) => {

  // ==========================================
  // DOWNLOAD CSV
  // ==========================================

  const downloadCSV = (
    rows,
    fileName
  ) => {

    if (
      !rows ||
      rows.length === 0
    ) {
      alert(
        "No data available to export."
      );

      return;
    }


    // ========================================
    // CSV HEADERS
    // ========================================

    const headers =
      Object.keys(
        rows[0]
      );


    // ========================================
    // ESCAPE CSV VALUES
    // ========================================

    const escapeValue = (
      value
    ) => {

      if (
        value === null ||
        value === undefined
      ) {
        return "";
      }


      let text =
        String(value);


      // Replace object values
      if (
        typeof value ===
        "object"
      ) {

        text =
          JSON.stringify(
            value
          );

      }


      // Escape quotes
      text =
        text.replace(
          /"/g,
          '""'
        );


      return `"${text}"`;
    };


    // ========================================
    // CREATE CSV
    // ========================================

    const csvRows = [

      headers.join(","),

      ...rows.map(
        (row) =>
          headers
            .map(
              (header) =>
                escapeValue(
                  row[header]
                )
            )
            .join(",")
      ),

    ];


    const csvContent =
      csvRows.join("\n");


    // ========================================
    // CREATE FILE
    // ========================================

    const blob =
      new Blob(
        [csvContent],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        "a"
      );


    link.href =
      url;

    link.download =
      fileName;


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );


    URL.revokeObjectURL(
      url
    );
  };


  // ==========================================
  // GET CSV DATA
  // ==========================================

  const getExportData = () => {

    if (!report) {
      return [];
    }


    // ========================================
    // SALES
    // ========================================

    if (
      reportType === "sales"
    ) {

      return (
        report.recentSales || []
      ).map(
        (sale) => ({

          Sale:
            sale.saleNumber,

          Date:
            sale.createdAt
              ? new Date(
                  sale.createdAt
                ).toLocaleDateString(
                  "en-US"
                )
              : "",

          Customer:
            sale.customerId
              ?.name ||
            "Walk-in",

          Cashier:
            sale.cashierId
              ?.name ||
            "",

          PaymentMethod:
            sale.paymentMethod,

          Source:
            sale.source,

          Total:
            sale.total,

        })
      );

    }


    // ========================================
    // PROFIT
    // ========================================

    if (
      reportType === "profit"
    ) {

      return (
        report.products || []
      ).map(
        (product) => ({

          Product:
            product.productName,

          SKU:
            product.sku,

          Quantity:
            product.quantitySold,

          Revenue:
            product.revenue,

          Cost:
            product.cost,

          Profit:
            product.profit,

          Margin:
            product.margin,

        })
      );

    }


    // ========================================
    // PURCHASES
    // ========================================

    if (
      reportType ===
      "purchases"
    ) {

      return (
        report.recentPurchases ||
        []
      ).map(
        (purchase) => ({

          Purchase:
            purchase.purchaseNumber,

          Date:
            purchase.createdAt
              ? new Date(
                  purchase.createdAt
                ).toLocaleDateString(
                  "en-US"
                )
              : "",

          Supplier:
            purchase.supplierId
              ?.name ||
            "Unknown",

          Total:
            purchase.total,

          Paid:
            purchase.amountPaid,

          Balance:
            Math.max(
              Number(
                purchase.total || 0
              ) -
              Number(
                purchase.amountPaid ||
                0
              ),
              0
            ),

          Status:
            purchase.paymentStatus,

        })
      );

    }


    // ========================================
    // INVENTORY
    // ========================================

    if (
      reportType ===
      "inventory"
    ) {

      return (
        report.inventory || []
      ).map(
        (product) => ({

          Product:
            product.name,

          SKU:
            product.sku,

          Category:
            product.category,

          Stock:
            product.stockQuantity,

          Unit:
            product.unit,

          CostPrice:
            product.costPrice,

          SellingPrice:
            product.sellingPrice,

          CostValue:
            product.costValue,

          RetailValue:
            product.retailValue,

          Status:
            product.stockStatus,

        })
      );

    }


    // ========================================
    // LOW STOCK
    // ========================================

    if (
      reportType ===
      "low-stock"
    ) {

      return (
        report.products || []
      ).map(
        (product) => ({

          Product:
            product.name,

          SKU:
            product.sku,

          Category:
            product.category,

          CurrentStock:
            product.stockQuantity,

          LowStockLevel:
            product.lowStockLevel,

          SuggestedReorder:
            product.suggestedReorder,

          CostPrice:
            product.costPrice,

          ReorderCost:
            product
              .estimatedReorderCost,

          Status:
            product.stockStatus,

        })
      );

    }


    // ========================================
    // CUSTOMERS
    // ========================================

    if (
      reportType ===
      "customers"
    ) {

      return (
        report.topCustomers || []
      ).map(
        (customer) => ({

          Customer:
            customer.name,

          CustomerNumber:
            customer.customerNumber,

          Email:
            customer.email,

          Phone:
            customer.phone,

          Orders:
            customer.orders,

          TotalSpent:
            customer.spent,

          AverageOrder:
            customer
              .averageOrderValue,

          LastPurchase:
            customer.lastPurchaseAt
              ? new Date(
                  customer
                    .lastPurchaseAt
                ).toLocaleDateString(
                  "en-US"
                )
              : "",

        })
      );

    }


    // ========================================
    // PRODUCTS
    // ========================================

    if (
      reportType ===
      "products"
    ) {

      return (
        report.productPerformance ||
        []
      ).map(
        (product) => ({

          Product:
            product.name,

          SKU:
            product.sku,

          Category:
            product.category,

          UnitsSold:
            product.quantitySold,

          Orders:
            product.orders,

          Revenue:
            product.revenue,

          Cost:
            product.estimatedCost,

          Profit:
            product.estimatedProfit,

          Stock:
            product.stockQuantity,

        })
      );

    }


    // ========================================
    // CASHIERS
    // ========================================

    if (
      reportType ===
      "cashiers"
    ) {

      return (
        report.cashierPerformance ||
        []
      ).map(
        (cashier) => ({

          Cashier:
            cashier.name,

          Email:
            cashier.email,

          Role:
            cashier.role,

          Sales:
            cashier.salesCount,

          ItemsSold:
            cashier.itemsSold,

          Revenue:
            cashier.revenue,

          AverageSale:
            cashier.averageSaleValue,

          CashSales:
            cashier.cashSales,

          CardSales:
            cashier.cardSales,

          OnlineSales:
            cashier.onlineSales,

          OtherSales:
            cashier.otherSales,

          LastSale:
            cashier.lastSaleAt
              ? new Date(
                  cashier.lastSaleAt
                ).toLocaleDateString(
                  "en-US"
                )
              : "",

        })
      );

    }


    return [];
  };


  // ==========================================
  // EXPORT CSV
  // ==========================================

  const handleExportCSV = () => {

    const data =
      getExportData();


    const fileName =
      `smarttill-${reportType}-${period}-report.csv`;


    downloadCSV(
      data,
      fileName
    );
  };


  // ==========================================
  // PRINT
  // ==========================================

  const handlePrint = () => {

    window.print();

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="report-actions">

      <button
        type="button"
        className="report-export-button"
        onClick={
          handleExportCSV
        }
        disabled={
          !report
        }
      >
        Export CSV
      </button>


      <button
        type="button"
        className="report-print-button"
        onClick={
          handlePrint
        }
        disabled={
          !report
        }
      >
        Print Report
      </button>

    </div>

  );
};

export default ReportActions;