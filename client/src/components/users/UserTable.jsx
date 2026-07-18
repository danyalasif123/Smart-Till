import "./UserTable.css";
import Badge from "../common/Badge/Badge";

const UserTable = ({
  users,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <div className="table-empty">Loading users...</div>;
  }

  return (
    <div className="user-table">
      {/* Table Header */}
      <div className="table-header">
        <div>Name</div>
        <div>Email</div>
        <div>Role</div>
        <div>Status</div>
        <div>Actions</div>
      </div>

      {/* Table Body */}
      {users.length > 0 ? (
        users.map((user) => (
          <div className="table-row" key={user._id}>
            <div className="table-cell">{user.name}</div>

            <div className="table-cell">{user.email}</div>

            <div className="table-cell">
              <span className="role-badge">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>

            <div className="table-cell">
              <Badge status={user.status} />
            </div>

          <div className="table-cell actions">
  <button
    className="edit-btn"
    onClick={() => onEdit(user)}
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() => onDelete(user)}
  >
    Delete
  </button>
</div>
          </div>
        ))
      ) : (
        <div className="table-empty">No users found.</div>
      )}
    </div>
  );
};

export default UserTable;