function UsersTable({ users, loading }) {

  if (loading)
    return <p>Loading...</p>;

  if (users.length === 0)
    return <p>No users found.</p>;

  return (
    <table className="users-table">

      <thead>

        <tr>

          <th>Name</th>

          <th>Email</th>

          <th>Role</th>

          <th>Status</th>

          <th>Actions</th>

        </tr>

      </thead>

      <tbody>

        {users.map((user) => (

          <tr key={user._id}>

            <td>{user.name}</td>

            <td>{user.email}</td>

            <td>{user.role}</td>

            <td>
              {user.status ? "Active" : "Inactive"}
            </td>

            <td>

              <button>Edit</button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}

export default UsersTable;