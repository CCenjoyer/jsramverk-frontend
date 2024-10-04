/**
 * React Compontents
 */
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

/**
 * Common Include
 */
import Menu from "../Components/Common/Menu";
import Footer from "../Components/Common/Footer";

/**
 * Compontents Pages
 */
import Home from "../Components/Home";
import About from "../Components/Page/About";
import Contact from "../Components/Page/Contact";

function AppRouter() {
  return (
    <Router basename={"/"}>
      <header><Menu /></header>
      <main>
        <Route exact path={`/`} component={Home} />
        <Route path={`/about`} component={About} />
        <Route path={`/contact`} component={Contact} />
      </main>
      <Footer />
    </Router>
  );
}

export default AppRouter;
