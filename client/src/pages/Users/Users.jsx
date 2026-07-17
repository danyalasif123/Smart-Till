import { useEffect, useState } from "react";
import { getUsers } from "../../services/userService";
import UsersTable from "../../components/users/UsersTable";
import UserModal from "../../components/users/UserModal";

import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.users);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Users</h2>

        <button
          className="btn-primary"
          onClick={() => setOpenModal(true)}
        >
          + New User
        </button>
      </div>

      <input
        className="search-box"
        placeholder="Search user..."
      />

      <UsersTable
        users={users}
        loading={loading}
      />

      <UserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refreshUsers={loadUsers}
      />
    </div>
  );
}

export default Users;