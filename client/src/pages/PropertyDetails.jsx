import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useProperties } from "../context/PropertyContext";

import "./PropertyDetails.css";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    properties,
    loading: propertiesLoading,
    getPropertyById,
    getLocationText,
  } = useProperties();

  // =====================================================
  // STATE
  // =====================================================

  const [property, setProperty] = useState(null);

  const [loadingProperty, setLoadingProperty] = useState(true);

  const [propertyError, setPropertyError] = useState("");

  const [reviews, setReviews] = useState([]);

  const [reviewsLoading, setReviewsLoading] = useState(false);

  const [reviewError, setReviewError] = useState("");

  const [liked, setLiked] = useState(false);

  const [checkIn, setCheckIn] = useState("");

  const [checkOut, setCheckOut] = useState("");

  const [guests, setGuests] = useState(1);

  // =====================================================
  // FIND PROPERTY
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadProperty = async () => {
      setPropertyError("");

      // First try context
      const contextProperty = getPropertyById(id);

      if (contextProperty) {
        if (!cancelled) {
          setProperty(contextProperty);
          setLoadingProperty(false);
        }

        return;
      }

      // If context is still loading, wait
      if (propertiesLoading) {
        return;
      }

      // Fallback: fetch directly from API
      try {
        setLoadingProperty(true);

        const response = await fetch(`${API_URL}/properties/${id}`);

        const contentType = response.headers.get("content-type") || "";

        const data = contentType.includes("application/json")
          ? await response.json()
          : await response.text();

        if (!response.ok) {
          throw new Error(
            typeof data === "object" && data?.message
              ? data.message
              : "Failed to load property",
          );
        }

        const fetchedProperty = data?.property || data?.data || data;

        if (
          !fetchedProperty ||
          typeof fetchedProperty !== "object" ||
          !fetchedProperty._id
        ) {
          throw new Error("Property not found");
        }

        if (!cancelled) {
          setProperty(fetchedProperty);
        }
      } catch (error) {
        console.error("PROPERTY DETAILS ERROR:", error);

        if (!cancelled) {
          setProperty(null);
          setPropertyError(error.message || "Failed to load property");
        }
      } finally {
        if (!cancelled) {
          setLoadingProperty(false);
        }
      }
    };

    if (id) {
      loadProperty();
    } else {
      setProperty(null);
      setPropertyError("Property ID is missing.");
      setLoadingProperty(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id, propertiesLoading, getPropertyById]);

  // =====================================================
  // WISHLIST STATUS
  // =====================================================

  useEffect(() => {
    if (!property) {
      setLiked(false);
      return;
    }

    try {
      const list = JSON.parse(localStorage.getItem("staynest_wishlist")) || [];

      const propertyId = property._id || property.id;

      const exists = list.some(
        (item) => String(item?._id || item?.id) === String(propertyId),
      );

      setLiked(exists);
    } catch (error) {
      console.error("Wishlist read error:", error);

      setLiked(false);
    }
  }, [property]);

  // =====================================================
  // FETCH REVIEWS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      if (!property?._id) {
        setReviews([]);
        return;
      }

      try {
        setReviewsLoading(true);
        setReviewError("");

        const response = await fetch(
          `${API_URL}/reviews/property/${property._id}`,
        );

        const contentType = response.headers.get("content-type") || "";

        const data = contentType.includes("application/json")
          ? await response.json()
          : await response.text();

        if (!response.ok) {
          throw new Error(
            typeof data === "object" && data?.message
              ? data.message
              : "Failed to get reviews",
          );
        }

        const reviewList = Array.isArray(data)
          ? data
          : Array.isArray(data?.reviews)
            ? data.reviews
            : [];

        if (!cancelled) {
          setReviews(reviewList);
        }
      } catch (error) {
        console.error("REVIEWS ERROR:", error);

        if (!cancelled) {
          setReviews([]);
          setReviewError(error.message || "Failed to load reviews");
        }
      } finally {
        if (!cancelled) {
          setReviewsLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [property?._id]);

  // =====================================================
  // MEMOS
  // =====================================================

  const images = useMemo(() => {
    if (!property || !Array.isArray(property.images)) {
      return [];
    }

    return property.images.filter(Boolean);
  }, [property]);

  const location = useMemo(() => {
    if (!property) {
      return "";
    }

    if (typeof getLocationText === "function") {
      const text = getLocationText(property);

      if (text) {
        return text;
      }
    }

    if (typeof property.location === "string") {
      return property.location;
    }

    if (property.location && typeof property.location === "object") {
      return [
        property.location.city,
        property.location.state,
        property.location.country,
      ]
        .filter(Boolean)
        .join(", ");
    }

    return property.city || "India";
  }, [property, getLocationText]);

  const propertyId = property?._id || property?.id;

  const maxGuests = Number(property?.guests || 1);

  const pricePerNight = Number(property?.price || 0);

  // =====================================================
  // NUMBER OF NIGHTS
  // =====================================================

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference = end.getTime() - start.getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  // =====================================================
  // PRICE
  // =====================================================

  const subtotal = nights > 0 ? pricePerNight * nights : pricePerNight;

  const serviceFee = nights > 0 ? Math.round(subtotal * 0.1) : 0;

  const total = subtotal + serviceFee;

  // =====================================================
  // MIN DATE
  // =====================================================

  const today = new Date().toISOString().split("T")[0];

  // =====================================================
  // WISHLIST
  // =====================================================

  const toggleWishlist = () => {
    if (!property) {
      return;
    }

    try {
      let list = JSON.parse(localStorage.getItem("staynest_wishlist")) || [];

      const currentId = property._id || property.id;

      const exists = list.some(
        (item) => String(item?._id || item?.id) === String(currentId),
      );

      if (exists) {
        list = list.filter(
          (item) => String(item?._id || item?.id) !== String(currentId),
        );

        setLiked(false);
      } else {
        list.push(property);
        setLiked(true);
      }

      localStorage.setItem("staynest_wishlist", JSON.stringify(list));
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  // =====================================================
  // RESERVE
  // =====================================================

  const handleReserve = () => {
    if (!propertyId) {
      alert("Property ID is missing.");
      return;
    }

    if (!checkIn) {
      alert("Please select check-in date.");
      return;
    }

    if (!checkOut) {
      alert("Please select check-out date.");
      return;
    }

    if (nights <= 0) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    if (guests < 1 || guests > maxGuests) {
      alert(`This property allows maximum ${maxGuests} guests.`);
      return;
    }

    // Navigate to bookings page
    navigate(
      `/bookings?propertyId=${encodeURIComponent(
        propertyId,
      )}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(
        checkOut,
      )}&guests=${guests}`,
    );
  };

  // =====================================================
  // SHARE
  // =====================================================

  const handleShare = async () => {
    try {
      const url = window.location.href;

      if (navigator.share && typeof navigator.share === "function") {
        await navigator.share({
          title: property?.title || "StayNest Property",
          text: property?.description || "Check out this stay on StayNest.",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);

        alert("Property link copied!");
      }
    } catch (error) {
      console.log("Share cancelled or failed:", error);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingProperty || propertiesLoading) {
    return (
      <main className="property-details-loading">
        <div className="details-loader"></div>

        <h2>Loading property...</h2>

        <p>Please wait while we load the stay.</p>
      </main>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!property) {
    return (
      <main className="property-not-found">
        <div className="not-found-card">
          <div className="not-found-icon">🏡</div>

          <h1>Property Not Found</h1>

          <p>
            {propertyError ||
              "The property you are looking for does not exist."}
          </p>

          <Link to="/" className="details-back-btn">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <main className="property-details-page">
      <div className="details-container">
        {/* ==========================================
            TOP ACTIONS
        ========================================== */}

        <div className="details-top-actions">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="top-action-buttons">
            <button type="button" className="share-btn" onClick={handleShare}>
              ↗ Share
            </button>

            <button
              type="button"
              className={`save-btn ${liked ? "saved" : ""}`}
              onClick={toggleWishlist}
            >
              {liked ? "♥ Saved" : "♡ Save"}
            </button>
          </div>
        </div>

        {/* ==========================================
            TITLE
        ========================================== */}

        <section className="details-heading">
          <div>
            <p className="details-location">📍 {location}</p>

            <h1>{property.title || "Beautiful Stay"}</h1>

            <p className="details-short-info">
              {property.guests || 1} guests · {property.bedrooms || 1} bedrooms
              · {property.beds || 1} beds · {property.bathrooms || 1} bathrooms
            </p>

            <div className="rating-row">
              <span>★ {property.rating || "4.8"}</span>

              <span>·</span>

              <span>{property.reviews || 0} reviews</span>
            </div>
          </div>
        </section>

        {/* ==========================================
            GALLERY
        ========================================== */}

        <section className="property-gallery">
          <div className="main-property-image">
            <img
              src={
                images[0] ||
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
              }
              alt={property.title || "Property"}
              onError={(event) => {
                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85";
              }}
            />
          </div>

          <div className="property-small-images">
            {(images.length > 1
              ? images.slice(1, 5)
              : [
                  images[0] ||
                    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=800&q=85",
                ]
            ).map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${property.title || "Property"} ${index + 2}`}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src =
                    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=800&q=85";
                }}
              />
            ))}
          </div>
        </section>

        {/* ==========================================
            DETAILS LAYOUT
        ========================================== */}

        <div className="details-layout">
          {/* ========================================
              LEFT CONTENT
          ======================================== */}

          <div className="details-main">
            {/* ABOUT */}
            <section className="details-section">
              <h2>About this place</h2>

              <p>
                {property.description ||
                  "Enjoy a comfortable and relaxing stay at this beautiful property."}
              </p>
            </section>

            {/* OFFERS */}
            <section className="details-section">
              <h2>What this place offers</h2>

              <div className="amenity-grid">
                {Array.isArray(property.amenities) &&
                property.amenities.length > 0 ? (
                  property.amenities.map((amenity, index) => (
                    <div className="amenity-item" key={`${amenity}-${index}`}>
                      <span>✓</span>

                      <span>
                        {typeof amenity === "string"
                          ? amenity
                          : amenity?.name || "Amenity"}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="amenity-item">
                      <span>🛏</span>
                      <span>Comfortable beds</span>
                    </div>

                    <div className="amenity-item">
                      <span>👨‍👩‍👧</span>
                      <span>Guests welcome</span>
                    </div>

                    <div className="amenity-item">
                      <span>🏠</span>
                      <span>Entire property</span>
                    </div>

                    <div className="amenity-item">
                      <span>📍</span>
                      <span>Great location</span>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* PROPERTY DETAILS */}
            <section className="details-section">
              <h2>Property details</h2>

              <div className="property-detail-grid">
                <div>
                  <span>👥</span>
                  <strong>Guests</strong>
                  <p>{property.guests || 1}</p>
                </div>

                <div>
                  <span>🛏</span>
                  <strong>Bedrooms</strong>
                  <p>{property.bedrooms || 1}</p>
                </div>

                <div>
                  <span>🛌</span>
                  <strong>Beds</strong>
                  <p>{property.beds || 1}</p>
                </div>

                <div>
                  <span>🚿</span>
                  <strong>Bathrooms</strong>
                  <p>{property.bathrooms || 1}</p>
                </div>

                <div>
                  <span>🏷️</span>
                  <strong>Category</strong>
                  <p>{property.category || "Stay"}</p>
                </div>

                <div>
                  <span>📍</span>
                  <strong>Location</strong>
                  <p>{location || "India"}</p>
                </div>
              </div>
            </section>

            {/* REVIEWS */}
            <section className="details-section reviews-section">
              <div className="reviews-heading">
                <div>
                  <h2>Reviews ({property.reviews || reviews.length || 0})</h2>

                  <div className="big-rating">★ {property.rating || "4.8"}</div>
                </div>
              </div>

              {reviewsLoading && (
                <p className="reviews-loading">Loading reviews...</p>
              )}

              {!reviewsLoading && reviewError && (
                <p className="review-error">{reviewError}</p>
              )}

              {!reviewsLoading && !reviewError && reviews.length === 0 && (
                <div className="no-reviews">
                  <h3>No reviews yet</h3>

                  <p>Be the first person to review this stay.</p>
                </div>
              )}

              {!reviewsLoading && reviews.length > 0 && (
                <div className="reviews-list">
                  {reviews.map((review, index) => (
                    <article className="review-card" key={review._id || index}>
                      <div className="review-top">
                        <strong>
                          {review.user?.name ||
                            review.user?.username ||
                            review.name ||
                            "Guest"}
                        </strong>

                        <span>★ {review.rating || 5}</span>
                      </div>

                      <p>{review.comment || review.text || "Great stay!"}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ========================================
              BOOKING CARD
          ======================================== */}

          <aside className="booking-card">
            <div className="booking-price">
              <strong>₹{pricePerNight.toLocaleString("en-IN")}</strong>

              <span>/ night</span>
            </div>

            {/* DATES */}
            <div className="booking-form">
              <div className="date-grid">
                <div className="form-group">
                  <label htmlFor="checkIn">Check-in</label>

                  <input
                    id="checkIn"
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(event) => setCheckIn(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="checkOut">Check-out</label>

                  <input
                    id="checkOut"
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(event) => setCheckOut(event.target.value)}
                  />
                </div>
              </div>

              {/* GUESTS */}
              <div className="form-group">
                <label htmlFor="guests">Guests</label>

                <input
                  id="guests"
                  type="number"
                  min="1"
                  max={maxGuests}
                  value={guests}
                  onChange={(event) => {
                    const value = Number(event.target.value);

                    if (value >= 1 && value <= maxGuests) {
                      setGuests(value);
                    }
                  }}
                />

                <small>Maximum {maxGuests} guests</small>
              </div>
            </div>

            {/* PRICE SUMMARY */}
            {nights > 0 && (
              <div className="price-summary">
                <div>
                  <span>
                    ₹{pricePerNight.toLocaleString("en-IN")} × {nights} night
                    {nights > 1 ? "s" : ""}
                  </span>

                  <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                </div>

                <div>
                  <span>Service fee</span>

                  <strong>₹{serviceFee.toLocaleString("en-IN")}</strong>
                </div>

                <div className="price-total">
                  <span>Total</span>

                  <strong>₹{total.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            )}

            {/* RESERVE */}
            <button
              type="button"
              className="reserve-btn"
              onClick={handleReserve}
            >
              Reserve
            </button>

            <p className="booking-note">You won't be charged yet</p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default PropertyDetails;
