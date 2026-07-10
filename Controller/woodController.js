const Wood = require("../model/wood");

// Each function handles one operation. 'exports.name' makes it importable.

exports.createWood = async (req, res) => {
    try {
        const wood = await Wood.create(req.body); // Create a new wood entry in the database using the request body
        res.status(201).json(wood); // Send a 201 Created response with the created wood entry
    } catch (error) {
        res.status(400).json({ error: error.message }); // Send a 400 Bad Request response with the error message
    }

};

exports.getWoods = async (req, res) => {
    try {
        const woods = await Wood.find().sort({ createdAt: -1 }); // Retrieve all wood entries from the database, sorted by creation date in descending order
        res.json(woods); // Send the retrieved wood entries as a JSON response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getWood = async (req, res) => {
    try {
        const wood = await Wood.findById(req.params.id); // Retrieve a specific wood entry by its ID from the request parameters
        if (!wood) {
            return res.status(404).json({ error: "Wood not found" }); // If the wood entry is not found, send a 404 Not Found response with an error message
        }
        res.json(wood); // Send the retrieved wood entry as a JSON response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateWood = async (req, res) => {
    try {
        const wood = await Wood.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }); // Update a specific wood entry by its ID with the request body, returning the updated entry and running validators

        if (!wood) {
            return res.status(404).json({ error: "Wood not found" }); // If the wood entry is not found, send a 404 Not Found response with an error message
        }
        res.json(wood); // Send the updated wood entry as a JSON response
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteWood = async (req, res) => {
    try {
        const wood = await Wood.findByIdAndDelete(req.params.id); // Delete a specific wood entry by its ID from the request parameters
        if (!wood) {
            return res.status(404).json({ error: "Wood not found" }); // If the wood entry is not found, send a 404 Not Found response with an error message
        }
        res.json({ message: "Wood deleted successfully" }); // Send a success message as a JSON response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};