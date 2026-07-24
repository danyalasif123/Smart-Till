import { useEffect, useState } from "react";
import "./Categories.css";

import Button from "../../components/common/Button/Button";
import Search from "../../components/common/Search/Search";

import CategoryTable from "../../components/Categories/CategoryTable";
import CategoryModal from "../../components/Categories/CategoryModal";

import {
  getCategories,
  deleteCategory,
} from "../../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await getCategories();

      setCategories(response.categories || []);
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================================
  // CREATE CATEGORY
  // ==========================================

  const handleCreate = () => {
    // No existing category selected
    setSelectedCategory(null);

    // Set modal to create mode
    setModalMode("create");

    // Open modal
    setIsModalOpen(true);
  };

  // ==========================================
  // EDIT CATEGORY
  // ==========================================

  const handleEdit = (category) => {
    // Store selected category
    setSelectedCategory(category);

    // Set modal to edit mode
    setModalMode("edit");

    // Open modal
    setIsModalOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setSelectedCategory(null);

    setModalMode("create");
  };

  // ==========================================
  // CATEGORY CREATED / UPDATED
  // ==========================================

  const handleCategorySuccess = async () => {
    // Refresh categories from backend
    await fetchCategories();
  };

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  const handleDelete = async (category) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteCategory(category._id);

      // Refresh category list
      await fetchCategories();
    } catch (error) {
      console.error(
        "Failed to delete category:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    }
  };

  // ==========================================
  // SEARCH / FILTER
  // ==========================================

  const filteredCategories = categories.filter(
    (category) => {
      const searchValue = search
        .trim()
        .toLowerCase();

      const name =
        category.name?.toLowerCase() || "";

      const description =
        category.description?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        description.includes(searchValue)
      );
    }
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="categories-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="categories-header">

        <div>
          <h1>Categories</h1>

          <p>
            Manage product categories for your business.
          </p>
        </div>

        <Button onClick={handleCreate}>
          + New Category
        </Button>

      </div>

      {/* =====================================
          TOOLBAR
      ===================================== */}

      <div className="categories-toolbar">

        <Search
          placeholder="Search categories..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* =====================================
          CATEGORY TABLE
      ===================================== */}

      <div className="categories-content">

        <CategoryTable
          categories={filteredCategories}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>

      {/* =====================================
          CATEGORY MODAL
      ===================================== */}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleCategorySuccess}
        mode={modalMode}
        category={selectedCategory}
      />

    </div>
  );
};

export default Categories;