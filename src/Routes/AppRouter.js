/**
 * React Components
 */
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

/**
 * Common Includes
 */
import Footer from "../Components/Common/Footer";
import Menu from "../Components/Common/Menu";

/**
 * Components Pages
 */
import Index from "../Components/Index";
import About from "../Components/Page/About";
import Contact from "../Components/Page/Contact";
import Create from "../Components/Page/Create";
import Document from "../Components/Page/Document";
import Login from "../Components/Page/Login";

function AppRouter() {
    const basename = window.location.hostname.includes("student.bth.se")
        ? "/~josf23/editor"
        : "/";

    return (
        <Router basename={basename}>
            <header>
                <Menu />
            </header>
            <main>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/document/:id" element={<Document />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="*" element={<h1>Page Not Found</h1>} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default AppRouter;
