import React, { useEffect, useState } from "react";
import { apiFetch, getToken } from "../utils/api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import AnalyticsChartPage from "./AnalyticsChart"; // Your analytics component
import AdminPGManager from "../components/AdminPGManager";
import AdminUserManager from "../components/AdminUserManager";
import AdminFeedbackManager from "../components/AdminFeedbackManager";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const token = getToken();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    apiFetch("/user/profile", {}, token)
      .then(setUser)
      .catch((err) => setFetchError(err.message || "Error loading profile"))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  if (loading) {
    return <div className="p-12 text-center">{t("Loading")}...</div>;
  }

  if (fetchError) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded shadow text-center text-red-600">
        {t("Error")}: {fetchError}
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded shadow text-center">
        <div className="mb-4 text-3xl text-gray-600">🚫</div>
        <div className="text-xl font-semibold mb-2">{t("Access denied")}</div>
        <div className="text-gray-600">
          {t(
            "You do not have permission to view this page. Only admins may access the admin dashboard."
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mb-12 p-6 space-y-10 scrollbar-none">
      <h1 className="text-3xl font-bold">{t("Admin Dashboard")}</h1>

      {/* Analytics section */}
      <section className="bg-white shadow rounded p-6">
        <AnalyticsChartPage />
      </section>

      {/* Manage PGs */}
      {user.permissions.canManagePG ?
      (<section className="bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {t("Manage Paying Guest Listings")}
        </h2>
        <AdminPGManager /> 
      </section> ) : null}

      {/* Manage Users */}
      {user.permissions.canManageUsers ?
      (
      <section className="bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {t("Manage Users and Permissions")}
        </h2>
        <AdminUserManager />
      </section>) : null}

      {/* Review Feedback */}
      {user.permissions.canManageFeedbacks ?
      (
      <section className="bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {t("Review Feedback and Ratings")}
        </h2>
        <AdminFeedbackManager />
      </section>) : null}
    </div>
  );
}
