import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "./models/Property.js";

dotenv.config();

const properties = [
    {
        title: "Luxury Villa in Goa",
        description:
            "Beautiful luxury villa in North Goa with modern interiors and a relaxing atmosphere.",
        location: "North Goa",
        city: "Goa",
        price: 4500,
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        category: "Villa",
        rating: 4.8,
        reviews: 124,
        isAvailable: true,
        images: [
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
        ],
    },

    {
        title: "Modern Apartment in Bangalore",
        description:
            "Modern and comfortable apartment located close to restaurants, shopping and city attractions.",
        location: "Whitefield",
        city: "Bangalore",
        price: 2800,
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        category: "Apartment",
        rating: 4.7,
        reviews: 89,
        isAvailable: true,
        images: [
            "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85",
        ],
    },

    {
        title: "Cozy Mountain Cabin",
        description:
            "Peaceful wooden cabin surrounded by mountains, perfect for a relaxing weekend.",
        location: "Manali",
        city: "Himachal Pradesh",
        price: 3200,
        guests: 4,
        bedrooms: 2,
        bathrooms: 1,
        category: "Cabin",
        rating: 4.9,
        reviews: 156,
        isAvailable: true,
        images: [
            "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85",
        ],
    },

    {
        title: "Beach House in Goa",
        description:
            "Beautiful beachside home with a peaceful atmosphere and easy access to the beach.",
        location: "Calangute",
        city: "Goa",
        price: 5200,
        guests: 8,
        bedrooms: 4,
        bathrooms: 3,
        category: "Beach",
        rating: 4.8,
        reviews: 203,
        isAvailable: true,
        images: [
            "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=85",
        ],
    },

    {
        title: "Luxury Home in Ooty",
        description:
            "Elegant hill-station home surrounded by greenery and beautiful mountain views.",
        location: "Ooty",
        city: "Tamil Nadu",
        price: 3500,
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        category: "Villa",
        rating: 4.7,
        reviews: 97,
        isAvailable: true,
        images: [
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
        ],
    },

    {
        title: "City View Apartment",
        description:
            "Stylish apartment with amazing city views, modern furniture and a comfortable living space.",
        location: "Mumbai",
        city: "Maharashtra",
        price: 3000,
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        category: "City",
        rating: 4.6,
        reviews: 74,
        isAvailable: true,
        images: [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85",
        ],
    },

    {
        title: "Peaceful Lake House",
        description:
            "Relaxing lake-side property surrounded by nature, perfect for families and couples.",
        location: "Udaipur",
        city: "Rajasthan",
        price: 4100,
        guests: 5,
        bedrooms: 3,
        bathrooms: 2,
        category: "Lake",
        rating: 4.9,
        reviews: 118,
        isAvailable: true,
        images: [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85",
        ],
    },

    {
        title: "Budget Stay in Delhi",
        description:
            "Affordable and comfortable stay in a convenient location with easy city access.",
        location: "New Delhi",
        city: "Delhi",
        price: 1500,
        guests: 3,
        bedrooms: 1,
        bathrooms: 1,
        category: "Budget",
        rating: 4.5,
        reviews: 62,
        isAvailable: true,
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85",
        ],
    },

    {
        title: "Farmhouse Retreat",
        description:
            "Beautiful countryside farmhouse with plenty of open space and a peaceful environment.",
        location: "Lonavala",
        city: "Maharashtra",
        price: 3800,
        guests: 7,
        bedrooms: 3,
        bathrooms: 2,
        category: "Farm",
        rating: 4.8,
        reviews: 91,
        isAvailable: true,
        images: [
            "https://images.unsplash.com/photo-1505843795480-5cfb3c03f6ff?auto=format&fit=crop&w=1200&q=85",
        ],
    },

    {
        title: "Premium Apartment in Pune",
        description:
            "Premium fully furnished apartment with modern amenities and a comfortable atmosphere.",
        location: "Hinjewadi",
        city: "Pune",
        price: 2600,
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        category: "Apartment",
        rating: 4.7,
        reviews: 105,
        isAvailable: true,
        images: [
            "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1200&q=85",
        ],
    },
];

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        // Delete old properties
        await Property.deleteMany({});

        console.log("Old properties deleted");

        // Insert new properties
        const insertedProperties = await Property.insertMany(properties);

        console.log(
            `${insertedProperties.length} properties inserted successfully`
        );

        // Show inserted property names
        insertedProperties.forEach((property, index) => {
            console.log(
                `${index + 1}. ${property.title} - ${property.location}`
            );
        });

        await mongoose.connection.close();

        console.log("MongoDB connection closed");
        console.log("Property seeding completed successfully!");

        process.exit(0);
    } catch (error) {
        console.error("Seed Error:", error);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedDatabase();