const mongoose = require("mongoose");

const woodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Wood name is required"],
            trim: true,
        },
        type: {
            type: String,
            enum: ["hardwood", "softwood"],
            required: [true, "They must be either 'hardwood' or 'softwood' "],
        },
        origin: {
            type: String,
            required: [true, "Origin is required"],
            trim: true
        },
        color: {
            type: String,
            required: [true, "Color is required"],
            trim: true
        },
        density: {
            type: Number,
            required: [true, "Density is required"],
            min: [0, "Density must be a positive number"]
        },
        pricePerUnit: {
            type: Number,
            required: [true, "Price per unit is required"],
            min: [0, "Price per unit must be a positive number"]
        },
        description: {
            type: String,
            trim: true
        },
        available: {
            type: Boolean,
            
        },
        image : {
            type: String,
            required: [true, "Image URL is required"],
            trim : true
        }
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("Wood", woodSchema, "woods"); // Export the Wood model based on the woodSchema