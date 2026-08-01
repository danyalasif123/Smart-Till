import Sale from "../models/Sale.js";
import Purchase from "../models/Purchase.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
// ==========================================
// BUILD DATE RANGE
// ==========================================

const getDateRange = (
  period,
  startDate,
  endDate
) => {
  const now = new Date();

  let start;
  let end = new Date(now);


  // ========================================
  // TODAY
  // ========================================

  if (period === "today") {
    start = new Date(now);

    start.setHours(
      0,
      0,
      0,
      0
    );

    end.setHours(
      23,
      59,
      59,
      999
    );
  }


  // ========================================
  // THIS WEEK
  // Monday → Today
  // ========================================

  else if (period === "week") {
    start = new Date(now);

    const day =
      start.getDay();

    const difference =
      day === 0
        ? -6
        : 1 - day;

    start.setDate(
      start.getDate() +
        difference
    );

    start.setHours(
      0,
      0,
      0,
      0
    );

    end.setHours(
      23,
      59,
      59,
      999
    );
  }


  // ========================================
  // THIS MONTH
  // ========================================

  else if (period === "month") {
    start = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    start.setHours(
      0,
      0,
      0,
      0
    );

    end.setHours(
      23,
      59,
      59,
      999
    );
  }


  // ========================================
  // THIS YEAR
  // ========================================

  else if (period === "year") {
    start = new Date(
      now.getFullYear(),
      0,
      1
    );

    start.setHours(
      0,
      0,
      0,
      0
    );

    end.setHours(
      23,
      59,
      59,
      999
    );
  }


  // ========================================
  // CUSTOM DATE RANGE
  // ========================================

  else if (
    period === "custom"
  ) {
    if (
      !startDate ||
      !endDate
    ) {
      throw new Error(
        "Start date and end date are required for custom reports"
      );
    }

    start =
      new Date(startDate);

    end =
      new Date(endDate);

    if (
      Number.isNaN(
        start.getTime()
      ) ||
      Number.isNaN(
        end.getTime()
      )
    ) {
      throw new Error(
        "Invalid date range"
      );
    }

    start.setHours(
      0,
      0,
      0,
      0
    );

    end.setHours(
      23,
      59,
      59,
      999
    );


    if (start > end) {
      throw new Error(
        "Start date cannot be after end date"
      );
    }
  }


  // ========================================
  // DEFAULT = MONTH
  // ========================================

  else {
    start = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    start.setHours(
      0,
      0,
      0,
      0
    );

    end.setHours(
      23,
      59,
      59,
      999
    );
  }


  return {
    start,
    end,
  };
};


// ==========================================
// SALES REPORT
//
// GET /api/reports/sales
//
// Examples:
//
// ?period=today
// ?period=week
// ?period=month
// ?period=year
//
// Custom:
// ?period=custom
// &startDate=2026-07-01
// &endDate=2026-07-26
// ==========================================

