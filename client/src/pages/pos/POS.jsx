import { useEffect, useState } from "react";
import "./POS.css";

import ProductGrid from "../../components/POS/ProductGrid";
import Cart from "../../components/POS/Cart";

import { getProducts } from "../../services/productService";
import { createSale } from "../../services/saleService";

const POS = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [search, setSearch] = useState("");

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
      // Only active products
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
      alert(`${product.name} is out of stock.`);
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item._id === product._id
      );

      // Product already in cart
      if (existingItem) {
        if (
          existingItem.quantity >=
          product.stockQuantity
        ) {
          alert(
            `Only ${product.stockQuantity} ${product.unit || "units"} available.`
          );

          return currentCart;
        }

        return currentCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      // New cart item
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
        if (item._id !== product._id) {
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
          quantity: item.quantity + 1,
        };
      })
    );
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const handleDecrease = (product) => {
    setCart((currentCart) => {
      const item = currentCart.find(
        (cartItem) =>
          cartItem._id === product._id
      );

      if (!item) {
        return currentCart;
      }

      // Remove product when quantity reaches 0
      if (item.quantity <= 1) {
        return currentCart.filter(
          (cartItem) =>
            cartItem._id !== product._id
        );
      }

      return currentCart.map((cartItem) =>
        cartItem._id === product._id
          ? {
              ...cartItem,
              quantity:
                cartItem.quantity - 1,
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
  // CLEAR CART
  // ==========================================

  const handleClearCart = () => {
    if (cart.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Clear the current sale?"
    );

    if (!confirmed) {
      return;
    }

    setCart([]);
  };

  // ==========================================
  // COMPLETE SALE
  // ==========================================

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    try {
      setSaleLoading(true);

      // ======================================
      // IMPORTANT
      //
      // Only send product ID + quantity.
      //
      // Do NOT send sellingPrice or totals.
      // Backend calculates everything using
      // MongoDB product prices.
      // ======================================

      const saleData = {
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),

        paymentMethod,

        source: "pos",

        // Anonymous walk-in for now
        customerId: null,
      };

      const response =
        await createSale(saleData);

      // ======================================
      // SUCCESS
      // ======================================

      alert(
        `Sale completed successfully.\nSale: ${response.sale.saleNumber}\nTotal: $${Number(
          response.sale.total
        ).toFixed(2)}`
      );

      // Clear current sale
      setCart([]);

      // Reset payment method
      setPaymentMethod("cash");

      // Clear search
      setSearch("");

      // Refresh products to get new stock
      await fetchProducts();
    } catch (error) {
      console.error(
        "Complete Sale Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to complete sale."
      );

      // Refresh because stock may have
      // changed since products were loaded.
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
      Number(item.sellingPrice) *
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

        <div>
          <h1>Point of Sale</h1>

          <p>
            Create and process customer sales.
          </p>
        </div>

        <div className="pos-header-summary">

          <div>
            <span>Items</span>

            <strong>
              {cart.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              )}
            </strong>
          </div>

          <div>
            <span>Total</span>

            <strong>
              ${cartTotal.toFixed(2)}
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================
          POS LAYOUT
      ===================================== */}

      <div className="pos-layout">

        {/* ===================================
            LEFT SIDE
        =================================== */}

        <div className="pos-products-section">

          {/* SEARCH */}

          <div className="pos-product-toolbar">

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

            <button
              type="button"
              className="pos-clear-cart"
              disabled={
                cart.length === 0
              }
              onClick={
                handleClearCart
              }
            >
              Clear Sale
            </button>

          </div>

          {/* PRODUCT COUNT */}

          <div className="pos-product-info">

            <span>
              {
                filteredProducts.length
              }{" "}
              products
            </span>

          </div>

          {/* PRODUCTS */}

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
            RIGHT SIDE / CART
        =================================== */}

        <div className="pos-cart-section">

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