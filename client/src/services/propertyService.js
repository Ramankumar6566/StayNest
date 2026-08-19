const API_URL = "http://localhost:5000/api";

export const getProperties = async () => {
    try {
        const response = await fetch(`${API_URL}/properties`);

        if (!response.ok) {
            throw new Error("Failed to fetch properties");
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Property API Error:", error);
        throw error;
    }
};

export const getPropertyById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/properties/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch property");
        }

        return await response.json();
    } catch (error) {
        console.error("Single Property API Error:", error);
        throw error;
    }
};