import { useEffect, useState } from "react";
import "./Products.css";

import Button from "../../components/common/Button/Button";
import Search from "../../components/common/Search/Search";

import ProductTable from "../../components/Products/ProductTable";
import ProductModal from "../../components/Products/ProductModal";

import {
  getProducts,
  deleteProduct,
} from "../../services/productService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts();

      setProducts(response.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // CREATE PRODUCT
  // ==========================================

  const handleCreate = () => {
    setSelectedProduct(null);

    setModalMode("create");

    setIsModalOpen(true);
  };

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const handleEdit = (product) => {
    setSelectedProduct(product);

    setModalMode("edit");

    setIsModalOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setSelectedProduct(null);

    setModalMode("create");
  };

  // ==========================================
  // PRODUCT CREATED / UPDATED
  // ==========================================

  const handleProductSuccess = async () => {
    await fetchProducts();
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteProduct(product._id);

      await fetchProducts();
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // ==========================================
  // SEARCH / FILTER
  // ==========================================

  const filteredProducts = products.filter(
    (product) => {
      const searchValue = search
        .trim()
        .toLowerCase();

      const name =
        product.name?.toLowerCase() || "";

      const sku =
        product.sku?.toLowerCase() || "";

      const barcode =
        product.barcode?.toLowerCase() || "";

      const category =
        product.categoryId?.name?.toLowerCase() ||
        "";

      const unit =
        product.unit?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        sku.includes(searchValue) ||
        barcode.includes(searchValue) ||
        category.includes(searchValue) ||
        unit.includes(searchValue)
      );
    }
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="products-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="products-header">

        <div>
          <h1>Products</h1>

          <p>
            Manage products, pricing and inventory.
          </p>
        </div>

        <Button onClick={handleCreate}>
          + New Product
        </Button>

      </div>

      {/* =====================================
          TOOLBAR
      ===================================== */}

      <div className="products-toolbar">

        <Search
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* =====================================
          PRODUCT TABLE
      ===================================== */}

      <div className="products-content">

        <ProductTable
          products={filteredProducts}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>

      {/* =====================================
          PRODUCT MODAL
      ===================================== */}

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleProductSuccess}
        mode={modalMode}
        product={selectedProduct}
      />

    </div>
  );
};

export default Products;