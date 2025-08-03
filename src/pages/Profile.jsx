import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiFetch, getToken, clearToken } from "../utils/api";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = getToken();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    async function fetchProfile() {
      try {
        const data = await apiFetch("/user/profile", {}, token);
        setUser(data);
        setForm({
          username: data.username || "",
          email: data.email || "",
          password: "",
          confirmPassword: "",
        });
      } catch {
        setError(t("Error loading profile"));
      }
    }
    fetchProfile();
  }, [token, navigate, t]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccessMsg("");
  };

  const validateForm = () => {
    if (!form.username.trim()) return t("Username is required");
    if (!form.email.trim()) return t("Email is required");
    if (!/\S+@\S+\.\S+/.test(form.email)) return t("Email is invalid");
    if (form.password && form.password.length < 6)
      return t("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword)
      return t("Passwords do not match");
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const updateData = { username: form.username, email: form.email };
      if (form.password) updateData.password = form.password;

      const updatedUser = await apiFetch(
        "/auth/profile",
        {
          method: "PUT",
          body: JSON.stringify(updateData),
        },
        token
      );

      setUser(updatedUser);
      setSuccessMsg(t("Profile updated successfully"));
    } catch (err) {
      setError(err.message || t("Failed to update profile"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  if (!user) {
    return <div className="text-center mt-20">{t("Loading profile...")}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-semibold mb-4">{t("Profile")}</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {successMsg && <div className="mb-4 text-green-600">{successMsg}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <label className="block mb-2">
          {t("Username")}
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            aria-label={t("Username")}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          {t("Email")}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            aria-label={t("Email")}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          {t("New Password")}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t("Leave blank to keep current")}
            aria-label={t("New Password")}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-4">
          {t("Confirm New Password")}
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder={t("Leave blank to keep current")}
            aria-label={t("Confirm New Password")}
            className="w-full px-3 py-2 border rounded mt-1"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? t("Saving...") : t("Save Changes")}
        </button>
      </form>
      <button
        onClick={handleLogout}
        className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        {t("Logout")}
      </button>
    </div>
  );
}

export default Profile;
