import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.scss";

const MOBILE_BREAKPOINT = 1024;

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= MOBILE_BREAKPOINT
  );
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((o) => !o);
  const closeSidebar = () => {
    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <div
      className={`app-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"} ${
        isMobile ? "is-mobile" : ""
      }`}
    >
      {isMobile && isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <Sidebar
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        onNavigate={closeSidebar}
      />
      <div className="app-layout__main">
        <div className="app-layout__content">
          <div className="app-layout__page">{children}</div>
          <footer className="app-layout__footer">
            <small>
              ECO is a proof of concept — verify predictions in Full View before
              critical decisions.
            </small>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
