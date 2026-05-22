import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  HiHome,
  HiLightBulb,
  HiDocumentText,
  HiTableCells,
} from "react-icons/hi2";
import { HiMenu } from "react-icons/hi";
import { HiOutlineChevronDoubleLeft } from "react-icons/hi2";
import { ThemeToggle } from "../ui";
import { paperUrl } from "../../data/docs";
import logo from "../../assets/images/logo-head-nbg.svg";
import "./Sidebar.scss";

const navItems = [
  { path: "/", label: "Home", icon: HiHome },
  { path: "/quickview", label: "Insight", icon: HiLightBulb },
  { path: "/support", label: "Docs", icon: HiDocumentText },
  { path: "/project", label: "Full View", icon: HiTableCells },
];

const Sidebar = ({ isOpen, isMobile, toggleSidebar, onNavigate }) => {
  const location = useLocation();
  const year = new Date().getFullYear();

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <>
      <button
        type="button"
        className={`sidebar-menu-btn ${!isOpen ? "visible" : ""}`}
        onClick={toggleSidebar}
        aria-label="Open menu"
      >
        <HiMenu />
      </button>

      <aside
        className={`sidebar ${isOpen ? "open" : "closed"} ${
          isMobile ? "mobile" : ""
        }`}
      >
        <div className="sidebar__brand">
          <img src={logo} alt="ECO" className="sidebar__logo" />
          <div className="sidebar__brand-text">
            <span className="sidebar__name">ECO</span>
            <span className="sidebar__tagline">Carbon Observer</span>
          </div>
          <button
            type="button"
            className="sidebar__close"
            onClick={toggleSidebar}
            aria-label="Close menu"
          >
            <HiOutlineChevronDoubleLeft />
          </button>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`sidebar__link ${isActive(path) ? "active" : ""}`}
              onClick={onNavigate}
            >
              <Icon className="sidebar__link-icon" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar__socials">
          <a
            href="https://www.linkedin.com/in/favourdo/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/dfoshidero"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.youtube.com/channel/UCo1pWemz1x8KK653FrgUKHw"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>
        </div>

        <div className="sidebar__footer">
          <ThemeToggle />
          <p className="sidebar__copyright">
            © {year} Daniel Favour Oshidero
            <br />
            <a href="https://www.dfvro.com" target="_blank" rel="noreferrer">
              dfvro.com
            </a>
          </p>
          <a
            href={paperUrl}
            target="_blank"
            rel="noreferrer"
            className="sidebar__paper"
          >
            Read the paper <FaExternalLinkAlt />
          </a>
          <a
            href="https://github.com/dfoshidero/ECO-Insight"
            target="_blank"
            rel="noreferrer"
            className="sidebar__repo"
          >
            View repository <FaExternalLinkAlt />
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
