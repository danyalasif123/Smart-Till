import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./POS.css";

import ProductGrid from "../../components/POS/ProductGrid";
import Cart from "../../components/POS/Cart";
import CustomerLookup from "../../components/POS/CustomerLookup";

import { getProducts } from "../../services/productService";
import { createSale } from "../../services/saleService";

const POS = () => {
  // ==========================================
  // NAVIGATION
  // ==========================================

  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [search, setSearch] = useState("");

  // null means anonymous walk-in customer
  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [productsLoading, setProductsLoading] =
    useState(false);

  const [saleLoading, setSaleLoading] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("cash");

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);

      const response = await getProducts();

      setProducts(response.products || []);
    } catch (error) {
      console.error(
        "Failed to fetch products:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setProductsLoading(false);
    }
  };

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = products.filter(
    (product) => {
      // Hide inactive products
      if (!product.status) {
        return false;
      }

      const searchValue = search
        .trim()
        .toLowerCase();

      if (!searchValue) {
        return true;
      }

      const name =
        product.name?.toLowerCase() || "";

      const sku =
        product.sku?.toLowerCase() || "";

      const barcode =
        product.barcode?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        sku.includes(searchValue) ||
        barcode.includes(searchValue)
      );
    }
  );

  // ==========================================
  // ADD PRODUCT TO CART
  // ==========================================

  const handleAddProduct = (product) => {
    if (product.stockQuantity <= 0) {
      alert(
        `${product.name} is out of stock.`
      );

      return;
    }

    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) =>
            item._id === product._id
        );

      // ======================================
      // PRODUCT ALREADY EXISTS
      // ======================================

      if (existingItem) {
        if (
          existingItem.quantity >=
          product.stockQuantity
        ) {
          alert(
            `Only ${product.stockQuantity} ${
              product.unit || "units"
            } available.`
          );

          return currentCart;
        }

        return currentCart.map(
          (item) =>
            item._id === product._id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      // ======================================
      // NEW PRODUCT
      // ======================================

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const handleIncrease = (product) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item._id !== product._id
        ) {
          return item;
        }

        if (
          item.quantity >=
          item.stockQuantity
        ) {
          return item;
        }

        return {
          ...item,
          quantity:
            item.quantity + 1,
        };
      })
    );
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const handleDecrease = (product) => {
    setCart((currentCart) => {
      const item =
        currentCart.find(
          (cartItem) =>
            cartItem._id ===
            product._id
        );

      if (!item) {
        return currentCart;
      }

      // Remove item if quantity becomes 0
      if (item.quantity <= 1) {
        return currentCart.filter(
          (cartItem) =>
            cartItem._id !==
            product._id
        );
      }

      return currentCart.map(
        (cartItem) =>
          cartItem._id ===
          product._id
            ? {
                ...cartItem,
                quantity:
                  cartItem.quantity -
                  1,
              }
            : cartItem
      );
    });
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const handleRemove = (product) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item._id !== product._id
      )
    );
  };

  // ==========================================
  // CLEAR CURRENT SALE
  // ==========================================

  const handleClearCart = () => {
    if (
      cart.length === 0 &&
      !selectedCustomer
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Clear the current sale?"
      );

    if (!confirmed) {
      return;
    }

    // Clear products
    setCart([]);

    // Remove selected customer
    setSelectedCustomer(null);

    // Reset payment
    setPaymentMethod("cash");

    // Clear product search
    setSearch("");
  };

  // ==========================================
  // SELECT CUSTOMER
  // ==========================================

  const handleSelectCustomer = (
    customer
  ) => {
    setSelectedCustomer(customer);
  };

  // ==========================================
  // REMOVE CUSTOMER
  // ==========================================

  const handleRemoveCustomer = () => {
    setSelectedCustomer(null);
  };

  // ==========================================
  // OPEN SALES HISTORY
  // ==========================================

  const handleSalesHistory = () => {
    navigate("/admin/sales");
  };

  // ==========================================
  // COMPLETE SALE
  // ==========================================

  const handleCompleteSale =
    async () => {
      if (cart.length === 0) {
        alert("Cart is empty.");

        return;
      }

      try {
        setSaleLoading(true);

        // ====================================
        // BUILD SALE REQUEST
        // ====================================

        const saleData = {
          items: cart.map(
            (item) => ({
              productId:
                item._id,

              quantity:
                item.quantity,
            })
          ),

          paymentMethod,

          source: "pos",

          // Customer MongoDB ID is sent
          // internally.
          //
          // Cashier only deals with:
          // CUST-XXXXXXXX
          //
          // Walk-in customer = null
          customerId:
            selectedCustomer?._id ||
            null,
        };

        // ====================================
        // CREATE SALE
        // ====================================

        const response =
          await createSale(
            saleData
          );

        // ====================================
        // CUSTOMER MESSAGE
        // ====================================

        const customerText =
          selectedCustomer
            ? `\nCustomer: ${selectedCustomer.name}` +
              `\nCustomer ID: ${selectedCustomer.customerNumber}`
            : "\nCustomer: Walk-in";

        // ====================================
        // SUCCESS
        // ====================================

        alert(
          `Sale completed successfully.\n` +
            `Sale: ${response.sale.saleNumber}` +
            customerText +
            `\nTotal: $${Number(
              response.sale.total
            ).toFixed(2)}`
        );

        // ====================================
        // RESET POS
        // ====================================

        setCart([]);

        setSelectedCustomer(null);

        setPaymentMethod("cash");

        setSearch("");

        // Refresh products because
        // stock has changed
        await fetchProducts();
      } catch (error) {
        console.error(
          "Complete Sale Error:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Failed to complete sale."
        );

        // Refresh stock because another
        // cashier may have changed it
        await fetchProducts();
      } finally {
        setSaleLoading(false);
      }
    };

  // ==========================================
  // CART TOTAL
  // ==========================================

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(
        item.sellingPrice
      ) *
        Number(item.quantity),
    0
  );

  // ==========================================
  // TOTAL ITEM QUANTITY
  // ==========================================

  const totalItems = cart.reduce(
    (total, item) =>
      total +
      Number(item.quantity),
    0
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="pos-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="pos-page-header">

        {/* LEFT */}

        <div>
          <h1>
            Point of Sale
          </h1>

          <p>
            Create and process
            customer sales.
          </p>
        </div>

        {/* RIGHT */}

        <div className="pos-header-right">

          {/* SALES HISTORY BUTTON */}

          <button
            type="button"
            className="pos-sales-history-btn"
            onClick={
              handleSalesHistory
            }
          >
            Sales History
          </button>

          {/* =================================
              SALE SUMMARY
          ================================= */}

          <div className="pos-header-summary">

            {/* CUSTOMER */}

            <div>
              <span>
                Customer
              </span>

              <strong>
                {selectedCustomer
                  ? selectedCustomer.name
                  : "Walk-in"}
              </strong>
            </div>

            {/* ITEMS */}

            <div>
              <span>
                Items
              </span>

              <strong>
                {totalItems}
              </strong>
            </div>

            {/* TOTAL */}

            <div>
              <span>
                Total
              </span>

              <strong>
                $
                {cartTotal.toFixed(
                  2
                )}
              </strong>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          POS LAYOUT
      ===================================== */}

      <div className="pos-layout">

        {/* ===================================
            LEFT SIDE
            PRODUCTS
        =================================== */}

        <div className="pos-products-section">

          {/* =================================
              PRODUCT TOOLBAR
          ================================= */}

          <div className="pos-product-toolbar">

            {/* SEARCH */}

            <div className="pos-search-wrapper">

              <input
                type="text"
                className="pos-search-input"
                placeholder="Search or scan product by name, SKU or barcode..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                autoFocus
              />

              {search && (
                <button
                  type="button"
                  className="pos-search-clear"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  ×
                </button>
              )}

            </div>

            {/* CLEAR SALE */}

            <button
              type="button"
              className="pos-clear-cart"
              disabled={
                cart.length === 0 &&
                !selectedCustomer
              }
              onClick={
                handleClearCart
              }
            >
              Clear Sale
            </button>

          </div>

          {/* =================================
              PRODUCT COUNT
          ================================= */}

          <div className="pos-product-info">

            <span>
              {
                filteredProducts.length
              }{" "}
              products
            </span>

          </div>

          {/* =================================
              PRODUCT GRID
          ================================= */}

          <div className="pos-products-scroll">

            <ProductGrid
              products={
                filteredProducts
              }
              loading={
                productsLoading
              }
              onAddProduct={
                handleAddProduct
              }
            />

          </div>

        </div>

        {/* ===================================
            RIGHT SIDE
            CUSTOMER + CART
        =================================== */}

        <div className="pos-cart-section">

          {/* =================================
              CUSTOMER LOOKUP
          ================================= */}

          <CustomerLookup
            selectedCustomer={
              selectedCustomer
            }
            onSelectCustomer={
              handleSelectCustomer
            }
            onRemoveCustomer={
              handleRemoveCustomer
            }
          />

          {/* =================================
              CART
          ================================= */}

          <Cart
            cart={cart}
            paymentMethod={
              paymentMethod
            }
            onPaymentMethodChange={
              setPaymentMethod
            }
            onIncrease={
              handleIncrease
            }
            onDecrease={
              handleDecrease
            }
            onRemove={
              handleRemove
            }
            onCompleteSale={
              handleCompleteSale
            }
            loading={
              saleLoading
            }
          />

        </div>

      </div>

    </div>
  );
};

export default POS;