import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { api } from "../services/api";

import "./Bookings.css";

function Bookings() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      try {
        const result = await api.getBookings();

        const data = Array.isArray(result)
          ? result
          : result?.bookings || result?.data || [];

        if (data.length) {
          setBookings(data);
          return;
        }
      } catch {}

      const saved = JSON.parse(localStorage.getItem("staynest_bookings")) || [];

      setBookings(
        saved.filter((booking) => !booking.user || booking.user === user.email),
      );
    }

    load();
  }, [user]);

  if (!user) {
    return (
      <div className="page-container center-page">
        <div>
          <h1>Login to view bookings</h1>

          <p>Your trips will appear here after you sign in.</p>

          <Link className="primary-link" to="/login">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <p className="small-heading">YOUR TRIPS</p>

        <h1>My Bookings</h1>

        <p>Keep track of your upcoming stays.</p>
      </div>

      {!bookings.length ? (
        <div className="empty-page">
          <div className="empty-page-icon">🧳</div>

          <h2>No bookings yet</h2>

          <p>Find a stay and your confirmed trips will appear here.</p>

          <Link className="primary-link" to="/search">
            Explore Stays
          </Link>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking, index) => {
            const property = booking.property || {};

            return (
              <div
                className="booking-item"
                key={booking._id || booking.id || index}
              >
                <img
                  src={
                    property.image ||
                    property.images?.[0] ||
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=700&q=85"
                  }
                  alt={property.title || "Stay"}
                />

                <div className="booking-info">
                  <span className="booking-status">Confirmed</span>

                  <h3>{property.title || "Your Stay"}</h3>

                  <p>⌖ {property.location || "India"}</p>

                  <p>
                    📅 {booking.checkIn || booking.date || "Date not available"}
                  </p>

                  <p>♙ {booking.guests || 1} guests</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Bookings;