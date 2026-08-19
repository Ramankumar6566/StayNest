const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

function getToken() {
    return localStorage.getItem("staynest_token");
}

async function request(endpoint, options = {}) {
    const token = getToken();

    const isFormData = options.body instanceof FormData;

    const headers = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const url = `${API_URL}${endpoint}`;

    console.log("================================");
    console.log("STAYNEST API REQUEST");
    console.log("URL:", url);
    console.log("METHOD:", options.method || "GET");
    console.log("TOKEN:", token ? "YES" : "NO");
    console.log("================================");

    let response;

    try {
        response = await fetch(url, {
            ...options,
            headers,
        });
    } catch (error) {
        console.error("NETWORK ERROR:", error);

        throw new Error(
            "Cannot connect to StayNest server. Make sure backend is running on http://localhost:5000"
        );
    }

    console.log("API STATUS:", response.status);

    const contentType =
        response.headers.get("content-type") || "";

    let data;

    try {
        if (contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }
    } catch (error) {
        console.error("Response parsing error:", error);
        data = null;
    }

    console.log("API RESPONSE:", data);

    if (!response.ok) {
        let message =
            `Request failed with status ${response.status}`;

        if (
            data &&
            typeof data === "object" &&
            data.message
        ) {
            message = data.message;
        }

        throw new Error(message);
    }

    return data;
}

export const api = {
    health: () => request("/../"),

    register: (data) =>
        request("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    login: (data) =>
        request("/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    getMe: () =>
        request("/auth/me"),

    getProperties: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {
                searchParams.append(key, value);
            }
        });

        const query = searchParams.toString();

        return request(
            query
                ? `/properties?${query}`
                : "/properties"
        );
    },

    getProperty: (id) =>
        request(`/properties/${id}`),

    createProperty: (data) =>
        request("/properties", {
            method: "POST",
            body: data,
        }),

    updateProperty: (id, data) =>
        request(`/properties/${id}`, {
            method: "PUT",
            body: data,
        }),

    deleteProperty: (id) =>
        request(`/properties/${id}`, {
            method: "DELETE",
        }),

    createBooking: (data) =>
        request("/bookings", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    getBookings: () =>
        request("/bookings"),

    getMyBookings: () =>
        request("/bookings/my"),

    cancelBooking: (id) =>
        request(`/bookings/${id}`, {
            method: "DELETE",
        }),

    getReviews: (propertyId) =>
        request(`/reviews/${propertyId}`),

    createReview: (data) =>
        request("/reviews", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateReview: (id, data) =>
        request(`/reviews/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    deleteReview: (id) =>
        request(`/reviews/${id}`, {
            method: "DELETE",
        }),
};

export default api;