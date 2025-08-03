import React, { useEffect, useState } from "react";
import { apiFetch, getToken } from "../utils/api";

export default function AdminUserManager() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ role: "user", permissions: {} });

  useEffect(() => {
    apiFetch("/users", {}, getToken()).then(setUsers);
  }, []);

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      role: user.role,
      permissions: {
        canManageUsers: user.permissions?.canManageUsers || false,
        canManagePG: user.permissions?.canManagePG || false,
        canManageFeedbacks: user.permissions?.canManageFeedbacks || false,
      },
    });
  };

  const handleChange = (field, value) => {
    if (field === "role") {
      setForm((f) => ({ ...f, role: value }));
    } else {
      setForm((f) => ({
        ...f,
        permissions: { ...f.permissions, [field]: value },
      }));
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser = await apiFetch(
        `/users/${editingUser._id}/permissions`,
        {
          method: "PUT",
          body: JSON.stringify({
            role: form.role,
            permissions: form.permissions,
          }),
        },
        getToken()
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
      );
      setEditingUser(null);
      window.location.href = "/admin";
    } catch (err) {
      alert("Failed to update user permissions: " + err.message);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-2">Manage Users and Permissions</h2>

      {!editingUser && (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Username
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Role
              </th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {u.username}
                </td>
                <td className="border border-gray-300 px-4 py-2">{u.email}</td>
                <td className="border border-gray-300 px-4 py-2">{u.role}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => openEdit(u)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-300 px-4 py-4 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {editingUser && (
        <div className="mt-4 p-4 border border-gray-300 rounded shadow max-w-md">
          <h3 className="text-lg font-semibold mb-3">
            Edit User: {editingUser.username}
          </h3>

          <label className="block mb-3">
            Role:
            <select
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <fieldset className="mb-3">
            <legend className="font-semibold mb-1">Permissions:</legend>
            <label className="block">
              <input
                type="checkbox"
                checked={form.permissions.canManageUsers}
                onChange={(e) =>
                  handleChange("canManageUsers", e.target.checked)
                }
              />
              <span className="ml-2">Can Manage Users</span>
            </label>
            <label className="block">
              <input
                type="checkbox"
                checked={form.permissions.canManagePG}
                onChange={(e) => handleChange("canManagePG", e.target.checked)}
              />
              <span className="ml-2">Can Manage PGs</span>
            </label>
            <label className="block">
              <input
                type="checkbox"
                checked={form.permissions.canManageFeedbacks}
                onChange={(e) =>
                  handleChange("canManageFeedbacks", e.target.checked)
                }
              />
              <span className="ml-2">Can Manage Feedbacks</span>
            </label>
          </fieldset>

          <div className="space-x-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
