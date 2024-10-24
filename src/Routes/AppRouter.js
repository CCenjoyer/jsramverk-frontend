/**
 * React Components
 */
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/**
 * Common Includes
 */
import Menu from "../Components/Common/Menu";
import Footer from "../Components/Common/Footer";

/**
 * Components Pages
 */
import Index from "../Components/Index";
import Update from "../Components/Page/Update";
import About from "../Components/Page/About";
import Contact from "../Components/Page/Contact";
import Create from "../Components/Page/Create";
import Login from "../Components/Page/Login";

function AppRouter() {
  const basename = window.location.hostname.includes('student.bth.se') ? '/~josf23/editor' : '/';

  return (
    <Router basename={basename}>
      <header>
        <Menu />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/update/:id" element={<Update />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
          <Route path="/create" element={<Create />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default AppRouter;
