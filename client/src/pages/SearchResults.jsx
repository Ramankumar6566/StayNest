import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import PropertyRow from "../components/PropertyRow";
import Loader from "../components/Loader";

import { useProperties } from "../context/PropertyContext";

function SearchResults() {
  const [params] = useSearchParams();

  const locationParam = params.get("location") || "";
  const guestsParam = Number(params.get("guests") || 0);

  const { properties, loading, error, fetchProperties } = useProperties();

  const searchLocation = locationParam.trim().toLowerCase();

  const results = useMemo(() => {
    if (!Array.isArray(properties)) {
      return [];
    }

    return properties.filter((property) => {
      if (!property) {
        return false;
      }

      const location =
        typeof property.location === "object"
          ? [
              property.location?.city,
              property.location?.state,
              property.location?.country,
            ]
              .filter(Boolean)
              .join(" ")
          : String(property.location || "");

      const city = String(property.city || "");
      const title = String(property.title || "");
      const category = String(property.category || "");

      const locationText =
        `${location} ${city} ${title} ${category}`.toLowerCase();

      const locationMatch =
        searchLocation === "" || locationText.includes(searchLocation);

      const propertyGuests = Number(property.guests || 0);

      const guestsMatch = guestsParam <= 0 || propertyGuests >= guestsParam;

      return locationMatch && guestsMatch;
    });
  }, [properties, searchLocation, guestsParam]);

  console.log("================================");
  console.log("SEARCH RESULTS");
  console.log("All properties:", properties.length);
  console.log("Location:", searchLocation);
  console.log("Guests:", guestsParam);
  console.log("Results:", results.length);
  console.log("================================");

  return (
    <main className="search-results-page">
      <section className="search-results-header">
        <p className="small-heading">SEARCH RESULTS</p>

        <h1>
          {locationParam ? `Stays in ${locationParam}` : "Explore all stays"}
        </h1>

        {!loading && !error && (
          <p>
            {results.length} {results.length === 1 ? "property" : "properties"}{" "}
            available.
          </p>
        )}
      </section>

      <section className="search-results-content">
        {loading && <Loader />}

        {!loading && error && (
          <div className="empty-properties">
            <div>⚠️</div>

            <h3>Unable to load properties</h3>

            <p>{error}</p>

            <button type="button" onClick={fetchProperties}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <PropertyRow properties={results} />
        )}

        {!loading && !error && results.length === 0 && (
          <div className="empty-properties">
            <div>🔍</div>

            <h3>No properties found</h3>

            {locationParam ? (
              <p>
                No stays found for <strong>{locationParam}</strong>.
              </p>
            ) : (
              <p>No properties are currently available.</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default SearchResults;