import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getToken, clearToken } from "../utils/api";

const icons = {
  Home: (
    <svg
      className="w-6 h-6 mx-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v11a1 1 0 01-1 1h-3m-4 0h4"
      />
    </svg>
  ),
  Profile: (
    <svg
      className="w-6 h-6 mx-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.121 17.804A10 10 0 0112 2a10 10 0 016.879 15.804M19 21v-2a4 4 0 00-3-3.87M5 21v-2a4 4 0 013-3.87"
      />
    </svg>
  ),
  Admin: (
    <svg
      className="w-6 h-6 mx-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8m-4-4v8" />
    </svg>
  ),
  Login: (
    <svg
      className="w-6 h-6 mx-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m6-6v12" />
    </svg>
  ),
  Register: (
    <svg
      className="w-6 h-6 mx-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 20v-2a4 4 0 00-8 0v2"
      />
    </svg>
  ),
  Logout: (
    <svg
      className="w-6 h-6 mx-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7"
      />
    </svg>
  ),
  WhatsApp: (
    <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 32 32">
      <path d="M16.002 2.925c-7.258 0-13.151 5.796-13.151 12.943 0 2.287.633 4.562 1.836 6.551L2 30l7.837-2.485a13.25 13.25 0 006.165 1.548h.001c7.257 0 13.15-5.796 13.15-12.943 0-7.147-5.893-12.943-13.15-12.943zm-.002 24.127h-.001a11.355 11.355 0 01-5.765-1.532l-.413-.244-4.651 1.475 1.516-4.544-.269-.435a10.094 10.094 0 01-1.71-5.682c0-5.647 4.763-10.246 10.626-10.246 5.863 0 10.627 4.599 10.627 10.246 0 5.647-4.764 10.247-10.627 10.247zm5.925-7.747c-.146-.074-.861-.425-1.003-.475-.134-.049-.232-.074-.33.075-.096.146-.379.475-.464.574-.087.098-.172.11-.318.037-.146-.074-.616-.227-1.172-.725-.434-.386-.726-.864-.813-1.011-.087-.146-.009-.225.065-.298.067-.067.146-.174.22-.261.073-.087.098-.15.147-.25.049-.099.024-.186-.013-.261-.038-.074-.33-.795-.452-1.087-.119-.288-.239-.249-.332-.251-.087-.002-.188-.002-.288-.002a.555.555 0 00-.402.187c-.138.146-.53.517-.53 1.263 0 .746.543 1.464.619 1.564.076.099 1.068 1.632 2.592 2.225.363.15.646.238.867.306a2.104 2.104 0 00.872.055c.266-.04.81-.332.923-.653.113-.321.113-.595.08-.653-.032-.056-.134-.087-.28-.161z" />
    </svg>
  ),
  Instagram: (
    <svg
      className="w-6 h-6 mx-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 48 48"
    >
      <rect width="36" height="36" x="6" y="6" rx="8" fill="none" />
      <circle cx="24" cy="24" r="8" />
      <circle cx="32.5" cy="15.5" r="2.5" />
    </svg>
  ),
  Language: (
    <svg className="w-8 h-8 mx-auto" viewBox="0 0 40 40" fill="none">
      <rect x="1" y="10" width="38" height="20" rx="10" fill="#f1f5f9" />
      <rect x="1" y="10" width="19" height="20" rx="10" fill="#2563eb" />
      <text
        x="8"
        y="25"
        fontSize="10"
        fontWeight="bold"
        fill="#fff"
        fontFamily="Segoe UI, Arial"
      >
        EN
      </text>
      <text
        x="26"
        y="25"
        fontSize="10"
        fontWeight="bold"
        fill="#64748b"
        fontFamily="Segoe UI, Arial"
      >
        HI
      </text>
    </svg>
  ),
};

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const loggedIn = !!getToken();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  // language toggle handler using correct i18n instance
  const handleLangToggle = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <>
      {/* Top Navbar (desktop only) */}
      <nav className="bg-white shadow-md hidden md:flex">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="font-bold text-xl text-blue-600">
            PG Radar
          </Link>
          <div className="flex gap-3 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "px-3 py-2 rounded hover:bg-blue-100 " +
                (isActive ? "bg-blue-200 font-semibold" : "")
              }
            >
              {t("Home")}
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                "px-3 py-2 rounded hover:bg-blue-100 " +
                (isActive ? "bg-blue-200 font-semibold" : "")
              }
            >
              {t("Profile")}
            </NavLink>
            {loggedIn && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  "px-3 py-2 rounded hover:bg-blue-100 " +
                  (isActive ? "bg-blue-200 font-semibold" : "")
                }
              >
                {t("Admin")}
              </NavLink>
            )}
            <a
              href="https://wa.me/918800000000"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              {icons.WhatsApp}
            </a>
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              {icons.Instagram}
            </a>
            <button
              onClick={handleLangToggle}
              aria-label="Switch Language"
              className="ml-1 px-2 py-2 rounded focus:outline-none hover:bg-blue-100"
            >
              
              {i18n.language === "en" ? "हिंदी" : "EN"}
            </button>
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                {t("Logout")}
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    "px-3 py-2 rounded hover:bg-blue-100 " +
                    (isActive ? "bg-blue-200 font-semibold" : "")
                  }
                >
                  {t("Login")}
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    "px-3 py-2 rounded hover:bg-blue-100 " +
                    (isActive ? "bg-blue-200 font-semibold" : "")
                  }
                >
                  {t("Register")}
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Navbar (mobile/tablet only) */}
      <nav className="fixed bottom-0 z-100 w-full bg-white border-t shadow flex md:hidden">
        <NavLink
          to="/"
          className="flex-1 flex flex-col items-center py-2"
          aria-label={t("Home")}
        >
          {icons.Home}
          <span className="text-xs">{t("Home")}</span>
        </NavLink>
        <NavLink
          to="/profile"
          className="flex-1 flex flex-col items-center py-2"
          aria-label={t("Profile")}
        >
          {icons.Profile}
          <span className="text-xs">{t("Profile")}</span>
        </NavLink>
        {loggedIn && (
          <NavLink
            to="/admin"
            className="flex-1 flex flex-col items-center py-2"
            aria-label={t("Admin")}
          >
            {icons.Admin}
            <span className="text-xs">{t("Admin")}</span>
          </NavLink>
        )}
        {/* <a
          href="https://wa.me/918800000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center py-2"
          aria-label="WhatsApp"
        >
          {icons.WhatsApp}
          <span className="text-xs">WhatsApp</span>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center py-2"
          aria-label="Instagram"
        >
          {icons.Instagram}
          <span className="text-xs">Instagram</span>
        </a> */}
        <button
          className="flex-1 flex flex-col items-center justify-center py-2"
          aria-label="Switch Language"
          onClick={handleLangToggle}
        >
          {icons.Language}
          <span className="text-xs">
            {i18n.language === "en" ? "हिंदी" : "EN"}
          </span>
        </button>

        {loggedIn ? (
          <button
            className="flex-1 flex flex-col items-center py-2"
            aria-label={t("Logout")}
            onClick={handleLogout}
          >
            {icons.Logout}
            <span className="text-xs">{t("Logout")}</span>
          </button>
        ) : (
          <>
            <NavLink
              to="/login"
              className="flex-1 flex flex-col items-center py-2"
              aria-label={t("Login")}
            >
              {icons.Login}
              <span className="text-xs">{t("Login")}</span>
            </NavLink>
            <NavLink
              to="/register"
              className="flex-1 flex flex-col items-center py-2"
              aria-label={t("Register")}
            >
              {icons.Register}
              <span className="text-xs">{t("Register")}</span>
            </NavLink>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
