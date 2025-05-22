import React from "react";

function AdminDashboardPage({
  allUsers,
  usersLoading,
  handleRoleChange,
  handleDeleteUser,
  user,
  role,
}) {
  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          You must be logged in to access the admin dashboard.
        </div>
      </div>
    );
  }
  if (role !== "pastor" && role !== "admin") {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          You do not have permission to view this page.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      {usersLoading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                {/* <th>Email</th> */}
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    {u.name}
                    {u.id === user.uid ? " (You)" : ""}
                  </td>
                  {/* <td>{u.email || ""}</td> */}
                  <td>
                    <span className="badge bg-secondary">{u.role}</span>
                  </td>
                  <td>
                    {u.id !== user.uid ? (
                      <div className="d-flex gap-2">
                        <select
                          className="form-select form-select-sm w-auto"
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u.id, e.target.value)
                          }
                        >
                          <option value="member">Member</option>
                          <option value="pastor">Pastor</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
