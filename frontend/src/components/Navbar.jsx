import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiArrowRight,
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
        </Link>


        {/* ================= DESKTOP NAV ================= */}

        <div className="nav-links">

          <Link
            to="/"
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/student"
            onClick={closeMenu}
          >
            Student / Job Vacancy
          </Link>

          <Link
            to="/student"
            className="nav-start-btn"
            onClick={closeMenu}
          >
            Let's Start
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
        >
          Home
        </Link>

        <Link
          to="/student"
          onClick={closeMenu}
        >
          Student / Job Vacancy
        </Link>

        <Link
          to="/student"
          className="mobile-start-btn"
          onClick={closeMenu}
        >
          Let's Start
          <FiArrowRight />
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;