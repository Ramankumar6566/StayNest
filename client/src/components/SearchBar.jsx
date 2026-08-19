import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SearchBar.css";

function SearchBar() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");

  const [guests, setGuests] = useState(1);

  const submit = (e) => {
    e.preventDefault();

    navigate(
      `/search?location=${encodeURIComponent(
        location.trim(),
      )}&guests=${guests}`,
    );
  };

  return (
    <form className="search-bar" onSubmit={submit}>
      <div className="search-field">
        <span className="search-icon">⌖</span>

        <div>
          <label>Where</label>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search destinations"
          />
        </div>
      </div>

      <div className="search-field">
        <span className="search-icon">♙</span>

        <div>
          <label>Guests</label>

          <input
            type="number"
            min="1"
            max="20"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>
      </div>

      <button className="search-button" type="submit">
        Search →
      </button>
    </form>
  );
}

export default SearchBar;