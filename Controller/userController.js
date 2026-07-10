const User = require("../model/user");

// Each function handles one operation. 'exports.name' makes it importable.



exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }); // Retrieve all user entries from the database, sorted by creation date in descending order
        res.json(users); // Send the retrieved user entries as a JSON response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Retrieve a specific user entry by its ID from the request parameters
        if (!user) {
            return res.status(404).json({ error: "User not found" }); // If the user entry is not found, send a 404 Not Found response with an error message
        }
        res.json(user); // Send the retrieved user entry as a JSON response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" }); // If the user entry is not found, send a 404 Not Found response with an error message
        }

        // Update fields manually to ensure mongoose save middleware triggers
        Object.keys(req.body).forEach((key) => {
            user[key] = req.body[key];
        });

        await user.save(); // Save the updated user, triggering pre-save hooks (like password hashing)

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json(userResponse); // Send the updated user entry as a JSON response (excluding password)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id); // Delete a specific user entry by its ID from the request parameters
        if (!user) {
            return res.status(404).json({ error: "User not found" }); // If the user entry is not found, send a 404 Not Found response with an error message
        }
        res.json({ message: "User deleted successfully" }); // Send a success message as a JSON response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};