export const getSalesReport = async (
  req,
  res
) => {
  try {

    const {
      period = "month",
      startDate,
      endDate,
    } = req.query;


    // ======================================
    // VALIDATE PERIOD
    // ======================================

    const allowedPeriods = [
      "today",
      "week",
      "month",
      "year",
      "custom",
    ];


    if (
      !allowedPeriods.includes(
        period
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid report period",
      });
    }


    // ======================================
    // DATE RANGE
    // ======================================

    let dateRange;

    try {
      dateRange =
        getDateRange(
          period,
          startDate,
          endDate
        );

    } catch (error) {
      return res.status(400).json({
        message:
          error.message,
      });
    }


    const {
      start,
      end,
    } = dateRange;


    // ======================================
    // BASE FILTER
    //
    // VERY IMPORTANT:
    // Report only sees sales belonging
    // to logged-in business.
    // ======================================

    const filter = {
      businessId:
        req.user.businessId,

      status:
        "completed",

      createdAt: {
        $gte: start,
        $lte: end,
      },
    };


    // ======================================
    // SUMMARY
    // ======================================

    const summaryResult =
      await Sale.aggregate([
        {
          $match: filter,
        },

        {
          $group: {
            _id: null,

            totalSales: {
              $sum: "$total",
            },

            totalSubtotal: {
              $sum: "$subtotal",
            },

            totalDiscount: {
              $sum: "$discount",
            },

            totalTax: {
              $sum: "$tax",
            },

            totalTransactions: {
              $sum: 1,
            },

            averageSale: {
              $avg: "$total",
            },

            totalItemsSold: {
              $sum: {
                $sum:
                  "$items.quantity",
              },
            },
          },
        },
      ]);


    const result =
      summaryResult[0] || {};


    // ======================================
    // PAYMENT METHOD BREAKDOWN
    // ======================================

    const paymentBreakdown =
      await Sale.aggregate([
        {
          $match: filter,
        },

        {
          $group: {
            _id:
              "$paymentMethod",

            amount: {
              $sum: "$total",
            },

            transactions: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            amount: -1,
          },
        },
      ]);


    // ======================================
    // SALE SOURCE BREAKDOWN
    //
    // POS vs Online
    // ======================================

    const sourceBreakdown =
      await Sale.aggregate([
        {
          $match: filter,
        },

        {
          $group: {
            _id:
              "$source",

            amount: {
              $sum: "$total",
            },

            transactions: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            amount: -1,
          },
        },
      ]);


    // ======================================
    // TOP PRODUCTS
    // ======================================

    const topProducts =
      await Sale.aggregate([
        {
          $match: filter,
        },

        {
          $unwind:
            "$items",
        },

        {
          $group: {
            _id:
              "$items.productId",

            productName: {
              $first:
                "$items.productName",
            },

            sku: {
              $first:
                "$items.sku",
            },

            quantitySold: {
              $sum:
                "$items.quantity",
            },

            revenue: {
              $sum:
                "$items.subtotal",
            },
          },
        },

        {
          $sort: {
            quantitySold: -1,
          },
        },

        {
          $limit: 10,
        },
      ]);


    // ======================================
    // RECENT SALES INSIDE REPORT PERIOD
    // ======================================

    const recentSales =
      await Sale.find(filter)
        .populate(
          "customerId",
          "customerNumber name"
        )
        .populate(
          "cashierId",
          "name"
        )
        .select(
          "saleNumber source customerId cashierId total paymentMethod createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .limit(10);


    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({

      period,

      dateRange: {
        start,
        end,
      },


      // ====================================
      // MAIN CARDS
      // ====================================

      summary: {

        totalSales:
          result.totalSales || 0,

        totalTransactions:
          result.totalTransactions ||
          0,

        averageSale:
          result.averageSale || 0,

        totalItemsSold:
          result.totalItemsSold ||
          0,

        subtotal:
          result.totalSubtotal || 0,

        discount:
          result.totalDiscount || 0,

        tax:
          result.totalTax || 0,
      },


      // ====================================
      // BREAKDOWNS
      // ====================================

      paymentBreakdown:
        paymentBreakdown.map(
          (item) => ({
            paymentMethod:
              item._id,

            amount:
              item.amount,

            transactions:
              item.transactions,
          })
        ),


      sourceBreakdown:
        sourceBreakdown.map(
          (item) => ({
            source:
              item._id,

            amount:
              item.amount,

            transactions:
              item.transactions,
          })
        ),


      topProducts:
        topProducts.map(
          (item) => ({
            productId:
              item._id,

            productName:
              item.productName,

            sku:
              item.sku,

            quantitySold:
              item.quantitySold,

            revenue:
              item.revenue,
          })
        ),


      recentSales,
    });

  } catch (error) {

    console.error(
      "Sales Report Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};
// ==========================================
// PROFIT REPORT
//
// GET /api/reports/profit
// ==========================================

export const getProfitReport = async (
  req,
  res
) => {
  try {
    const {
      period = "month",
      startDate,
      endDate,
    } = req.query;


    // ======================================
    // VALIDATE PERIOD
    // ======================================

    const allowedPeriods = [
      "today",
      "week",
      "month",
      "year",
      "custom",
    ];

    if (
      !allowedPeriods.includes(
        period
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid report period",
      });
    }


    // ======================================
    // GET DATE RANGE
    //
    // Uses the same helper we already
    // created for Sales Report.
    // ======================================

    let dateRange;

    try {
      dateRange =
        getDateRange(
          period,
          startDate,
          endDate
        );
    } catch (error) {
      return res.status(400).json({
        message:
          error.message,
      });
    }


    const {
      start,
      end,
    } = dateRange;


    // ======================================
    // BASE FILTER
    // ======================================

    const filter = {
      businessId:
        req.user.businessId,

      status:
        "completed",

      createdAt: {
        $gte: start,
        $lte: end,
      },
    };


    // ======================================
    // PROFIT AGGREGATION
    // ======================================

    const profitResult =
      await Sale.aggregate([
        {
          $match: filter,
        },

        {
          $unwind:
            "$items",
        },

        {
          $group: {
            _id: null,

            // Product revenue before
            // sale-level discount/tax
            productRevenue: {
              $sum:
                "$items.subtotal",
            },

            // Cost of Goods Sold
            cogs: {
              $sum: {
                $multiply: [
                  {
                    $ifNull: [
                      "$items.unitCost",
                      0,
                    ],
                  },

                  "$items.quantity",
                ],
              },
            },

            itemsSold: {
              $sum:
                "$items.quantity",
            },
          },
        },
      ]);


    const profitData =
      profitResult[0] || {};


    // ======================================
    // SALE LEVEL TOTALS
    //
    // Do this separately because after
    // $unwind, sale-level discount/tax
    // would otherwise be counted once
    // for every item.
    // ======================================

    const saleTotalsResult =
      await Sale.aggregate([
        {
          $match: filter,
        },

        {
          $group: {
            _id: null,

            totalSales: {
              $sum:
                "$total",
            },

            subtotal: {
              $sum:
                "$subtotal",
            },

            discount: {
              $sum:
                "$discount",
            },

            tax: {
              $sum:
                "$tax",
            },

            transactions: {
              $sum: 1,
            },
          },
        },
      ]);


    const saleTotals =
      saleTotalsResult[0] || {};


    // ======================================
    // VALUES
    // ======================================

    const productRevenue =
      Number(
        profitData.productRevenue ||
          0
      );

    const cogs =
      Number(
        profitData.cogs || 0
      );

    const discount =
      Number(
        saleTotals.discount || 0
      );

    const tax =
      Number(
        saleTotals.tax || 0
      );


    // ======================================
    // GROSS PROFIT
    //
    // We treat tax separately.
    //
    // Profit =
    // product revenue
    // - discounts
    // - product cost
    // ======================================

    const netRevenueBeforeTax =
      productRevenue -
      discount;

    const grossProfit =
      netRevenueBeforeTax -
      cogs;


    // ======================================
    // PROFIT MARGIN
    // ======================================

    const profitMargin =
      netRevenueBeforeTax > 0
        ? (
            grossProfit /
            netRevenueBeforeTax
          ) * 100
        : 0;


    // ======================================
    // PRODUCT PROFITABILITY
    // ======================================

    const productProfit =
      await Sale.aggregate([
        {
          $match: filter,
        },

        {
          $unwind:
            "$items",
        },

        {
          $group: {
            _id:
              "$items.productId",

            productName: {
              $first:
                "$items.productName",
            },

            sku: {
              $first:
                "$items.sku",
            },

            quantitySold: {
              $sum:
                "$items.quantity",
            },

            revenue: {
              $sum:
                "$items.subtotal",
            },

            cost: {
              $sum: {
                $multiply: [
                  {
                    $ifNull: [
                      "$items.unitCost",
                      0,
                    ],
                  },

                  "$items.quantity",
                ],
              },
            },
          },
        },

        {
          $addFields: {
            profit: {
              $subtract: [
                "$revenue",
                "$cost",
              ],
            },
          },
        },

        {
          $addFields: {
            margin: {
              $cond: [
                {
                  $gt: [
                    "$revenue",
                    0,
                  ],
                },

                {
                  $multiply: [
                    {
                      $divide: [
                        "$profit",
                        "$revenue",
                      ],
                    },

                    100,
                  ],
                },

                0,
              ],
            },
          },
        },

        {
          $sort: {
            profit: -1,
          },
        },

        {
          $limit: 20,
        },
      ]);


    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      period,

      dateRange: {
        start,
        end,
      },

      summary: {
        totalSales:
          Number(
            saleTotals.totalSales ||
              0
          ),

        productRevenue,

        discount,

        tax,

        cogs,

        grossProfit,

        profitMargin,

        transactions:
          Number(
            saleTotals.transactions ||
              0
          ),

        itemsSold:
          Number(
            profitData.itemsSold ||
              0
          ),
      },

      products:
        productProfit.map(
          (product) => ({
            productId:
              product._id,

            productName:
              product.productName,

            sku:
              product.sku,

            quantitySold:
              product.quantitySold,

            revenue:
              product.revenue,

            cost:
              product.cost,

            profit:
              product.profit,

            margin:
              product.margin,
          })
        ),
    });

  } catch (error) {
    console.error(
      "Profit Report Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};
// ==========================================
// PURCHASE REPORT
//
// GET /api/reports/purchases
// ==========================================

export const getPurchaseReport = async (
  req,
  res
) => {
  try {
    const {
      period = "month",
      startDate,
      endDate,
    } = req.query;


    // ======================================
    // VALIDATE PERIOD
    // ======================================

    const allowedPeriods = [
      "today",
      "week",
      "month",
      "year",
      "custom",
    ];

    if (
      !allowedPeriods.includes(period)
    ) {
      return res.status(400).json({
        message: "Invalid report period",
      });
    }


    // ======================================
    // DATE RANGE
    // ======================================

    let dateRange;

    try {
      dateRange = getDateRange(
        period,
        startDate,
        endDate
      );
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }


    const {
      start,
      end,
    } = dateRange;


    // ======================================
    // FILTER
    // ======================================

    const filter = {
      businessId:
        req.user.businessId,

      createdAt: {
        $gte: start,
        $lte: end,
      },
    };


    // ======================================
    // PURCHASE SUMMARY
    // ======================================

    const summaryResult =
      await Purchase.aggregate([
        {
          $match: filter,
        },

        {
          $group: {
            _id: null,

            totalPurchases: {
              $sum: "$total",
            },

            amountPaid: {
              $sum: "$amountPaid",
            },

            purchaseCount: {
              $sum: 1,
            },

            totalItemsPurchased: {
              $sum: {
                $sum: "$items.quantity",
              },
            },
          },
        },
      ]);


    const result =
      summaryResult[0] || {};


    const totalPurchases =
      Number(
        result.totalPurchases || 0
      );

    const amountPaid =
      Number(
        result.amountPaid || 0
      );

    const outstanding =
      Math.max(
        totalPurchases -
          amountPaid,
        0
      );


    // ======================================
    // PAYMENT STATUS BREAKDOWN
    // ======================================

    const paymentStatusBreakdown =
      await Purchase.aggregate([
        {
          $match: filter,
        },

        {
          $group: {
            _id:
              "$paymentStatus",

            purchases: {
              $sum: 1,
            },

            amount: {
              $sum: "$total",
            },

            amountPaid: {
              $sum: "$amountPaid",
            },
          },
        },

        {
          $sort: {
            amount: -1,
          },
        },
      ]);


    // ======================================
    // SUPPLIER SUMMARY
    // ======================================

    const supplierSummary =
      await Purchase.aggregate([
        {
          $match: filter,
        },

        {
          $group: {
            _id:
              "$supplierId",

            purchaseCount: {
              $sum: 1,
            },

            totalPurchases: {
              $sum: "$total",
            },

            amountPaid: {
              $sum: "$amountPaid",
            },
          },
        },

        {
          $addFields: {
            outstanding: {
              $subtract: [
                "$totalPurchases",
                "$amountPaid",
              ],
            },
          },
        },

        // Get supplier information
        {
          $lookup: {
            from: "suppliers",

            localField: "_id",

            foreignField: "_id",

            as: "supplier",
          },
        },

        {
          $unwind: {
            path: "$supplier",

            preserveNullAndEmptyArrays:
              true,
          },
        },

        {
          $project: {
            _id: 0,

            supplierId: "$_id",

            supplierName: {
              $ifNull: [
                "$supplier.name",
                "Unknown Supplier",
              ],
            },

            purchaseCount: 1,

            totalPurchases: 1,

            amountPaid: 1,

            outstanding: 1,
          },
        },

        {
          $sort: {
            totalPurchases: -1,
          },
        },
      ]);


    // ======================================
    // TOP PURCHASED PRODUCTS
    // ======================================

    const topProducts =
      await Purchase.aggregate([
        {
          $match: filter,
        },

        {
          $unwind: "$items",
        },

        {
          $group: {
            _id:
              "$items.productId",

            productName: {
              $first:
                "$items.productName",
            },

            quantityPurchased: {
              $sum:
                "$items.quantity",
            },

            purchaseValue: {
              $sum:
                "$items.subtotal",
            },
          },
        },

        {
          $sort: {
            quantityPurchased: -1,
          },
        },

        {
          $limit: 10,
        },
      ]);


    // ======================================
    // RECENT PURCHASES
    // ======================================

    const recentPurchases =
      await Purchase.find(filter)
        .populate(
          "supplierId",
          "name email phone"
        )
        .populate(
          "createdBy",
          "name email role"
        )
        .select(
          "purchaseNumber supplierId total amountPaid paymentStatus status createdAt createdBy"
        )
        .sort({
          createdAt: -1,
        })
        .limit(10);


    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      period,

      dateRange: {
        start,
        end,
      },


      // ====================================
      // SUMMARY
      // ====================================

      summary: {
        totalPurchases,

        amountPaid,

        outstanding,

        purchaseCount:
          Number(
            result.purchaseCount || 0
          ),

        totalItemsPurchased:
          Number(
            result.totalItemsPurchased ||
              0
          ),
      },


      // ====================================
      // PAYMENT STATUS
      // ====================================

      paymentStatusBreakdown:
        paymentStatusBreakdown.map(
          (item) => ({
            status:
              item._id || "unknown",

            purchases:
              item.purchases,

            amount:
              item.amount,

            amountPaid:
              item.amountPaid,

            outstanding:
              Math.max(
                Number(
                  item.amount || 0
                ) -
                  Number(
                    item.amountPaid || 0
                  ),
                0
              ),
          })
        ),


      // ====================================
      // SUPPLIERS
      // ====================================

      supplierSummary,


      // ====================================
      // PRODUCTS
      // ====================================

      topProducts:
        topProducts.map(
          (product) => ({
            productId:
              product._id,

            productName:
              product.productName,

            quantityPurchased:
              product.quantityPurchased,

            purchaseValue:
              product.purchaseValue,
          })
        ),


      // ====================================
      // RECENT
      // ====================================

      recentPurchases,
    });

  } catch (error) {
    console.error(
      "Purchase Report Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};
// ==========================================
// INVENTORY REPORT
// GET /api/reports/inventory
// ==========================================

export const getInventoryReport = async (
  req,
  res
) => {
  try {
    const products = await Product.find({
      businessId: req.user.businessId,
    })
      .populate("categoryId", "name")
      .select("-__v")
      .sort({
        name: 1,
      });

    let totalProducts = 0;
    let activeProducts = 0;
    let totalStockQuantity = 0;

    let stockCostValue = 0;
    let stockRetailValue = 0;

    let lowStockProducts = 0;
    let outOfStockProducts = 0;

    const inventory = products.map(
      (product) => {
        const stockQuantity = Number(
          product.stockQuantity || 0
        );

        const costPrice = Number(
          product.costPrice || 0
        );

        const sellingPrice = Number(
          product.sellingPrice || 0
        );

        const lowStockLevel = Number(
          product.lowStockLevel || 0
        );

        // ==================================
        // INVENTORY VALUES
        // ==================================

        const costValue =
          stockQuantity * costPrice;

        const retailValue =
          stockQuantity * sellingPrice;

        const potentialProfit =
          retailValue - costValue;

        // ==================================
        // STOCK STATUS
        // ==================================

        let stockStatus = "in_stock";

        if (stockQuantity <= 0) {
          stockStatus = "out_of_stock";
        } else if (
          stockQuantity <= lowStockLevel
        ) {
          stockStatus = "low_stock";
        }

        // ==================================
        // SUMMARY
        // ==================================

        totalProducts += 1;

        if (product.status) {
          activeProducts += 1;
        }

        totalStockQuantity +=
          stockQuantity;

        stockCostValue += costValue;

        stockRetailValue +=
          retailValue;

        if (
          stockStatus === "low_stock"
        ) {
          lowStockProducts += 1;
        }

        if (
          stockStatus ===
          "out_of_stock"
        ) {
          outOfStockProducts += 1;
        }

        // ==================================
        // RETURN PRODUCT
        // ==================================

        return {
          productId: product._id,

          name: product.name,

          sku:
            product.sku || "",

          barcode:
            product.barcode || "",

          category:
            product.categoryId?.name ||
            "-",

          unit:
            product.unit || "piece",

          stockQuantity,

          lowStockLevel,

          costPrice,

          sellingPrice,

          costValue,

          retailValue,

          potentialProfit,

          stockStatus,

          status: product.status,
        };
      }
    );

    // ======================================
    // POTENTIAL PROFIT
    // ======================================

    const potentialProfit =
      stockRetailValue -
      stockCostValue;

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      summary: {
        totalProducts,

        activeProducts,

        totalStockQuantity,

        stockCostValue,

        stockRetailValue,

        potentialProfit,

        lowStockProducts,

        outOfStockProducts,
      },

      inventory,
    });
  } catch (error) {
    console.error(
      "Inventory Report Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// LOW STOCK REPORT
// GET /api/reports/low-stock
// ==========================================

export const getLowStockReport = async (
  req,
  res
) => {
  try {
    // ======================================
    // GET ACTIVE PRODUCTS
    // ======================================

    const products =
      await Product.find({
        businessId:
          req.user.businessId,

        status: true,
      })
        .populate(
          "categoryId",
          "name"
        )
        .select("-__v")
        .sort({
          stockQuantity: 1,
        });

    // ======================================
    // FILTER LOW STOCK PRODUCTS
    // ======================================

    const lowStockItems = products
      .filter((product) => {
        const stock = Number(
          product.stockQuantity || 0
        );

        const lowLevel = Number(
          product.lowStockLevel || 0
        );

        return stock <= lowLevel;
      })

      .map((product) => {
        const stock = Number(
          product.stockQuantity || 0
        );

        const lowLevel = Number(
          product.lowStockLevel || 0
        );

        const costPrice = Number(
          product.costPrice || 0
        );

        const sellingPrice = Number(
          product.sellingPrice || 0
        );

        // ==================================
        // STOCK STATUS
        // ==================================

        const stockStatus =
          stock <= 0
            ? "out_of_stock"
            : "low_stock";

        // ==================================
        // REORDER CALCULATION
        // ==================================

        const targetStock = Math.max(
          lowLevel * 2,
          lowLevel
        );

        const suggestedReorder =
          Math.max(
            targetStock - stock,
            0
          );

        const estimatedReorderCost =
          suggestedReorder *
          costPrice;

        return {
          productId:
            product._id,

          name:
            product.name,

          sku:
            product.sku || "",

          barcode:
            product.barcode || "",

          category:
            product.categoryId?.name ||
            "-",

          unit:
            product.unit || "piece",

          stockQuantity:
            stock,

          lowStockLevel:
            lowLevel,

          costPrice,

          sellingPrice,

          stockStatus,

          suggestedReorder,

          estimatedReorderCost,
        };
      });

    // ======================================
    // SUMMARY
    // ======================================

    const lowStockProducts =
      lowStockItems.filter(
        (product) =>
          product.stockStatus ===
          "low_stock"
      ).length;

    const outOfStockProducts =
      lowStockItems.filter(
        (product) =>
          product.stockStatus ===
          "out_of_stock"
      ).length;

    const suggestedReorderUnits =
      lowStockItems.reduce(
        (total, product) =>
          total +
          Number(
            product.suggestedReorder ||
              0
          ),
        0
      );

    const estimatedReorderCost =
      lowStockItems.reduce(
        (total, product) =>
          total +
          Number(
            product
              .estimatedReorderCost ||
              0
          ),
        0
      );

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      summary: {
        productsNeedingAttention:
          lowStockItems.length,

        lowStockProducts,

        outOfStockProducts,

        suggestedReorderUnits,

        estimatedReorderCost,
      },

      products:
        lowStockItems,
    });
  } catch (error) {
    console.error(
      "Low Stock Report Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};
// ==========================================
// CUSTOMER REPORT
// GET /api/reports/customers
// ==========================================

export const getCustomerReport = async (
  req,
  res
) => {
  try {
    const {
      startDate,
      endDate,
    } = req.query;

    // ======================================
    // DATE FILTER
    // ======================================

    const dateFilter = {};

    if (startDate) {
      dateFilter.$gte =
        new Date(startDate);
    }

    if (endDate) {
      const end =
        new Date(endDate);

      end.setHours(
        23,
        59,
        59,
        999
      );

      dateFilter.$lte =
        end;
    }


    // ======================================
    // SALE FILTER
    // ======================================

    const saleFilter = {
      businessId:
        req.user.businessId,

      status:
        "completed",

      customerId: {
        $ne: null,
      },
    };

    if (
      startDate ||
      endDate
    ) {
      saleFilter.createdAt =
        dateFilter;
    }


    // ======================================
    // GET CUSTOMER SALES
    // ======================================

    const sales =
      await Sale.find(
        saleFilter
      )
        .populate(
          "customerId",
          "customerNumber name phone email status"
        )
        .select(
          "saleNumber customerId total createdAt"
        )
        .sort({
          createdAt: -1,
        });


    // ======================================
    // BUILD CUSTOMER MAP
    // ======================================

    const customerMap =
      new Map();

    let identifiedSales = 0;
    let identifiedRevenue = 0;


    for (const sale of sales) {

      if (!sale.customerId) {
        continue;
      }

      const customerId =
        sale.customerId._id
          .toString();

      identifiedSales += 1;

      identifiedRevenue +=
        Number(
          sale.total || 0
        );


      if (
        !customerMap.has(
          customerId
        )
      ) {
        customerMap.set(
          customerId,
          {
            customerId:
              sale.customerId._id,

            customerNumber:
              sale.customerId
                .customerNumber,

            name:
              sale.customerId
                .name,

            phone:
              sale.customerId
                .phone || "",

            email:
              sale.customerId
                .email || "",

            status:
              sale.customerId
                .status,

            orders:
              0,

            spent:
              0,

            lastPurchaseAt:
              null,
          }
        );
      }


      const customer =
        customerMap.get(
          customerId
        );


      customer.orders += 1;

      customer.spent +=
        Number(
          sale.total || 0
        );


      if (
        !customer.lastPurchaseAt ||
        new Date(
          sale.createdAt
        ) >
        new Date(
          customer.lastPurchaseAt
        )
      ) {
        customer.lastPurchaseAt =
          sale.createdAt;
      }
    }


    // ======================================
    // CUSTOMER ACTIVITY
    // ======================================

    const customerActivity =
      Array.from(
        customerMap.values()
      )
        .map((customer) => ({
          ...customer,

          averageOrderValue:
            customer.orders > 0
              ? customer.spent /
                customer.orders
              : 0,
        }))
        .sort(
          (a, b) =>
            b.spent -
            a.spent
        );


    // ======================================
    // ALL REGISTERED CUSTOMERS
    // ======================================

    const totalRegisteredCustomers =
      await Customer.countDocuments({
        businessId:
          req.user.businessId,
      });


    const activeRegisteredCustomers =
      await Customer.countDocuments({
        businessId:
          req.user.businessId,

        status: true,
      });


    // ======================================
    // CUSTOMERS CREATED IN PERIOD
    // ======================================

    const customerCreatedFilter = {
      businessId:
        req.user.businessId,
    };

    if (
      startDate ||
      endDate
    ) {
      customerCreatedFilter.createdAt =
        dateFilter;
    }


    const newCustomers =
      await Customer.countDocuments(
        customerCreatedFilter
      );


    // ======================================
    // REPEAT CUSTOMERS
    //
    // Repeat means 2+ purchases
    // during selected period.
    // ======================================

    const repeatCustomers =
      customerActivity.filter(
        (customer) =>
          customer.orders >= 2
      ).length;


    // ======================================
    // AVERAGE CUSTOMER SPEND
    // ======================================

    const averageCustomerSpend =
      customerActivity.length > 0
        ? identifiedRevenue /
          customerActivity.length
        : 0;


    // ======================================
    // TOP CUSTOMERS
    // ======================================

    const topCustomers =
      customerActivity
        .slice(0, 10);


    // ======================================
    // RECENT IDENTIFIED SALES
    // ======================================

    const recentSales =
      sales
        .slice(0, 10)
        .map((sale) => ({
          _id:
            sale._id,

          saleNumber:
            sale.saleNumber,

          customer:
            sale.customerId
              ? {
                  _id:
                    sale.customerId._id,

                  customerNumber:
                    sale.customerId
                      .customerNumber,

                  name:
                    sale.customerId
                      .name,
                }
              : null,

          total:
            sale.total,

          createdAt:
            sale.createdAt,
        }));


    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({

      summary: {
        totalRegisteredCustomers,

        activeRegisteredCustomers,

        customersWhoPurchased:
          customerActivity.length,

        newCustomers,

        repeatCustomers,

        identifiedSales,

        identifiedRevenue,

        averageCustomerSpend,
      },

      topCustomers,

      customerActivity,

      recentSales,
    });

  } catch (error) {

    console.error(
      "Customer Report Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};
// ==========================================
// PRODUCT PERFORMANCE REPORT
// GET /api/reports/products
// ==========================================

export const getProductReport = async (
  req,
  res
) => {
  try {
    const {
      startDate,
      endDate,
    } = req.query;

    // ======================================
    // DATE FILTER
    // ======================================

    const dateFilter = {};

    if (startDate) {
      dateFilter.$gte =
        new Date(startDate);
    }

    if (endDate) {
      const end =
        new Date(endDate);

      end.setHours(
        23,
        59,
        59,
        999
      );

      dateFilter.$lte = end;
    }


    // ======================================
    // SALE FILTER
    // ======================================

    const saleFilter = {
      businessId:
        req.user.businessId,

      status: "completed",
    };

    if (
      startDate ||
      endDate
    ) {
      saleFilter.createdAt =
        dateFilter;
    }


    // ======================================
    // GET SALES
    // ======================================

    const sales =
      await Sale.find(
        saleFilter
      ).select(
        "items total createdAt"
      );


    // ======================================
    // GET PRODUCTS
    // ======================================

    const products =
      await Product.find({
        businessId:
          req.user.businessId,
      })
        .populate(
          "categoryId",
          "name"
        )
        .select(
          "name sku barcode categoryId costPrice sellingPrice stockQuantity status"
        );


    // ======================================
    // PRODUCT LOOKUP
    // ======================================

    const productLookup =
      new Map();

    products.forEach(
      (product) => {

        productLookup.set(
          product._id.toString(),
          product
        );

      }
    );


    // ======================================
    // PERFORMANCE MAP
    // ======================================

    const performanceMap =
      new Map();

    let totalUnitsSold = 0;

    let totalRevenue = 0;

    let estimatedCost = 0;


    // ======================================
    // PROCESS SALES
    // ======================================

    for (const sale of sales) {

      for (
        const item of
        sale.items || []
      ) {

        if (!item.productId) {
          continue;
        }

        const productId =
          item.productId.toString();

        const quantity =
          Number(
            item.quantity || 0
          );

        const revenue =
          Number(
            item.subtotal || 0
          );

        const product =
          productLookup.get(
            productId
          );


        // Current cost price is used
        // because Sale currently stores
        // selling-price snapshots but not
        // cost-price snapshots.
        const costPrice =
          Number(
            product?.costPrice || 0
          );

        const cost =
          costPrice *
          quantity;


        if (
          !performanceMap.has(
            productId
          )
        ) {

          performanceMap.set(
            productId,
            {
              productId,

              name:
                item.productName ||
                product?.name ||
                "Unknown Product",

              sku:
                item.sku ||
                product?.sku ||
                "",

              category:
                product?.categoryId
                  ?.name || "-",

              quantitySold: 0,

              revenue: 0,

              estimatedCost: 0,

              estimatedProfit: 0,

              orders: 0,

              stockQuantity:
                Number(
                  product
                    ?.stockQuantity ||
                    0
                ),
            }
          );

        }


        const performance =
          performanceMap.get(
            productId
          );


        performance.quantitySold +=
          quantity;

        performance.revenue +=
          revenue;

        performance.estimatedCost +=
          cost;

        performance.orders += 1;


        totalUnitsSold +=
          quantity;

        totalRevenue +=
          revenue;

        estimatedCost +=
          cost;
      }
    }


    // ======================================
    // CALCULATE PROFIT
    // ======================================

    const productPerformance =
      Array.from(
        performanceMap.values()
      )
        .map((product) => ({

          ...product,

          estimatedProfit:
            product.revenue -
            product.estimatedCost,

          averageSellingPrice:
            product.quantitySold > 0
              ? product.revenue /
                product.quantitySold
              : 0,

        }))
        .sort(
          (a, b) =>
            b.revenue -
            a.revenue
        );


    // ======================================
    // PRODUCTS WITH NO SALES
    // ======================================

    const productsWithNoSales =
      products
        .filter(
          (product) =>
            !performanceMap.has(
              product._id.toString()
            )
        )
        .map((product) => ({

          productId:
            product._id,

          name:
            product.name,

          sku:
            product.sku || "",

          category:
            product.categoryId
              ?.name || "-",

          sellingPrice:
            Number(
              product.sellingPrice ||
                0
            ),

          stockQuantity:
            Number(
              product.stockQuantity ||
                0
            ),

          status:
            product.status,

        }));


    // ======================================
    // SUMMARY
    // ======================================

    const estimatedProfit =
      totalRevenue -
      estimatedCost;


    const averageRevenuePerUnit =
      totalUnitsSold > 0
        ? totalRevenue /
          totalUnitsSold
        : 0;


    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({

      summary: {

        productsSold:
          productPerformance.length,

        totalUnitsSold,

        totalRevenue,

        estimatedCost,

        estimatedProfit,

        averageRevenuePerUnit,

        productsWithNoSales:
          productsWithNoSales.length,

      },

      topProducts:
        productPerformance.slice(
          0,
          10
        ),

      productPerformance,

      productsWithNoSales,

    });

  } catch (error) {

    console.error(
      "Product Report Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};
// ==========================================
// CASHIER PERFORMANCE REPORT
// GET /api/reports/cashiers
// ==========================================

export const getCashierReport = async (
  req,
  res
) => {
  try {
    const {
      startDate,
      endDate,
    } = req.query;


    // ======================================
    // DATE FILTER
    // ======================================

    const dateFilter = {};

    if (startDate) {
      dateFilter.$gte =
        new Date(startDate);
    }

    if (endDate) {
      const end =
        new Date(endDate);

      end.setHours(
        23,
        59,
        59,
        999
      );

      dateFilter.$lte = end;
    }


    // ======================================
    // SALE FILTER
    //
    // Only POS sales have a cashier.
    // ======================================

    const saleFilter = {
      businessId:
        req.user.businessId,

      status:
        "completed",

      source:
        "pos",

      cashierId: {
        $ne: null,
      },
    };


    if (
      startDate ||
      endDate
    ) {
      saleFilter.createdAt =
        dateFilter;
    }


    // ======================================
    // GET SALES
    // ======================================

    const sales =
      await Sale.find(
        saleFilter
      )
        .populate(
          "cashierId",
          "name email role"
        )
        .select(
          "saleNumber cashierId items subtotal discount tax total paymentMethod createdAt"
        )
        .sort({
          createdAt: -1,
        });


    // ======================================
    // CASHIER MAP
    // ======================================

    const cashierMap =
      new Map();


    let totalSales = 0;

    let totalRevenue = 0;

    let totalItemsSold = 0;


    // ======================================
    // PROCESS SALES
    // ======================================

    for (const sale of sales) {

      if (!sale.cashierId) {
        continue;
      }


      const cashierId =
        sale.cashierId._id
          .toString();


      // ====================================
      // ITEMS IN SALE
      // ====================================

      const itemsSold =
        (sale.items || [])
          .reduce(
            (total, item) =>
              total +
              Number(
                item.quantity || 0
              ),
            0
          );


      // ====================================
      // CREATE CASHIER ENTRY
      // ====================================

      if (
        !cashierMap.has(
          cashierId
        )
      ) {
        cashierMap.set(
          cashierId,
          {
            cashierId:
              sale.cashierId._id,

            name:
              sale.cashierId.name,

            email:
              sale.cashierId.email || "",

            role:
              sale.cashierId.role || "",

            salesCount: 0,

            revenue: 0,

            itemsSold: 0,

            cashSales: 0,

            cardSales: 0,

            onlineSales: 0,

            otherSales: 0,

            lastSaleAt: null,
          }
        );
      }


      const cashier =
        cashierMap.get(
          cashierId
        );


      // ====================================
      // UPDATE CASHIER
      // ====================================

      cashier.salesCount += 1;

      cashier.revenue +=
        Number(
          sale.total || 0
        );

      cashier.itemsSold +=
        itemsSold;


      // ====================================
      // PAYMENT METHOD COUNTS
      // ====================================

      if (
        sale.paymentMethod ===
        "cash"
      ) {
        cashier.cashSales += 1;
      }

      else if (
        sale.paymentMethod ===
        "card"
      ) {
        cashier.cardSales += 1;
      }

      else if (
        sale.paymentMethod ===
        "online"
      ) {
        cashier.onlineSales += 1;
      }

      else {
        cashier.otherSales += 1;
      }


      // ====================================
      // LAST SALE
      // ====================================

      if (
        !cashier.lastSaleAt ||
        new Date(
          sale.createdAt
        ) >
        new Date(
          cashier.lastSaleAt
        )
      ) {
        cashier.lastSaleAt =
          sale.createdAt;
      }


      // ====================================
      // OVERALL TOTALS
      // ====================================

      totalSales += 1;

      totalRevenue +=
        Number(
          sale.total || 0
        );

      totalItemsSold +=
        itemsSold;
    }


    // ======================================
    // CASHIER PERFORMANCE
    // ======================================

    const cashierPerformance =
      Array.from(
        cashierMap.values()
      )
        .map((cashier) => ({

          ...cashier,

          averageSaleValue:
            cashier.salesCount > 0
              ? cashier.revenue /
                cashier.salesCount
              : 0,

          averageItemsPerSale:
            cashier.salesCount > 0
              ? cashier.itemsSold /
                cashier.salesCount
              : 0,

        }))
        .sort(
          (a, b) =>
            b.revenue -
            a.revenue
        );


    // ======================================
    // TOP CASHIER
    // ======================================

    const topCashier =
      cashierPerformance.length > 0
        ? cashierPerformance[0]
        : null;


    // ======================================
    // OVERALL AVERAGES
    // ======================================

    const averageSaleValue =
      totalSales > 0
        ? totalRevenue /
          totalSales
        : 0;


    const averageItemsPerSale =
      totalSales > 0
        ? totalItemsSold /
          totalSales
        : 0;


    // ======================================
    // RECENT SALES
    // ======================================

    const recentSales =
      sales
        .slice(0, 10)
        .map((sale) => ({

          _id:
            sale._id,

          saleNumber:
            sale.saleNumber,

          cashier:
            sale.cashierId
              ? {
                  _id:
                    sale.cashierId._id,

                  name:
                    sale.cashierId.name,

                  role:
                    sale.cashierId.role,
                }
              : null,

          total:
            sale.total,

          paymentMethod:
            sale.paymentMethod,

          createdAt:
            sale.createdAt,

        }));


    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({

      summary: {

        activeCashiers:
          cashierPerformance.length,

        totalSales,

        totalRevenue,

        totalItemsSold,

        averageSaleValue,

        averageItemsPerSale,

      },

      topCashier,

      cashierPerformance,

      recentSales,

    });

  } catch (error) {

    console.error(
      "Cashier Report Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};