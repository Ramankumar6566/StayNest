import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProperties } from "../context/PropertyContext";

function Reserve() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getPropertyById } = useProperties();

  const property = getPropertyById(id);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  if (!property) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Property not found</h1>

        <button onClick={() => navigate("/")}>Go Home</button>
      </main>
    );
  }

  const price = Number(property.price || 0);

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    const bookingData = {
      property: property._id,
      checkIn,
      checkOut,
      guests: Number(guests),
    };

    console.log("BOOKING DATA:", bookingData);

    // Booking page par bhejo
    navigate("/bookings", {
      state: {
        bookingData,
        property,
      },
    });
  };

  return (
    <main className="reserve-page">
      <div className="reserve-container">
        <h1>Reserve your stay</h1>

        <div className="reserve-property">
          <img src={property.images?.[0]} alt={property.title} />

          <div>
            <h2>{property.title}</h2>

            <p>
              {property.location}
              {property.city ? `, ${property.city}` : ""}
            </p>

            <h3>₹{price.toLocaleString("en-IN")} / night</h3>
          </div>
        </div>

        <div className="booking-form">
          <label>Check-in</label>

          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />

          <label>Check-out</label>

          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />

          <label>Guests</label>

          <input
            type="number"
            min="1"
            max={property.guests || 10}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />

          <button type="button" onClick={handleReserve}>
            Continue to Booking
          </button>
        </div>
      </div>
    </main>
  );
}

export default Reserve;