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
    return <div>You must be logged in to access the admin dashboard.</div>;
  }
  if (role !== "pastor" && role !== "admin") {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {/* ... */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        {/* ...thead... */}
        <tbody>
          {allUsers.map((u) => (
            <tr key={u.id}>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>
                {u.name}
                {u.id === user.uid ? " (You)" : ""}
              </td>
              {/* <td style={{ border: "1px solid #ddd", padding: 8 }}>
                {u.email || ""}
              </td> */}
              <td style={{ border: "1px solid #ddd", padding: 8 }}>{u.role}</td>
              <td style={{ border: "1px solid #ddd", padding: 8 }}>
                {u.id !== user.uid && (
                  <>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={{ marginRight: 8 }}
                    >
                      <option value="member">Member</option>
                      <option value="pastor">Pastor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      style={{ color: "red" }}
                    >
                      Delete
                    </button>
                  </>
                )}
                {u.id === user.uid && <span>—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboardPage;
