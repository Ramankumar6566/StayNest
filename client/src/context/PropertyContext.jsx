import { createContext, useContext, useEffect, useState } from "react";

const PropertyContext = createContext(null);

const API_URL = "http://localhost:5000/api";

const PROPERTY_API_URL = `${API_URL}/properties`;

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("================================");
      console.log("STAYNEST - FETCH PROPERTIES");
      console.log("URL:", PROPERTY_API_URL);
      console.log("================================");

      const response = await fetch(PROPERTY_API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("STATUS:", response.status);

      const data = await response.json();

      console.log("RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data?.message || `Server returned ${response.status}`);
      }

      if (data && data.success === true && Array.isArray(data.properties)) {
        setProperties(data.properties);

        console.log("SUCCESS - PROPERTIES:", data.properties.length);

        return;
      }

      if (Array.isArray(data)) {
        setProperties(data);

        console.log("SUCCESS - ARRAY:", data.length);

        return;
      }

      throw new Error("Invalid properties response");
    } catch (error) {
      console.error("================================");

      console.error("PROPERTY FETCH ERROR:", error);

      console.error("MESSAGE:", error.message);

      console.error("================================");

      setProperties([]);
      setError(error.message || "Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const getPropertyById = (id) => {
    if (!id) return null;

    return (
      properties.find(
        (property) =>
          String(property._id) === String(id) ||
          String(property.id) === String(id),
      ) || null
    );
  };

  const getLocationText = (property) => {
    if (!property) return "";

    if (typeof property.location === "object" && property.location !== null) {
      return [
        property.location.city,
        property.location.state,
        property.location.country,
      ]
        .filter(Boolean)
        .join(", ");
    }

    return String(property.location || property.city || "");
  };

  const searchProperties = ({ location = "", guests = 0 } = {}) => {
    const search = String(location).trim().toLowerCase();

    const guestCount = Number(guests || 0);

    return properties.filter((property) => {
      const locationText = getLocationText(property).toLowerCase();

      const title = String(property.title || "").toLowerCase();

      const city = String(property.city || "").toLowerCase();

      const category = String(property.category || "").toLowerCase();

      const locationMatch =
        search === "" ||
        locationText.includes(search) ||
        title.includes(search) ||
        city.includes(search) ||
        category.includes(search);

      const propertyGuests = Number(property.guests || 0);

      const guestsMatch = guestCount <= 0 || propertyGuests >= guestCount;

      return locationMatch && guestsMatch;
    });
  };

  const getPropertiesByLocation = (location) => {
    return searchProperties({
      location,
      guests: 0,
    });
  };

  const getPropertiesByCategory = (category) => {
    if (!category) {
      return properties;
    }

    return properties.filter(
      (property) =>
        String(property.category || "").toLowerCase() ===
        String(category).toLowerCase(),
    );
  };

  const filterByPrice = (minPrice = 0, maxPrice = Infinity) => {
    return properties.filter((property) => {
      const price = Number(property.price || 0);

      return price >= Number(minPrice) && price <= Number(maxPrice);
    });
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading,
        error,

        fetchProperties,

        getPropertyById,
        getLocationText,
        getPropertiesByLocation,
        searchProperties,
        getPropertiesByCategory,
        filterByPrice,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);

  if (!context) {
    throw new Error("useProperties must be used inside PropertyProvider");
  }

  return context;
}

export default PropertyContext;