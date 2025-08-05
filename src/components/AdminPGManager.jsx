import React, { useEffect, useState, useMemo } from "react";
import { apiFetch, getToken } from "../utils/api";
import PGForm from "./PGForm";

export default function AdminPGManager() {
  const [pgs, setPgs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    apiFetch("/pgs", {}, getToken()).then(setPgs);
  }, []);

  // Filter PGs based on search
  const filteredPgs = useMemo(() => {
    return pgs.filter((pg) =>
      pg.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [pgs, search]);

  const totalPages = Math.ceil(filteredPgs.length / itemsPerPage);

  // Paginate the filtered PGs
  const paginatedPgs = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredPgs.slice(start, start + itemsPerPage);
  }, [filteredPgs, page]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this PG?")) {
      await apiFetch(`/pgs/${id}`, { method: "DELETE" }, getToken());
      setPgs((prev) => prev.filter((pg) => pg._id !== id));
      if (editing && editing._id === id) setEditing(null);
      window.location.href = "/admin";
    }
  };

  const handleSave = async (pg) => {
    let updated;
    if (pg._id) {
      // Update existing PG
      updated = await apiFetch(
        `/pgs/${pg._id}`,
        { method: "PUT", body: JSON.stringify(pg) },
        getToken()
      );
      setPgs((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } else {
      // Create new PG
      delete pg._id;
      updated = await apiFetch(
        "/pgs",
        { method: "POST", body: JSON.stringify(pg) },
        getToken()
      );
      setPgs((prev) => [updated, ...prev]);
    }
    setEditing(null);
    window.location.href = "/admin";
  };

  const handleCancel = () => setEditing(null);

  return (
    <div>
      {/* Add + Search */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setEditing({})}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add PG
        </button>

        <input
          type="text"
          placeholder="Search PGs..."
          className="border border-gray-300 rounded px-3 py-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
        />
      </div>

      {/* Form */}
      {editing && (
        <div className="mt-6 border border-gray-300 rounded p-4 shadow">
          <PGForm pg={editing} onSave={handleSave} onCancel={handleCancel} />
        </div>
      )}

      {/* Table */}
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
            {paginatedPgs.map((pg) => (
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

            {paginatedPgs.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">
                  No PG listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
