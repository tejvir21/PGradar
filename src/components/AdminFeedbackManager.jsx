import React, { useEffect, useState } from "react";
import { apiFetch, getToken } from "../utils/api";

export default function AdminFeedbackManager() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/feedback/all", {}, getToken())
      .then(setFeedbacks)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this feedback?")) {
      await apiFetch(`/feedback/${id}`, { method: "DELETE" }, getToken());
      setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading feedback...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">PG</th>
            <th className="border border-gray-300 px-4 py-2">User</th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Rating
            </th>
            <th className="border border-gray-300 px-4 py-2">Comment</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {fb.pg?.name || "-"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {fb.user?.username || "-"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {fb.rating}
              </td>
              <td className="border border-gray-300 px-4 py-2">{fb.comment}</td>
              <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                {new Date(fb.createdAt).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => handleDelete(fb._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {feedbacks.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="border border-gray-300 px-4 py-4 text-center text-gray-500"
              >
                No feedback available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
