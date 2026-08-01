import Sale from "../models/Sale.js";
import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";

export const getDashboard = async (req, res) => {
  try {
    const businessId = req.user.businessId;

    // ======================================
    // TODAY RANGE
    // ======================================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // ======================================
    // TODAY SALES
    // ======================================

    const todaySales = await Sale.find({
      businessId,
      status: "completed",
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // ======================================
    // TODAY PURCHASES
    // ======================================

    const todayPurchases = await Purchase.find({
      businessId,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // ======================================
    // TOTALS
    // ======================================

    const totalSales = todaySales.reduce(
      (sum, sale) => sum + Number(sale.total || 0),
      0
    );

    const totalPurchases = todayPurchases.reduce(
      (sum, purchase) => sum + Number(purchase.total || 0),
      0
    );

    // ======================================
    // WEEKLY SALES
    // ======================================

    const weeklySales = [];

    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - i);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const sales = await Sale.find({
        businessId,
        status: "completed",
        createdAt: {
          $gte: start,
          $lt: end,
        },
      });

      weeklySales.push({
        day: start.toLocaleDateString("en-GB", {
          weekday: "short",
        }),
        sales: sales.reduce(
          (sum, sale) => sum + Number(sale.total || 0),
          0
        ),
        transactions: sales.length,
      });
    }

    // ======================================
    // LOW STOCK
    // ======================================

    const lowStockProducts = await Product.countDocuments({
      businessId,
      $expr: {
        $lte: ["$stockQuantity", "$lowStockLevel"],
      },
    });

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      summary: {
        todaySales: totalSales,
        todayProfit: 0,
        todayPurchases: totalPurchases,
        todayTransactions: todaySales.length,
        lowStockProducts,
      },

      weeklySales,
    });

  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};