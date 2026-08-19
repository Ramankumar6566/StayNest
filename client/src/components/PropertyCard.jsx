 

import { useState } from "react";
import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  const id = property._id || property.id;

  const [liked, setLiked] = useState(() => {
    try {
      const list = JSON.parse(localStorage.getItem("staynest_wishlist")) || [];

      return list.some((item) => String(item._id || item.id) === String(id));
    } catch {
      return false;
    }
  });

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let list = [];

    try {
      list = JSON.parse(localStorage.getItem("staynest_wishlist")) || [];
    } catch {
      list = [];
    }

    const exists = list.some(
      (item) => String(item._id || item.id) === String(id),
    );

    const next = exists
      ? list.filter((item) => String(item._id || item.id) !== String(id))
      : [...list, property];

    localStorage.setItem("staynest_wishlist", JSON.stringify(next));

    setLiked(!exists);
  };

  const image =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85";

  const price = Number(property.price || 0);

  const location =
    typeof property.location === "string"
      ? property.location
      : property.location?.city || "India";

  return (
    <article className="property-card">
      {/* IMAGE */}
      <div className="property-image-wrap">
        <Link to={`/property/${id}`}>
          <img
            className="property-image"
            src={image}
            alt={property.title || "Stay"}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85";
            }}
          />
        </Link>

        {/* WISHLIST */}
        <button
          type="button"
          className={`heart-button ${liked ? "liked" : ""}`}
          onClick={toggleWishlist}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          {liked ? "♥" : "♡"}
        </button>

        {/* CATEGORY */}
        {property.category && (
          <span className="card-category">{property.category}</span>
        )}
      </div>

      {/* PROPERTY CONTENT */}
      <Link to={`/property/${id}`} className="property-content">
        <div className="property-title-row">
          <h3>{property.title || "Beautiful Stay"}</h3>

          <span className="rating">★ {property.rating || "4.8"}</span>
        </div>

        {/* LOCATION */}
        <p className="property-location">
          ⌖ {location}
          {property.city ? `, ${property.city}` : ""}
        </p>

        {/* DETAILS */}
        <p className="property-meta">
          {property.guests || 2} guests · {property.bedrooms || 1} bedrooms ·{" "}
          {property.beds || 1} beds · {property.bathrooms || 1} bathrooms
        </p>

        {/* PRICE */}
        <p className="property-price">
          ₹{price.toLocaleString("en-IN")}
          <span> / night</span>
        </p>

        {/* REVIEWS */}
        {property.reviews !== undefined && (
          <p
            style={{
              marginTop: "5px",
              fontSize: "12px",
              color: "#777",
            }}
          >
            {property.reviews} reviews
          </p>
        )}
      </Link>
    </article>
  );
}

export default PropertyCard;