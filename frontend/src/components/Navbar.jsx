import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiArrowRight,
  FiHome,
  FiBriefcase,
} from "react-icons/fi";

import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const closeMenu = () =>
    setMenuOpen(false);

  return (
    <nav className="navbar">

      <div className="nav-container">

        {/* ================= LOGO ================= */}

        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <img
            src="/logo.png"
            alt="Kalley CodeLabs"
            className="logo-image"
          />

          <div className="logo-text">

            <span className="logo-main">
              KALLEY
            </span>

            <span className="logo-sub">
              CODELABS
            </span>

          </div>

        </Link>


        {/* ================= DESKTOP NAV ================= */}

        <div className="nav-links">

          <Link
            to="/"
            onClick={closeMenu}
            className="nav-link-with-icon"
          >
            <FiHome />
            <span>
              Home
            </span>
          </Link>


          <Link
            to="/student"
            onClick={closeMenu}
            className="nav-link-with-icon"
          >
            <FiBriefcase />
            <span>
              Student / Job Vacancy
            </span>
          </Link>


          <Link
            to="/student"
            className="nav-start-btn"
            onClick={closeMenu}
          >
            <span>
              Let's Start
            </span>

            <FiArrowRight />
          </Link>

        </div>


        {/* ================= MOBILE MENU BUTTON ================= */}

        <button
          className="menu-btn"
          type="button"
          onClick={() =>
            setMenuOpen(
              !menuOpen
            )
          }
          aria-label={
            menuOpen
              ? "Close menu"
              : "Open menu"
          }
        >
          {menuOpen ? (
            <FiX />
          ) : (
            <FiMenu />
          )}
        </button>

      </div>


      {/* ================= MOBILE MENU ================= */}

      <div
        className={`mobile-menu ${
          menuOpen
            ? "show"
            : ""
        }`}
      >

        <Link
          to="/"
          onClick={closeMenu}
          className="mobile-nav-link"
        >
          <span>
            <FiHome />
            Home
          </span>
        </Link>


        <Link
          to="/student"
          onClick={closeMenu}
          className="mobile-nav-link"
        >
          <span>
            <FiBriefcase />
            Student / Job Vacancy
          </span>
        </Link>


        <Link
          to="/student"
          className="mobile-start-btn"
          onClick={closeMenu}
        >
          <span>
            Let's Start
          </span>

          <FiArrowRight />
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;