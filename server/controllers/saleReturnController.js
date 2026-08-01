import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import SaleReturn from "../models/SaleReturn.js";

// ==========================================
// CREATE SALE RETURN
// ==========================================

export const createSaleReturn = async (
  req,
  res
) => {
  try {
    const businessId =
      req.user.businessId;

    const returnedBy =
      req.user.id;

    const {
      saleId,
      items,
      reason,
      notes,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (
      !saleId ||
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
    // FIND SALE
    // ======================================

    const sale =
      await Sale.findOne({
        _id: saleId,
        businessId,
      });

    if (!sale) {
      return res.status(404).json({
        message:
          "Sale not found.",
      });
    }

    if (
      sale.status ===
      "cancelled"
    ) {
      return res.status(400).json({
        message:
          "Cancelled sales cannot be returned.",
      });
    }

    let totalRefund = 0;

    const returnedItems = [];

    // ======================================
    // PROCESS EACH RETURN ITEM
    // ======================================

    for (const item of items) {
      const saleItem =
        sale.items.find(
          (i) =>
            i.productId.toString() ===
            item.productId
        );

      if (!saleItem) {
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
          message:
            `Invalid return quantity for ${saleItem.productName}.`,
        });
      }

     const alreadyReturned =
  saleItem.returnedQuantity || 0;

const remainingQuantity =
  saleItem.quantity -
  alreadyReturned;

      if (
        quantityReturned >
        remainingQuantity
      ) {
        return res.status(400).json({
          message: `${saleItem.productName} can only return ${remainingQuantity}.`,
        });
      }

      // ====================================
      // UPDATE SALE ITEM
      // ====================================

    saleItem.returnedQuantity =
  alreadyReturned +
  quantityReturned;
      // ====================================
      // UPDATE PRODUCT STOCK
      // ====================================

      await Product.findByIdAndUpdate(
        saleItem.productId,
        {
          $inc: {
            stockQuantity:
              quantityReturned,
          },
        }
      );

      // ====================================
      // CALCULATE REFUND
      // ====================================

      const refundAmount =
        saleItem.unitPrice *
        quantityReturned;

      totalRefund +=
        refundAmount;

      returnedItems.push({
        productId:
          saleItem.productId,

        productName:
          saleItem.productName,

        sku: saleItem.sku,

        quantitySold:
          saleItem.quantity,

        quantityReturned,

        unitPrice:
          saleItem.unitPrice,

        refundAmount,
      });
    }

    // ======================================
    // UPDATE SALE STATUS
    // ======================================

const fullyReturned =
  sale.items.every(
    (item) =>
      item.quantity ===
      (item.returnedQuantity || 0)
  );

    sale.status =
      fullyReturned
        ? "returned"
        : "partially_returned";

    if (fullyReturned) {
      sale.paymentStatus =
        "refunded";
    }

    await sale.save();

    // ======================================
    // GENERATE RETURN NUMBER
    // ======================================

    const count =
      await SaleReturn.countDocuments({
        businessId,
      });

    const returnNumber = `RET-${String(
      count + 1
    ).padStart(6, "0")}`;

    // ======================================
    // CREATE RETURN RECORD
    // ======================================

    const saleReturn =
      await SaleReturn.create({
        businessId,

        saleId:
          sale._id,

        returnNumber,

        customerId:
          sale.customerId,

        items:
          returnedItems,

        totalRefund,

        reason,

        notes,

        returnedBy,
      });

    // ======================================
    // RESPONSE
    // ======================================

    res.status(201).json({
      message:
        "Sale returned successfully.",
      saleReturn,
    });
  } catch (error) {
    console.error(
      "Sale Return Error:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Failed to return sale.",
    });
  }
};
// ==========================================
// GET ALL SALE RETURNS
// ==========================================

export const getSaleReturns = async (
  req,
  res
) => {

  try {

    const saleReturns =
      await SaleReturn.find({

        businessId:
          req.user.businessId,

      })

      .populate(
        "customerId",
        "name customerNumber"
      )

      .populate(
        "returnedBy",
        "name"
      )

      .populate(
        "saleId",
        "saleNumber"
      )

      .sort({
        createdAt: -1,
      });

    res.status(200).json(
      saleReturns
    );

  } catch (error) {

    console.error(
      error
    );

    res.status(500).json({

      message:
        error.message,

    });

  }

};
// ==========================================
// GET SINGLE SALE RETURN
// ==========================================

export const getSaleReturnById = async (
  req,
  res
) => {

  try {

    const saleReturn =
      await SaleReturn.findOne({

        _id:
          req.params.id,

        businessId:
          req.user.businessId,

      })

      .populate(
        "customerId"
      )

      .populate(
        "returnedBy",
        "name email"
      )

      .populate(
        "saleId"
      );

    if (!saleReturn) {

      return res.status(404).json({

        message:
          "Sale return not found.",

      });

    }

    res.status(200).json(
      saleReturn
    );

  } catch (error) {

    console.error(
      error
    );

    res.status(500).json({

      message:
        error.message,

    });

  }

};