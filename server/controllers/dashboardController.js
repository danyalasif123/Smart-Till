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
// TOP SELLING PRODUCTS
// ======================================

const productMap = {};

for (const sale of todaySales) {

  for (const item of sale.items) {

    if (!productMap[item.productId]) {

      productMap[item.productId] = {

        productId: item.productId,

        name: item.productName,

        quantity: 0,

        revenue: 0,

      };

    }

    productMap[item.productId].quantity +=
      Number(item.quantity);

    productMap[item.productId].revenue +=
      Number(item.subtotal);

  }

}

const topProducts = Object.values(productMap)

.sort((a, b) => b.quantity - a.quantity)

.slice(0, 5);

// ======================================
// RECENT SALES
// ======================================

const recentSales = await Sale.find({
  businessId,
  status: "completed",
})
.populate(
  "customerId",
  "name"
)
.sort({
  createdAt: -1,
})
.limit(2)
.select(
  "saleNumber total paymentMethod createdAt customerId"
);
// ======================================
// LOW STOCK PRODUCTS
// ======================================

const lowStockItems = await Product.find({
  businessId,
  status: true,
  $expr: {
    $lte: [
      "$stockQuantity",
      "$lowStockLevel",
    ],
  },
})
.populate(
  "categoryId",
  "name"
)
.select(
  "name sku stockQuantity lowStockLevel categoryId"
)
.sort({
  stockQuantity: 1,
})
.limit(2);
// ======================================
// RECENT PURCHASES
// ======================================

const recentPurchases = await Purchase.find({
  businessId,
})
.populate(
  "supplierId",
  "name"
)
.sort({
  createdAt: -1,
})
.limit(2)
.select(
  "purchaseNumber total paymentStatus createdAt supplierId"
);
// ======================================
// PAYMENT METHOD BREAKDOWN
// ======================================

const paymentBreakdown = await Sale.aggregate([
  {
    $match: {
      businessId,
      status: "completed",
    },
  },
  {
    $group: {
      _id: "$paymentMethod",
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
    // RESPONSE
    // ======================================

  res.status(200).json({

  summary:{

    todaySales:totalSales,

    todayProfit:0,

    todayPurchases:totalPurchases,

    todayTransactions:todaySales.length,

    lowStockProducts,

  },

  weeklySales,

  topProducts,
 recentSales,
 lowStockItems,
   recentPurchases,
   paymentBreakdown,
});

  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};