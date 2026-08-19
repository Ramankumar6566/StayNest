import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Host.css";

// =====================================================
// API URL
// =====================================================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// =====================================================
// INITIAL FORM
// =====================================================

const initialForm = {
  title: "",
  description: "",

  city: "",
  state: "",
  country: "India",
  address: "",

  price: "",
  guests: "",
  bedrooms: "",
  beds: "",
  bathrooms: "",

  category: "Apartment",

  ownerName: "",
  contactNumber: "",
};

// =====================================================
// AMENITIES
// =====================================================

const AMENITIES = [
  "WiFi",
  "Parking",
  "AC",
  "TV",
  "Kitchen",
  "Pool",
  "Hot Water",
  "Washing Machine",
  "Balcony",
  "Garden",
  "Workspace",
  "Pet Friendly",
];

// =====================================================
// COMPONENT
// =====================================================

const Host = () => {
  const navigate = useNavigate();

  // =================================================
  // STATE
  // =================================================

  const [form, setForm] = useState(initialForm);

  const [amenities, setAmenities] = useState([]);

  const [images, setImages] = useState([]);

  const [previews, setPreviews] = useState([]);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  // =================================================
  // CHECK LOGIN
  // =================================================

  useEffect(() => {
    const token = localStorage.getItem("staynest_token");

    console.log("================================");

    console.log("HOST PAGE AUTH CHECK");

    console.log("TOKEN EXISTS:", !!token);

    if (token) {
      console.log("TOKEN:", token.substring(0, 20) + "...");
    } else {
      console.warn("NO AUTH TOKEN FOUND");
    }

    console.log("================================");
  }, []);

  // =================================================
  // INPUT CHANGE
  // =================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear previous message
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  // =================================================
  // AMENITY CHANGE
  // =================================================

  const handleAmenityChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setAmenities((previous) => [...previous, value]);
    } else {
      setAmenities((previous) => previous.filter((item) => item !== value));
    }

    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  // =================================================
  // IMAGE CHANGE
  // =================================================

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    console.log("SELECTED FILES:", selectedFiles);

    if (selectedFiles.length === 0) {
      return;
    }

    // ---------------------------------------------
    // MAX 10 IMAGES
    // ---------------------------------------------

    if (images.length + selectedFiles.length > 10) {
      setMessage("You can upload maximum 10 images.");

      setMessageType("error");

      event.target.value = "";

      return;
    }

    // ---------------------------------------------
    // VALIDATE IMAGES
    // ---------------------------------------------

    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        console.warn("Invalid file:", file.name);

        return false;
      }

      return true;
    });

    if (validFiles.length !== selectedFiles.length) {
      setMessage("Only image files are allowed.");

      setMessageType("error");
    }

    // ---------------------------------------------
    // ADD FILES
    // ---------------------------------------------

    setImages((previous) => [...previous, ...validFiles]);

    // ---------------------------------------------
    // CREATE PREVIEWS
    // ---------------------------------------------

    const newPreviews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),

      name: file.name,
    }));

    setPreviews((previous) => [...previous, ...newPreviews]);

    // ---------------------------------------------
    // RESET INPUT
    // ---------------------------------------------

    event.target.value = "";
  };

  // =================================================
  // REMOVE IMAGE
  // =================================================

  const removeImage = (index) => {
    setImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index),
    );

    setPreviews((previous) => {
      const selected = previous[index];

      if (selected?.url) {
        URL.revokeObjectURL(selected.url);
      }

      return previous.filter((_, imageIndex) => imageIndex !== index);
    });
  };

  // =================================================
  // VALIDATION
  // =================================================

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Property title is required.";
    }

    if (!form.description.trim()) {
      return "Property description is required.";
    }

    if (!form.city.trim()) {
      return "City is required.";
    }

    if (!form.state.trim()) {
      return "State is required.";
    }

    if (!form.country.trim()) {
      return "Country is required.";
    }

    if (!form.address.trim()) {
      return "Property address is required.";
    }

    if (!form.price || Number(form.price) <= 0) {
      return "Please enter a valid price.";
    }

    if (!form.guests || Number(form.guests) < 1) {
      return "Please enter valid guest count.";
    }

    if (form.bedrooms !== "" && Number(form.bedrooms) < 0) {
      return "Invalid bedroom count.";
    }

    if (form.beds !== "" && Number(form.beds) < 0) {
      return "Invalid bed count.";
    }

    if (form.bathrooms !== "" && Number(form.bathrooms) < 0) {
      return "Invalid bathroom count.";
    }

    if (!form.ownerName.trim()) {
      return "Owner name is required.";
    }

    if (!form.contactNumber.trim()) {
      return "Contact number is required.";
    }

    if (images.length === 0) {
      return "Please upload at least one property image.";
    }

    return null;
  };

  // =================================================
  // SUBMIT
  // =================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("");
    console.log("========================================");

    console.log("CREATE PROPERTY SUBMIT");

    console.log("========================================");

    // =================================================
    // GET TOKEN
    // =================================================

    const token = localStorage.getItem("staynest_token");

    console.log("API URL:", `${API_URL}/properties`);

    console.log("TOKEN EXISTS:", !!token);

    if (!token) {
      console.error("NO AUTH TOKEN FOUND");

      setMessage("Please login first. Your login session was not found.");

      setMessageType("error");

      return;
    }

    console.log("TOKEN FOUND:", token.substring(0, 20) + "...");

    // =================================================
    // VALIDATE
    // =================================================

    const validationError = validateForm();

    if (validationError) {
      console.error("VALIDATION ERROR:", validationError);

      setMessage(validationError);

      setMessageType("error");

      return;
    }

    // =================================================
    // START LOADING
    // =================================================

    setLoading(true);

    setMessage("");

    setMessageType("");

    try {
      // =================================================
      // CREATE FORMDATA
      // =================================================

      const formData = new FormData();

      // =================================================
      // BASIC FIELDS
      // =================================================

      formData.append("title", form.title.trim());

      formData.append("description", form.description.trim());

      // =================================================
      // LOCATION
      // =================================================

      const location = {
        city: form.city.trim(),

        state: form.state.trim(),

        country: form.country.trim() || "India",

        address: form.address.trim(),
      };

      formData.append("location", JSON.stringify(location));

      // =================================================
      // PROPERTY DETAILS
      // =================================================

      formData.append("price", String(Number(form.price)));

      formData.append("guests", String(Number(form.guests)));

      formData.append("bedrooms", String(Number(form.bedrooms || 0)));

      formData.append("beds", String(Number(form.beds || 0)));

      formData.append("bathrooms", String(Number(form.bathrooms || 0)));

      formData.append("category", form.category);

      // =================================================
      // OWNER
      // =================================================

      formData.append("ownerName", form.ownerName.trim());

      formData.append("contactNumber", form.contactNumber.trim());

      // =================================================
      // AMENITIES
      // =================================================

      formData.append("amenities", JSON.stringify(amenities));

      // =================================================
      // IMAGES
      // IMPORTANT:
      // BACKEND EXPECTS "images"
      // =================================================

      images.forEach((image) => {
        formData.append("images", image);
      });

      // =================================================
      // DEBUG FORMDATA
      // =================================================

      console.log("");
      console.log("FORM DATA");

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, {
            name: value.name,

            type: value.type,

            size: value.size,
          });
        } else {
          console.log(key, value);
        }
      }

      // =================================================
      // API REQUEST
      // =================================================

      console.log("");
      console.log("SENDING POST REQUEST...");

      const response = await fetch(`${API_URL}/properties`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      // =================================================
      // STATUS
      // =================================================

      console.log("HTTP STATUS:", response.status);

      console.log("HTTP OK:", response.ok);

      // =================================================
      // RAW RESPONSE
      // =================================================

      const rawResponse = await response.text();

      console.log("RAW RESPONSE:", rawResponse);

      // =================================================
      // PARSE RESPONSE
      // =================================================

      let data;

      try {
        data = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error("JSON PARSE ERROR:", parseError);

        throw new Error(`Server returned unexpected response: ${rawResponse}`);
      }

      console.log("PROPERTY API RESPONSE:", data);

      // =================================================
      // 401
      // =================================================

      if (response.status === 401) {
        console.error("AUTHENTICATION FAILED");

        setMessage(
          "Your login session is invalid or expired. Please login again.",
        );

        setMessageType("error");

        // Remove invalid token
        localStorage.removeItem("staynest_token");

        return;
      }

      // =================================================
      // 403
      // =================================================

      if (response.status === 403) {
        console.error("403 FORBIDDEN");

        console.error("SERVER RESPONSE:", data);

        setMessage(
          data.message ||
            data.error ||
            "You are not allowed to create this property.",
        );

        setMessageType("error");

        return;
      }

      // =================================================
      // OTHER ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Request failed with status ${response.status}`,
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      if (data.success) {
        console.log("");
        console.log("========================================");

        console.log("PROPERTY CREATED SUCCESSFULLY");

        console.log("PROPERTY:", data.property);

        console.log("========================================");

        setMessage(
          "Property created successfully! Your property is now listed.",
        );

        setMessageType("success");

        // ---------------------------------------------
        // RESET FORM
        // ---------------------------------------------

        setForm(initialForm);

        setAmenities([]);

        setImages([]);

        // ---------------------------------------------
        // CLEAR PREVIEWS
        // ---------------------------------------------

        previews.forEach((preview) => {
          if (preview?.url) {
            URL.revokeObjectURL(preview.url);
          }
        });

        setPreviews([]);
      } else {
        setMessage(data.message || "Property creation failed.");

        setMessageType("error");
      }
    } catch (error) {
      console.error("");
      console.error("========================================");

      console.error("CREATE PROPERTY ERROR");

      console.error("MESSAGE:", error.message);

      console.error("FULL ERROR:", error);

      console.error("========================================");

      setMessage(
        error.message || "Something went wrong while creating property.",
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // =================================================
  // CANCEL
  // =================================================

  const handleCancel = () => {
    if (loading) {
      return;
    }

    setForm(initialForm);

    setAmenities([]);

    setImages([]);

    previews.forEach((preview) => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
    });

    setPreviews([]);

    setMessage("");

    setMessageType("");
  };

  // =================================================
  // RENDER
  // =================================================

  return (
    <main className="host-page">
      <div className="host-container">
        {/* =========================================
                    HEADER
                ========================================= */}

        <header className="host-header">
          <h1>Become a Host</h1>

          <p>
            Share your beautiful property with StayNest guests and start hosting
            today.
          </p>
        </header>

        {/* =========================================
                    MESSAGE
                ========================================= */}

        {message && (
          <div
            className={
              messageType === "success" ? "success-message" : "error-message"
            }
          >
            {message}
          </div>
        )}

        {/* =========================================
                    FORM
                ========================================= */}

        <form className="host-form" onSubmit={handleSubmit}>
          {/* =====================================
                        BASIC INFORMATION
                    ===================================== */}

          <section className="form-section">
            <h2>Property Information</h2>

            {/* TITLE */}

            <div className="form-group">
              <label htmlFor="title">Property Title *</label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Beautiful 2BHK Apartment"
                required
                disabled={loading}
              />
            </div>

            {/* DESCRIPTION */}

            <div className="form-group">
              <label htmlFor="description">Description *</label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your property, nearby attractions, facilities..."
                required
                disabled={loading}
              />
            </div>

            {/* CATEGORY */}

            <div className="form-group">
              <label htmlFor="category">Property Category</label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Apartment">Apartment</option>

                <option value="House">House</option>

                <option value="Villa">Villa</option>

                <option value="Cottage">Cottage</option>

                <option value="Hotel">Hotel</option>

                <option value="Resort">Resort</option>

                <option value="Homestay">Homestay</option>
              </select>
            </div>
          </section>

          {/* =====================================
                        LOCATION
                    ===================================== */}

          <section className="form-section">
            <h2>Location</h2>

            <div className="form-row">
              {/* CITY */}

              <div className="form-group">
                <label htmlFor="city">City *</label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Goa"
                  required
                  disabled={loading}
                />
              </div>

              {/* STATE */}

              <div className="form-group">
                <label htmlFor="state">State *</label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Goa"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              {/* COUNTRY */}

              <div className="form-group">
                <label htmlFor="country">Country *</label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="India"
                  required
                  disabled={loading}
                />
              </div>

              {/* ADDRESS */}

              <div className="form-group">
                <label htmlFor="address">Full Address *</label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter complete property address"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          {/* =====================================
                        PROPERTY DETAILS
                    ===================================== */}

          <section className="form-section">
            <h2>Property Details</h2>

            <div className="form-row">
              {/* PRICE */}

              <div className="form-group">
                <label htmlFor="price">Price per Night (₹) *</label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="2500"
                  required
                  disabled={loading}
                />
              </div>

              {/* GUESTS */}

              <div className="form-group">
                <label htmlFor="guests">Maximum Guests *</label>

                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  value={form.guests}
                  onChange={handleChange}
                  placeholder="4"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              {/* BEDROOMS */}

              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms</label>

                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min="0"
                  value={form.bedrooms}
                  onChange={handleChange}
                  placeholder="2"
                  disabled={loading}
                />
              </div>

              {/* BEDS */}

              <div className="form-group">
                <label htmlFor="beds">Beds</label>

                <input
                  id="beds"
                  name="beds"
                  type="number"
                  min="0"
                  value={form.beds}
                  onChange={handleChange}
                  placeholder="3"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bathrooms">Bathrooms</label>

              <input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="0"
                value={form.bathrooms}
                onChange={handleChange}
                placeholder="2"
                disabled={loading}
              />
            </div>
          </section>

          {/* =====================================
                        AMENITIES
                    ===================================== */}

          <section className="form-section">
            <h2>Amenities</h2>

            <div className="amenities-grid">
              {AMENITIES.map((amenity) => (
                <label className="amenity-item" key={amenity}>
                  <input
                    type="checkbox"
                    value={amenity}
                    checked={amenities.includes(amenity)}
                    onChange={handleAmenityChange}
                    disabled={loading}
                  />

                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </section>

          {/* =====================================
                        IMAGES
                    ===================================== */}

          <section className="form-section">
            <h2>Property Images</h2>

            <div className="form-group">
              <label className="image-upload">
                <span>📷 Choose Property Images</span>

                <small>Upload up to 10 images. JPG, PNG, WEBP supported.</small>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </label>
            </div>

            {/* PREVIEWS */}

            {previews.length > 0 && (
              <div className="image-preview-grid">
                {previews.map((preview, index) => (
                  <div
                    className="image-preview"
                    key={`${preview.name}-${index}`}
                  >
                    <img
                      src={preview.url}
                      alt={`Property preview ${index + 1}`}
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={loading}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      ×
                    </button>

                    <span>{preview.name}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =====================================
                        OWNER DETAILS
                    ===================================== */}

          <section className="form-section">
            <h2>Host Details</h2>

            <div className="form-row">
              {/* OWNER */}

              <div className="form-group">
                <label htmlFor="ownerName">Owner Name *</label>

                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  value={form.ownerName}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  disabled={loading}
                />
              </div>

              {/* CONTACT */}

              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number *</label>

                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  value={form.contactNumber}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          {/* =====================================
                        ACTIONS
                    ===================================== */}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Clear Form
            </button>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating Property..." : "Create Property"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

// =====================================================
// EXPORT
// =====================================================

export default Host;