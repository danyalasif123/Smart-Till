import { useEffect, useState } from "react";

import "./PurchaseModal.css";

import { createPurchase } from "../../services/purchaseService";
import { getProducts } from "../../services/productService";
import { getSuppliers } from "../../services/supplierService";


const PurchaseModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // ==========================================
  // STATE
  // ==========================================

  const [suppliers, setSuppliers] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [supplierId, setSupplierId] =
    useState("");

  const [
    supplierReference,
    setSupplierReference,
  ] = useState("");

  const [discount, setDiscount] =
    useState("");

  const [tax, setTax] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [dataLoading, setDataLoading] =
    useState(false);


  // ==========================================
  // LOAD SUPPLIERS + PRODUCTS
  // ==========================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadData = async () => {
      try {
        setDataLoading(true);

        const [
          supplierResponse,
          productResponse,
        ] = await Promise.all([
          getSuppliers(),
          getProducts(),
        ]);

        setSuppliers(
          (
            supplierResponse.suppliers ||
            []
          ).filter(
            (supplier) =>
              supplier.status
          )
        );

        setProducts(
          (
            productResponse.products ||
            []
          ).filter(
            (product) =>
              product.status
          )
        );

      } catch (error) {
        console.error(
          "Purchase Modal Data Error:",
          error
        );

        alert(
          error.response?.data?.message ||
            "Failed to load suppliers or products."
        );

      } finally {
        setDataLoading(false);
      }
    };

    loadData();

  }, [isOpen]);


  // ==========================================
  // RESET MODAL
  // ==========================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSupplierId("");

    setSupplierReference("");

    setDiscount("");

    setTax("");

    setNotes("");

    setItems([]);

  }, [isOpen]);


  // ==========================================
  // ADD PRODUCT
  // ==========================================

  const handleAddProduct = () => {
    setItems((current) => [
      ...current,
      {
        rowId:
          `${Date.now()}-${Math.random()}`,

        productId: "",

        quantity: 1,

        unitCost: "",
      },
    ]);
  };


  // ==========================================
  // REMOVE PRODUCT
  // ==========================================

  const handleRemoveProduct = (
    rowId
  ) => {
    setItems((current) =>
      current.filter(
        (item) =>
          item.rowId !== rowId
      )
    );
  };


  // ==========================================
  // CHANGE ITEM
  // ==========================================

  const handleItemChange = (
    rowId,
    field,
    value
  ) => {
    setItems((current) =>
      current.map((item) => {

        if (
          item.rowId !== rowId
        ) {
          return item;
        }

        // When selecting product,
        // automatically use its
        // current cost price.
        if (
          field === "productId"
        ) {
          const product =
            products.find(
              (product) =>
                product._id === value
            );

          return {
            ...item,

            productId: value,

            unitCost:
              product?.costPrice ??
              "",
          };
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );
  };


  // ==========================================
  // CALCULATE SUBTOTAL
  // ==========================================

  const subtotal =
    items.reduce(
      (total, item) => {

        const quantity =
          Number(
            item.quantity || 0
          );

        const unitCost =
          Number(
            item.unitCost || 0
          );

        return (
          total +
          quantity * unitCost
        );
      },
      0
    );


  // ==========================================
  // FINAL TOTAL
  // ==========================================

  const discountValue =
    Number(discount || 0);

  const taxValue =
    Number(tax || 0);

  const total =
    subtotal -
    discountValue +
    taxValue;


  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatCurrency = (
    amount
  ) => {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(
      Number(amount || 0)
    );
  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();


    // ======================================
    // SUPPLIER
    // ======================================

    if (!supplierId) {
      alert(
        "Please select a supplier."
      );

      return;
    }


    // ======================================
    // ITEMS
    // ======================================

    if (items.length === 0) {
      alert(
        "Add at least one product."
      );

      return;
    }


    // ======================================
    // VALIDATE EACH ITEM
    // ======================================

    for (const item of items) {

      if (!item.productId) {
        alert(
          "Please select a product for every row."
        );

        return;
      }

      const quantity =
        Number(item.quantity);

      if (
        Number.isNaN(quantity) ||
        quantity <= 0
      ) {
        alert(
          "Product quantity must be greater than 0."
        );

        return;
      }

      const unitCost =
        Number(item.unitCost);

      if (
        Number.isNaN(unitCost) ||
        unitCost < 0
      ) {
        alert(
          "Unit cost must be 0 or greater."
        );

        return;
      }
    }


    // ======================================
    // DUPLICATE PRODUCTS
    // ======================================

    const productIds =
      items.map(
        (item) =>
          item.productId
      );

    if (
      new Set(productIds).size !==
      productIds.length
    ) {
      alert(
        "The same product cannot be added more than once."
      );

      return;
    }


    // ======================================
    // DISCOUNT / TAX
    // ======================================

    if (
      discountValue < 0 ||
      Number.isNaN(
        discountValue
      )
    ) {
      alert(
        "Invalid discount."
      );

      return;
    }

    if (
      taxValue < 0 ||
      Number.isNaN(taxValue)
    ) {
      alert(
        "Invalid tax."
      );

      return;
    }

    if (total < 0) {
      alert(
        "Discount cannot exceed the purchase amount."
      );

      return;
    }


    // ======================================
    // DATA FOR BACKEND
    // ======================================

    const purchaseData = {
      supplierId,

      items:
        items.map(
          (item) => ({
            productId:
              item.productId,

            quantity:
              Number(
                item.quantity
              ),

            unitCost:
              Number(
                item.unitCost
              ),
          })
        ),

      discount:
        discountValue,

      tax:
        taxValue,

      supplierReference:
        supplierReference.trim(),

      notes:
        notes.trim(),
    };


    // ======================================
    // CREATE
    // ======================================

    try {
      setLoading(true);

      const response =
        await createPurchase(
          purchaseData
        );

      alert(
        `${response.message}\n\nPurchase: ${response.purchase.purchaseNumber}`
      );

      await onSuccess?.();

      onClose();

    } catch (error) {
      console.error(
        "Create Purchase Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to create purchase."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // CLOSED
  // ==========================================

  if (!isOpen) {
    return null;
  }


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="purchase-modal-overlay">

      <div className="purchase-modal">

        {/* HEADER */}

        <div className="purchase-modal-header">

          <div>
            <h2>
              New Purchase
            </h2>

            <p>
              Create a supplier purchase
              order.
            </p>
          </div>

          <button
            type="button"
            className="purchase-modal-close"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>

        </div>


        {dataLoading ? (

          <div className="purchase-modal-loading">
            Loading suppliers and
            products...
          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
          >

            <div className="purchase-modal-body">

              {/* =============================
                  SUPPLIER
              ============================= */}

              <div className="purchase-form-section">

                <h3>
                  Supplier Information
                </h3>

                <div className="purchase-form-grid">

                  <div className="purchase-form-group">

                    <label>
                      Supplier *
                    </label>

                    <select
                      value={
                        supplierId
                      }
                      onChange={(e) =>
                        setSupplierId(
                          e.target.value
                        )
                      }
                      required
                    >

                      <option value="">
                        Select supplier
                      </option>

                      {suppliers.map(
                        (supplier) => (
                          <option
                            key={
                              supplier._id
                            }
                            value={
                              supplier._id
                            }
                          >
                            {
                              supplier.name
                            }
                          </option>
                        )
                      )}

                    </select>

                  </div>


                  <div className="purchase-form-group">

                    <label>
                      Supplier Invoice /
                      Reference
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. INV-1001"
                      value={
                        supplierReference
                      }
                      onChange={(e) =>
                        setSupplierReference(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

              </div>


              {/* =============================
                  PRODUCTS
              ============================= */}

              <div className="purchase-form-section">

                <div className="purchase-products-heading">

                  <div>
                    <h3>
                      Products
                    </h3>

                    <p>
                      Add products being
                      ordered from the
                      supplier.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="purchase-add-product-btn"
                    onClick={
                      handleAddProduct
                    }
                  >
                    + Add Product
                  </button>

                </div>


                {/* PRODUCT TABLE */}

                {items.length === 0 ? (

                  <div className="purchase-empty-products">

                    No products added.

                    <button
                      type="button"
                      onClick={
                        handleAddProduct
                      }
                    >
                      Add your first product
                    </button>

                  </div>

                ) : (

                  <div className="purchase-item-table">

                    <div className="purchase-item-header">

                      <div>
                        Product
                      </div>

                      <div>
                        Quantity
                      </div>

                      <div>
                        Unit Cost
                      </div>

                      <div>
                        Total
                      </div>

                      <div />

                    </div>


                    {items.map(
                      (item) => {

                        const rowTotal =
                          Number(
                            item.quantity ||
                              0
                          ) *
                          Number(
                            item.unitCost ||
                              0
                          );

                        return (
                          <div
                            className="purchase-item-row"
                            key={
                              item.rowId
                            }
                          >

                            {/* PRODUCT */}

                            <div>

                              <select
                                value={
                                  item.productId
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleItemChange(
                                    item.rowId,
                                    "productId",
                                    e.target
                                      .value
                                  )
                                }
                                required
                              >

                                <option value="">
                                  Select product
                                </option>

                                {products.map(
                                  (
                                    product
                                  ) => (
                                    <option
                                      key={
                                        product._id
                                      }
                                      value={
                                        product._id
                                      }
                                    >
                                      {
                                        product.name
                                      }
                                      {product.sku
                                        ? ` (${product.sku})`
                                        : ""}
                                    </option>
                                  )
                                )}

                              </select>

                            </div>


                            {/* QUANTITY */}

                            <div>

                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={
                                  item.quantity
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleItemChange(
                                    item.rowId,
                                    "quantity",
                                    e.target
                                      .value
                                  )
                                }
                                required
                              />

                            </div>


                            {/* COST */}

                            <div>

                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={
                                  item.unitCost
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleItemChange(
                                    item.rowId,
                                    "unitCost",
                                    e.target
                                      .value
                                  )
                                }
                                required
                              />

                            </div>


                            {/* TOTAL */}

                            <div className="purchase-row-total">

                              {formatCurrency(
                                rowTotal
                              )}

                            </div>


                            {/* REMOVE */}

                            <div>

                              <button
                                type="button"
                                className="purchase-remove-item"
                                onClick={() =>
                                  handleRemoveProduct(
                                    item.rowId
                                  )
                                }
                              >
                                ×
                              </button>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </div>


              {/* =============================
                  TOTALS
              ============================= */}

              <div className="purchase-bottom-grid">

                {/* NOTES */}

                <div className="purchase-form-group">

                  <label>
                    Notes
                  </label>

                  <textarea
                    rows="5"
                    placeholder="Optional purchase notes..."
                    value={notes}
                    onChange={(e) =>
                      setNotes(
                        e.target.value
                      )
                    }
                  />

                </div>


                {/* SUMMARY */}

                <div className="purchase-summary">

                  <div className="purchase-summary-row">

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      {formatCurrency(
                        subtotal
                      )}
                    </strong>

                  </div>


                  <div className="purchase-summary-input">

                    <label>
                      Discount
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discount}
                      placeholder="0.00"
                      onChange={(e) =>
                        setDiscount(
                          e.target.value
                        )
                      }
                    />

                  </div>


                  <div className="purchase-summary-input">

                    <label>
                      Tax
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={tax}
                      placeholder="0.00"
                      onChange={(e) =>
                        setTax(
                          e.target.value
                        )
                      }
                    />

                  </div>


                  <div className="purchase-summary-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      {formatCurrency(
                        total
                      )}
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* =============================
                FOOTER
            ============================= */}

            <div className="purchase-modal-footer">

              <button
                type="button"
                className="purchase-modal-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="purchase-modal-save"
                disabled={
                  loading ||
                  items.length === 0
                }
              >
                {loading
                  ? "Creating..."
                  : "Create Purchase"}
              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  );
};

export default PurchaseModal;