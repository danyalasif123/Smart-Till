import { useEffect, useState } from "react";
import "./Suppliers.css";
import { Toaster } from "react-hot-toast";
import Button from "../../components/common/Button/Button";
import Search from "../../components/common/Search/Search";

import SupplierTable from "../../components/Suppliers/SupplierTable";
import SupplierModal from "../../components/Suppliers/SupplierModal";

import {
  getSuppliers,
  deleteSupplier,
} from "../../services/supplierService";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // ==========================================
  // FETCH SUPPLIERS
  // ==========================================

  const fetchSuppliers = async () => {
    try {
      setLoading(true);

      const response = await getSuppliers();

      setSuppliers(response.suppliers || []);
    } catch (error) {
      console.error(
        "Failed to fetch suppliers:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load suppliers."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD SUPPLIERS
  // ==========================================

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ==========================================
  // CREATE SUPPLIER
  // ==========================================

  const handleCreate = () => {
    setSelectedSupplier(null);

    setModalMode("create");

    setIsModalOpen(true);
  };

  // ==========================================
  // EDIT SUPPLIER
  // ==========================================

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);

    setModalMode("edit");

    setIsModalOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setSelectedSupplier(null);

    setModalMode("create");
  };

  // ==========================================
  // CREATE / UPDATE SUCCESS
  // ==========================================

  const handleSupplierSuccess = async () => {
    await fetchSuppliers();
  };

  // ==========================================
  // DELETE SUPPLIER
  // ==========================================

  const handleDelete = async (supplier) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${supplier.name}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteSupplier(supplier._id);

      await fetchSuppliers();
    } catch (error) {
      console.error(
        "Failed to delete supplier:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete supplier."
      );
    }
  };

  // ==========================================
  // SEARCH / FILTER
  // ==========================================

  const filteredSuppliers = suppliers.filter(
    (supplier) => {
      const searchValue = search
        .trim()
        .toLowerCase();

      const name =
        supplier.name?.toLowerCase() || "";

      const contactPerson =
        supplier.contactPerson?.toLowerCase() || "";

      const email =
        supplier.email?.toLowerCase() || "";

      const phone =
        supplier.phone?.toLowerCase() || "";

      const address =
        supplier.address?.toLowerCase() || "";

      const city =
        supplier.city?.toLowerCase() || "";

      const postcode =
        supplier.postcode?.toLowerCase() || "";

      const country =
        supplier.country?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        contactPerson.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue) ||
        address.includes(searchValue) ||
        city.includes(searchValue) ||
        postcode.includes(searchValue) ||
        country.includes(searchValue)
      );
    }
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="suppliers-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="suppliers-header">

        <div>
          <h1>Suppliers</h1>

          <p>
            Manage suppliers and contact information.
          </p>
        </div>

        <Button onClick={handleCreate}>
          + New Supplier
        </Button>

      </div>

      {/* =====================================
          TOOLBAR
      ===================================== */}

      <div className="suppliers-toolbar">

        <Search
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* =====================================
          SUPPLIER TABLE
      ===================================== */}

      <div className="suppliers-content">

        <SupplierTable
          suppliers={filteredSuppliers}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>

      {/* =====================================
          SUPPLIER MODAL
      ===================================== */}

      <SupplierModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSupplierSuccess}
        mode={modalMode}
        supplier={selectedSupplier}
      />

    </div>
  );
};

export default Suppliers;