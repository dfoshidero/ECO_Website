import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import { ThemeProvider } from "./context/ThemeContext";
import { ModalProvider } from "./context/ModalContext";

import HomePage from "./home/Home";
import QuickView from "./pages/Insight/Insight";
import SupportPage from "./pages/Support/Support";
import Layout from "./components/Layout/Layout";
import Project from "./pages/Project/Project";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ModalProvider>
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout pageTitle="Home">
                    <HomePage />
                  </Layout>
                }
              />
              <Route
                path="/quickview"
                element={
                  <Layout pageTitle="Insight">
                    <QuickView />
                  </Layout>
                }
              />
              <Route
                path="/support"
                element={
                  <Layout pageTitle="More">
                    <SupportPage />
                  </Layout>
                }
              />
              <Route
                path="/project"
                element={
                  <Layout pageTitle="Full View">
                    <Project />
                  </Layout>
                }
              />
            </Routes>
          </main>
        </ModalProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
