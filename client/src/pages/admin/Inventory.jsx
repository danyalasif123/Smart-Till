import {
  useEffect,
  useState,
} from "react";

import "./Inventory.css";
import toast from "react-hot-toast";
import Search from "../../components/common/Search/Search";
import StockAdjustmentModal from "../../components/Inventory/StockAdjustmentModal";
import {getInventory,} from "../../services/inventoryService";
import StockHistoryModal
  from "../../components/Inventory/StockHistoryModal";

const Inventory = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");
    const [
  adjustmentModalOpen,
  setAdjustmentModalOpen,
] = useState(false);

const [
  selectedProduct,
  setSelectedProduct,
] = useState(null);
const [
  historyModalOpen,
  setHistoryModalOpen,
] = useState(false);
  // ==========================================
  // FETCH INVENTORY
  // ==========================================

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const response =
        await getInventory();

      setProducts(
        response.products || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch inventory:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD INVENTORY
  // ==========================================

  useEffect(() => {
    fetchInventory();
  }, []);

  // ==========================================
  // TOTAL PRODUCTS
  // ==========================================

  const totalProducts =
    products.length;

  // ==========================================
  // LOW STOCK
  //
  // Stock > 0 but <= low stock level
  // ==========================================

  const lowStockProducts =
    products.filter((product) => {
      const stock = Number(
        product.stockQuantity || 0
      );

      const lowLevel = Number(
        product.lowStockLevel || 0
      );

      return (
        stock > 0 &&
        stock <= lowLevel
      );
    });

  // ==========================================
  // OUT OF STOCK
  // ==========================================

  const outOfStockProducts =
    products.filter(
      (product) =>
        Number(
          product.stockQuantity || 0
        ) <= 0
    );

  // ==========================================
  // STOCK VALUE
  //
  // Cost Price × Current Stock
  // ==========================================

  const stockValue =
    products.reduce(
      (total, product) => {
        const stock =
          Number(
            product.stockQuantity ||
              0
          );

        const cost =
          Number(
            product.costPrice || 0
          );

        return (
          total +
          stock * cost
        );
      },
      0
    );

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(Number(amount || 0));
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredProducts =
    products.filter((product) => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      if (!searchValue) {
        return true;
      }

      const name =
        product.name
          ?.toLowerCase() || "";

      const sku =
        product.sku
          ?.toLowerCase() || "";

      const barcode =
        product.barcode
          ?.toLowerCase() || "";

      const category =
        product.categoryId?.name
          ?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        sku.includes(searchValue) ||
        barcode.includes(
          searchValue
        ) ||
        category.includes(
          searchValue
        )
      );
    });
// ==========================================
// OPEN STOCK ADJUSTMENT
// ==========================================

const handleAdjustStock = (product) => {
  setSelectedProduct(product);

  setAdjustmentModalOpen(true);
};


// ==========================================
// CLOSE STOCK ADJUSTMENT
// ==========================================

const handleCloseAdjustment = () => {
  setAdjustmentModalOpen(false);

  setSelectedProduct(null);
};


// ==========================================
// STOCK UPDATED
// ==========================================

const handleStockUpdated = async () => {
  await fetchInventory();
};
  // ==========================================
  // RENDER
  // ==========================================
// ==========================================
// OPEN STOCK HISTORY
// ==========================================

const handleViewHistory = (product) => {
  setSelectedProduct(product);

  setHistoryModalOpen(true);
};


// ==========================================
// CLOSE STOCK HISTORY
// ==========================================

