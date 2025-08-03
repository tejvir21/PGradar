import React, { useEffect, useState } from "react";
import { apiFetch, getToken } from "../utils/api";
import PGForm from "./PGForm";

export default function AdminPGManager() {
  const [pgs, setPgs] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    apiFetch("/pgs", {}, getToken()).then(setPgs);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this PG?")) {
      await apiFetch(`/pgs/${id}`, { method: "DELETE" }, getToken());
      setPgs((prev) => prev.filter((pg) => pg._id !== id));
      if (editing && editing._id === id) setEditing(null);
        window.location.href = "/admin"
    }
  };

const handleSave = async (pg) => {
  let updated;
  if (pg._id) {
    // Update existing PG
    updated = await apiFetch(
      `/pgs/${pg._id}`,
      { method: 'PUT', body: JSON.stringify(pg) },
      getToken()
    );
    setPgs((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  } else {
    // Create new PG
    delete pg._id;
    updated = await apiFetch(
      '/pgs',
      { method: 'POST', body: JSON.stringify(pg) },
      getToken()
    );
    setPgs((prev) => [updated, ...prev]);
  }
  setEditing(null);
  window.location.href = "/admin"
};


  const handleCancel = () => setEditing(null);

  return (
    <div>
      <button
        onClick={() => setEditing({})}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add PG
      </button>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Price
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pgs.map((pg) => (
              <tr key={pg._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{pg.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹{pg.price}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => setEditing(pg)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pg._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {pgs.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="border border-gray-300 px-4 py-4 text-center text-gray-500"
                >
                  No PG listings available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="mt-6 border border-gray-300 rounded p-4 shadow">
          <PGForm pg={editing} onSave={handleSave} onCancel={handleCancel} />
        </div>
      )}
    </div>
  );
}
