import { useEffect, useState } from "react";
import "./Customers.css";
import Button from "../../components/common/Button/Button";
import Search from "../../components/common/Search/Search";
import toast from "react-hot-toast";
import CustomerTable from "../../components/Customers/CustomerTable";
import CustomerModal from "../../components/Customers/CustomerModal";
import CustomerDetailsModal from "../../components/Customers/CustomerDetailsModal";
import {
  getCustomers,
  deleteCustomer,
} from "../../services/customerService";

const Customers = () => {
  // ==========================================
  // STATES
  // ==========================================

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("create");

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState(null);
  const [
  viewCustomer,
  setViewCustomer,
] = useState(null);

const [
  isDetailsOpen,
  setIsDetailsOpen,
] = useState(false);


  // ==========================================
  // FETCH CUSTOMERS
  // ==========================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response =
        await getCustomers();

      setCustomers(
        response.customers || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch customers:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load customers."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOAD CUSTOMERS
  // ==========================================

  useEffect(() => {
    fetchCustomers();
  }, []);


  // ==========================================
  // CREATE CUSTOMER
  // ==========================================

  const handleCreate = () => {
    // No existing customer
    setSelectedCustomer(null);

    // Tell modal we're creating
    setModalMode("create");

    // Open modal
    setIsModalOpen(true);
  };


  // ==========================================
  // EDIT CUSTOMER
  // ==========================================

  const handleEdit = (customer) => {
    // Store selected customer
    setSelectedCustomer(customer);

    // Tell modal we're editing
    setModalMode("edit");

    // Open modal
    setIsModalOpen(true);
  };


  // ==========================================
  // VIEW CUSTOMER
  // ==========================================

// ==========================================
// VIEW CUSTOMER
// ==========================================

const handleView = (customer) => {
  setViewCustomer(customer);

  setIsDetailsOpen(true);
};
// ==========================================
// CLOSE CUSTOMER DETAILS
// ==========================================

const handleCloseDetails = () => {
  setIsDetailsOpen(false);

  setViewCustomer(null);
};


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setSelectedCustomer(null);

    setModalMode("create");
  };


  // ==========================================
  // CREATE / UPDATE SUCCESS
  // ==========================================

  const handleCustomerSuccess =
    async () => {
      await fetchCustomers();
    };


  // ==========================================
  // DELETE CUSTOMER
  // ==========================================

  const handleDelete = async (
    customer
  ) => {
    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete "${customer.name}"?`
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteCustomer(
        customer._id
      );

      // Refresh customers
      await fetchCustomers();
    } catch (error) {
      console.error(
        "Failed to delete customer:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete customer."
      );
    }
  };


  // ==========================================
  // SEARCH / FILTER
  // ==========================================

  const filteredCustomers =
    customers.filter((customer) => {
      const searchValue = search
        .trim()
        .toLowerCase();

      // No search
      if (!searchValue) {
        return true;
      }

      // Customer Number
      const customerNumber =
        customer.customerNumber
          ?.toLowerCase() || "";

      // Name
      const name =
        customer.name
          ?.toLowerCase() || "";

      // Phone
      const phone =
        customer.phone
          ?.toLowerCase() || "";

      // Email
      const email =
        customer.email
          ?.toLowerCase() || "";

      // Address
      const address =
        customer.address
          ?.toLowerCase() || "";

      // City
      const city =
        customer.city
          ?.toLowerCase() || "";

      // Postcode
      const postcode =
        customer.postcode
          ?.toLowerCase() || "";

      // Country
      const country =
        customer.country
          ?.toLowerCase() || "";

      return (
        customerNumber.includes(
          searchValue
        ) ||
        name.includes(searchValue) ||
        phone.includes(searchValue) ||
        email.includes(searchValue) ||
        address.includes(searchValue) ||
        city.includes(searchValue) ||
        postcode.includes(searchValue) ||
        country.includes(searchValue)
      );
    });


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="customers-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="customers-header">

        <div>
          <h1>Customers</h1>

          <p>
            Manage customers and view
            customer activity.
          </p>
        </div>

        <Button
          onClick={handleCreate}
        >
          + New Customer
        </Button>

      </div>


      {/* =====================================
          TOOLBAR
      ===================================== */}

      <div className="customers-toolbar">

        <Search
          placeholder="Search by customer ID, name, phone or email..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

      </div>


      {/* =====================================
          CUSTOMER TABLE
      ===================================== */}

      <div className="customers-content">

        <CustomerTable
          customers={
            filteredCustomers
          }
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>


      {/* =====================================
          CUSTOMER MODAL
      ===================================== */}

      <CustomerModal
        isOpen={isModalOpen}
        onClose={
          handleCloseModal
        }
        onSuccess={
          handleCustomerSuccess
        }
        mode={modalMode}
        customer={
          selectedCustomer
        }
      />
      {/* =====================================
    CUSTOMER DETAILS
===================================== */}

<CustomerDetailsModal
  isOpen={isDetailsOpen}
  customer={viewCustomer}
  onClose={handleCloseDetails}
/>

    </div>
  );
};

export default Customers;