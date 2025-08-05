import React, { useState } from "react";
import {apiFetch} from "../utils/api";

const ServerLogs = () => {
  const [logs, setLogs] = useState("");
  const [showLogs, setShowLogs] = useState(false);

  const fetchLogs = async () => {
    const res = await apiFetch("/logs");
    const text = await res;
    setLogs(text || "No logs found.");
    setShowLogs(true);
  };

  return (
    <div className="mt-6">
      <button
        onClick={fetchLogs}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
      >
        View Server Logs
      </button>

      {showLogs && (
        <pre className="mt-4 bg-gray-100 p-4 text-sm rounded max-h-96 overflow-auto border border-gray-300">
          {logs || "No logs found."}
        </pre>
      )}
    </div>
  );
};

export default ServerLogs;
