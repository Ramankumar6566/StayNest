import { useState } from "react";

import SearchBar from "../components/SearchBar";
import CategoryNav from "../components/CategoryNav";
import PropertyRow from "../components/PropertyRow";
import Loader from "../components/Loader";

import { useProperties } from "../context/PropertyContext";

import "./Home.css";

function Home() {
  const { properties, categories, loading, error } = useProperties();

  const [selected, setSelected] = useState("All");

  const filtered =
    selected === "All"
      ? properties
      : properties.filter((property) => property.category === selected);

  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-badge">✦ Discover your perfect stay</div>

          <h1>
            Find a place
            <br />
            <span>you'll love to stay.</span>
          </h1>

          <p>
            Beautiful homes, unique spaces and memorable stays — all in one
            place.
          </p>

          <SearchBar />
        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section className="explore-section">
        <div className="section-heading">
          <div>
            <p className="small-heading">EXPLORE STAYS</p>

            <h2>Find your perfect place</h2>
          </div>

          <p>{properties.length} properties available</p>
        </div>

        {/* CATEGORY NAVIGATION */}
        <CategoryNav
          categories={categories}
          selected={selected}
          onSelect={setSelected}
        />

        {/* PROPERTY LIST */}
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="empty-properties">
            <div>⚠️</div>

            <h3>Unable to load properties</h3>

            <p>{error}</p>
          </div>
        ) : (
          <PropertyRow properties={filtered} />
        )}
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="experience-section">
        <div className="experience-copy">
          <p className="small-heading">THE STAYNEST EXPERIENCE</p>

          <h2>
            More than a stay.
            <br />
            It's a memory.
          </h2>

          <p>
            From peaceful cabins to vibrant city apartments, StayNest helps you
            find spaces that match the way you want to travel.
          </p>

          <div className="experience-points">
            <div>
              <b>01</b>
              <span>Explore unique stays</span>
            </div>

            <div>
              <b>02</b>
              <span>Book with confidence</span>
            </div>

            <div>
              <b>03</b>
              <span>Enjoy the journey</span>
            </div>
          </div>
        </div>

        <div className="experience-image">
          <img
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1100&q=85"
            alt="Beautiful interior"
          />
        </div>
      </section>

      {/* WHY STAYNEST */}
      <section className="why-section">
        <div className="why-header">
          <p className="small-heading">WHY STAYNEST</p>

          <h2>Everything you need for a great stay.</h2>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div>⌂</div>

            <h3>Unique Homes</h3>

            <p>
              Discover apartments, villas, cabins and homes with personality.
            </p>
          </div>

          <div className="why-card">
            <div>✓</div>

            <h3>Simple Booking</h3>

            <p>Search, choose and reserve your next stay in a few clicks.</p>
          </div>

          <div className="why-card">
            <div>₹</div>

            <h3>Great Value</h3>

            <p>Find comfortable stays across different budgets.</p>
          </div>

          <div className="why-card">
            <div>★</div>

            <h3>Trusted Ratings</h3>

            <p>Use guest ratings to make better travel decisions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;