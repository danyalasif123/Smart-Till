import { useEffect, useState } from "react";
import "./Users.css";
import { Toaster } from "react-hot-toast";
import Button from "../../components/common/Button/Button";
import Search from "../../components/common/Search/Search";
import UserTable from "../../components/Users/UserTable";
import UserModal from "../../components/Users/UserModal";
import {
  getUsers,
  deleteUser,
} from "../../services/userService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // New States for Edit
  const [mode, setMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers();

      setUsers(response.users || response);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search Users
  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value)
    );
  });

  // Create User
  const handleCreate = () => {
    setMode("create");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Edit User
  const handleEdit = (user) => {
    setMode("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  const handleDelete = async (user) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${user.name}?`
  );

  if (!confirmDelete) return;

  try {
    await deleteUser(user._id);

    fetchUsers();
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
        "Failed to delete user."
    );
  }
};

  return (
    <div className="users-page">
      {/* Header */}
      <div className="users-header">
        <div>
          <h1>Users</h1>
          <p>Manage employees of your business.</p>
        </div>

        <Button onClick={handleCreate}>
          + New User
        </Button>
      </div>

      {/* Search */}
      <div className="users-toolbar">
        <Search
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="users-content">
       <UserTable
  users={filteredUsers}
  loading={loading}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
      </div>

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsers}
        mode={mode}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;