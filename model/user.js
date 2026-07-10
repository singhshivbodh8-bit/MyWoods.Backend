const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "User name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false, // Exclude password from query results by default
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10); // Generate a salt for hashing the password
    this.password = await bcrypt.hash(this.password, salt); // Hash the password before saving it to the database
    // NOTE: Do NOT call next() after awaiting in async hooks — Mongoose handles it automatically
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // Compare the provided password with the hashed password in the database
};

module.exports = mongoose.model("User", userSchema, "users"); // Export the User model based on the userSchema