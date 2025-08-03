import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiFetch, saveToken } from "../utils/api";

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const validateForm = () => {
    if (!form.email.trim()) return t("Email is required");
    if (!/\S+@\S+\.\S+/.test(form.email)) return t("Email is invalid");
    if (!form.password) return t("Password is required");
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      saveToken(data.token);
      // Redirect to home or profile page after login
      navigate("/");
    } catch (err) {
      setError(err.message || t("Login failed: Invalid email or password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-semibold mb-4">{t("Login")}</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <label className="block mb-4">
          {t("Email")}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            aria-label={t("Email")}
            className="w-full px-3 py-2 border rounded mt-1"
            autoComplete="username"
          />
        </label>
        <label className="block mb-6">
          {t("Password")}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            aria-label={t("Password")}
            className="w-full px-3 py-2 border rounded mt-1"
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? t("Logging in...") : t("Login")}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {t("Don't have an account?")}{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          {t("Register")}
        </Link>
      </p>
    </div>
  );
}

export default Login;
