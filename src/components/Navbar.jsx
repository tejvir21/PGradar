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
  GitHub: (
    <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 32 32">
      <path d="M16 2.4c-7.5 0-13.6 6.1-13.6 13.6 0 6 3.9 11.1 9.4 12.9.7.1.9-.3.9-.7v-2.5c-3.8.8-4.6-1.7-4.6-1.7-.7-1.8-1.7-2.3-1.7-2.3-1.4-1 .1-1 .1-1 1.5.1 2.3 1.6 2.3 1.6 1.4 2.3 3.6 1.6 4.5 1.2.1-1 .5-1.6.9-2-3-.4-6.2-1.5-6.2-6.6 0-1.5.5-2.7 1.4-3.7-.1-.4-.6-1.9.1-3.9 0 0 1.1-.3 3.8 1.4a12.8 12.8 0 017 0c2.7-1.7 3.8-1.4 3.8-1.4.7 2 .2 3.5.1 3.9.9 1 1.4 2.3 1.4 3.7 0 5.1-3.2 6.2-6.2 6.6.5.4.9 1.2.9 2v3c0 .4.3.8.9.7 5.5-1.8 9.4-6.9 9.4-12.9 0-7.5-6.1-13.6-13.6-13.6z" />
    </svg>
  ),
  LinkedIn: (
    <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 32 32">
      <path d="M27 4H5C4 4 3 5 3 6v20c0 1 1 2 2 2h22c1 0 2-1 2-2V6c0-1-1-2-2-2zM10 24H6V12h4v12zM8 10a2 2 0 110-4 2 2 0 010 4zm18 14h-4v-5.7c0-1.4-.6-2.3-1.9-2.3-1.2 0-1.8.8-1.8 2.3V24h-4V12h4v1.6c.6-.9 1.6-1.8 3.3-1.8 2.4 0 4.4 1.5 4.4 5V24z" />
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
              href="https://github.com/tejvir21/pgradar"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              {icons.GitHub}
            </a>
            <a
              href="https://www.linkedin.com/in/tejvirchauhan219"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              {icons.LinkedIn}
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