const handleCloseHistory = () => {
  setHistoryModalOpen(false);

  setSelectedProduct(null);
};
  return (
    <div className="inventory-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="inventory-header">

        <div>
          <h1>Inventory</h1>

          <p>
            Monitor stock levels and
            inventory movements.
          </p>
        </div>

      </div>

      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div className="inventory-summary">

        {/* TOTAL PRODUCTS */}

        <div className="inventory-summary-card">

          <span>
            Total Products
          </span>

          <strong>
            {totalProducts}
          </strong>

        </div>

        {/* LOW STOCK */}

        <div className="inventory-summary-card low">

          <span>
            Low Stock
          </span>

          <strong>
            {
              lowStockProducts.length
            }
          </strong>

        </div>

        {/* OUT OF STOCK */}

        <div className="inventory-summary-card out">

          <span>
            Out of Stock
          </span>

          <strong>
            {
              outOfStockProducts.length
            }
          </strong>

        </div>

        {/* STOCK VALUE */}

        <div className="inventory-summary-card">

          <span>
            Stock Value
          </span>

          <strong>
            {formatCurrency(
              stockValue
            )}
          </strong>

        </div>

      </div>

      {/* =====================================
          TOOLBAR
      ===================================== */}

      <div className="inventory-toolbar">

        <Search
          placeholder="Search by product, SKU, barcode or category..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <div className="inventory-result-count">

          {filteredProducts.length}{" "}
          products

        </div>

      </div>

      {/* =====================================
          INVENTORY TABLE
      ===================================== */}

      <div className="inventory-content">

        {loading ? (
          <div className="inventory-message">
            Loading inventory...
          </div>
        ) : filteredProducts.length ===
          0 ? (
          <div className="inventory-message">
            No products found.
          </div>
        ) : (
          <div className="inventory-table">

            {/* HEADER */}

            <div className="inventory-table-header">

              <div>Product</div>

              <div>SKU</div>

              <div>Category</div>

              <div>Stock</div>

              <div>Unit</div>

              <div>Status</div>

              <div>Actions</div>

            </div>

            {/* PRODUCTS */}

            {filteredProducts.map(
              (product) => {
                const stock =
                  Number(
                    product.stockQuantity ||
                      0
                  );

                const lowLevel =
                  Number(
                    product.lowStockLevel ||
                      0
                  );

                let stockStatus =
                  "In Stock";

                let statusClass =
                  "in-stock";

                if (stock <= 0) {
                  stockStatus =
                    "Out of Stock";

                  statusClass =
                    "out-stock";
                } else if (
                  stock <= lowLevel
                ) {
                  stockStatus =
                    "Low Stock";

                  statusClass =
                    "low-stock";
                }

                return (
                  <div
                    className="inventory-table-row"
                    key={product._id}
                  >

                    {/* PRODUCT */}

                    <div>
                      <strong>
                        {product.name}
                      </strong>

                      {product.barcode && (
                        <small>
                          {
                            product.barcode
                          }
                        </small>
                      )}
                    </div>

                    {/* SKU */}

                    <div>
                      {product.sku ||
                        "-"}
                    </div>

                    {/* CATEGORY */}

                    <div>
                      {product.categoryId
                        ?.name || "-"}
                    </div>

                    {/* STOCK */}

                    <div className="inventory-stock-number">

                      {stock}

                    </div>

                    {/* UNIT */}

                    <div>
                      {product.unit ||
                        "piece"}
                    </div>

                    {/* STATUS */}

                    <div>

                      <span
                        className={`inventory-stock-status ${statusClass}`}
                      >
                        {stockStatus}
                      </span>

                    </div>

                    {/* ACTIONS */}

                    <div className="inventory-actions">

                     <button
  type="button"
  className="inventory-history-btn"
  onClick={() =>
    handleViewHistory(product)
  }
>
  History
</button>

                    <button
  type="button"
  className="inventory-adjust-btn"
  onClick={() =>
    handleAdjustStock(product)
  }
>
  Adjust
</button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>
      <StockHistoryModal
  isOpen={historyModalOpen}
  product={selectedProduct}
  onClose={handleCloseHistory}
/>
      <StockAdjustmentModal
  isOpen={adjustmentModalOpen}
  product={selectedProduct}
  onClose={handleCloseAdjustment}
  onSuccess={handleStockUpdated}
/>

    </div>
  );
};

export default Inventory;