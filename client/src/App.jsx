import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import SearchResults from "./pages/SearchResults";
import Bookings from "./pages/Bookings";
import Wishlist from "./pages/Wishlist";
import Host from "./pages/Host";

// Reservation page
import Reserve from "./pages/Reserve";

import "./App.css";

function App() {
  return (
    <div className="app">
      {/* ================================
          NAVBAR
      ================================= */}
      <Navbar />

      {/* ================================
          MAIN CONTENT
      ================================= */}
      <main>
        <Routes>
          {/* ================================
              HOME
          ================================= */}
          <Route path="/" element={<Home />} />

          {/* ================================
              AUTH
          ================================= */}
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* ================================
              PROPERTY DETAILS
          ================================= */}
          <Route path="/property/:id" element={<PropertyDetails />} />

          {/* ================================
              SEARCH
          ================================= */}
          <Route path="/search" element={<SearchResults />} />

          {/* ================================
              RESERVATION
          ================================= */}
          <Route path="/reserve/:id" element={<Reserve />} />

          {/* ================================
              BOOKINGS
          ================================= */}
          <Route path="/bookings" element={<Bookings />} />

          {/* ================================
              WISHLIST
          ================================= */}
          <Route path="/wishlist" element={<Wishlist />} />

          {/* ================================
              HOST
          ================================= */}
          <Route path="/host" element={<Host />} />

          {/* ================================
              404 PAGE
          ================================= */}
          <Route
            path="*"
            element={
              <div className="not-found">
                <div className="not-found-content">
                  <div className="not-found-icon">🏡</div>

                  <h1>Page Not Found</h1>

                  <p>The page you are looking for does not exist.</p>

                  <a href="/" className="back-home-btn">
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      {/* ================================
          FOOTER
      ================================= */}
      <Footer />
    </div>
  );
}

export default App;