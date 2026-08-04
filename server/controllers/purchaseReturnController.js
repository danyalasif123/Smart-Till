import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import PurchaseReturn from "../models/PurchaseReturn.js";

// ==========================================
// CREATE PURCHASE RETURN
// ==========================================

export const createPurchaseReturn = async (
  req,
  res
) => {
  try {
    const businessId =
      req.user.businessId;

    const returnedBy =
      req.user.id;

    const {
      purchaseId,
      items,
      reason,
      notes,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (
      !purchaseId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message:
          "Return items are required.",
      });
    }

    // ======================================
    // FIND PURCHASE
    // ======================================

    const purchase =
      await Purchase.findOne({
        _id: purchaseId,
        businessId,
      });

    if (!purchase) {
      return res.status(404).json({
        message:
          "Purchase not found.",
      });
    }

    if (
      purchase.status ===
      "pending"
    ) {
      return res.status(400).json({
        message:
          "Pending purchases cannot be returned.",
      });
    }

    if (
      purchase.status ===
      "cancelled"
    ) {
      return res.status(400).json({
        message:
          "Cancelled purchases cannot be returned.",
      });
    }

    let totalRefund = 0;

    const returnedItems = [];

    // ======================================
    // PROCESS ITEMS
    // ======================================

    for (const item of items) {
      const purchaseItem =
        purchase.items.find(
          (i) =>
            i.productId.toString() ===
            item.productId
        );

      if (!purchaseItem) {
        return res.status(400).json({
          message:
            "Invalid product selected.",
        });
      }

      const quantityReturned =
        Number(
          item.quantityReturned
        );

      if (
        Number.isNaN(
          quantityReturned
        ) ||
        quantityReturned <= 0
      ) {
        return res.status(400).json({
          message: `Invalid quantity for ${purchaseItem.productName}.`,
        });
      }

      const remaining =
        purchaseItem.quantity -
        purchaseItem.returnedQuantity;

      if (
        quantityReturned >
        remaining
      ) {
        return res.status(400).json({
          message: `${purchaseItem.productName} can only return ${remaining}.`,
        });
      }

      // ====================================
      // UPDATE PURCHASE ITEM
      // ====================================

      purchaseItem.returnedQuantity +=
        quantityReturned;

      // ====================================
      // REMOVE STOCK
      // ====================================

      await Product.findByIdAndUpdate(
        purchaseItem.productId,
        {
          $inc: {
            stockQuantity:
              -quantityReturned,
          },
        }
      );

      // ====================================
      // REFUND
      // ====================================

      const refundAmount =
        quantityReturned *
        purchaseItem.unitCost;

      totalRefund +=
        refundAmount;

      returnedItems.push({
        productId:
          purchaseItem.productId,

        productName:
          purchaseItem.productName,

        sku:
          purchaseItem.sku,

        quantityPurchased:
          purchaseItem.quantity,

        quantityReturned,

        unitCost:
          purchaseItem.unitCost,

        refundAmount,
      });
    }

    // ======================================
    // PURCHASE STATUS
    // ======================================

    const fullyReturned =
      purchase.items.every(
        (item) =>
          item.quantity ===
          item.returnedQuantity
      );

    purchase.status =
      fullyReturned
        ? "returned"
        : "partially_returned";

    await purchase.save();

    // ======================================
    // RETURN NUMBER
    // ======================================

    const count =
      await PurchaseReturn.countDocuments(
        {
          businessId,
        }
      );

    const returnNumber = `PRET-${String(
      count + 1
    ).padStart(6, "0")}`;

    // ======================================
    // SAVE RETURN
    // ======================================

    const purchaseReturn =
      await PurchaseReturn.create({
        businessId,

        purchaseId:
          purchase._id,

        returnNumber,

        supplierId:
          purchase.supplierId,

        items:
          returnedItems,

        totalRefund,

        reason,

        notes,

        returnedBy,
      });

    // ======================================

    res.status(201).json({
      message:
        "Purchase returned successfully.",
      purchaseReturn,
    });
  } catch (error) {
    console.error(
      "Purchase Return Error:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Failed to return purchase.",
    });
  }
};

// ==========================================
// GET PURCHASE RETURNS
// ==========================================

export const getPurchaseReturns =
  async (req, res) => {
    try {
      const purchaseReturns =
        await PurchaseReturn.find({
          businessId:
            req.user.businessId,
        })
          .populate(
            "supplierId",
            "name supplierNumber"
          )
          .populate(
            "purchaseId",
            "purchaseNumber"
          )
          .populate(
            "returnedBy",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        purchaseReturns
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

// ==========================================
// GET SINGLE PURCHASE RETURN
// ==========================================

export const getPurchaseReturnById =
  async (req, res) => {
    try {
      const purchaseReturn =
        await PurchaseReturn.findOne({
          _id: req.params.id,
          businessId:
            req.user.businessId,
        })
          .populate("supplierId")
          .populate(
            "purchaseId"
          )
          .populate(
            "returnedBy",
            "name email"
          );

      if (!purchaseReturn) {
        return res.status(404).json({
          message:
            "Purchase return not found.",
        });
      }

      res.status(200).json(
        purchaseReturn
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };