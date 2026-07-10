require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const mongoDBUrl = process.env.MONGODB_URI;
const app = express();

// --------------- Middleware ---------------
// Allow requests from your frontend (add your production frontend URL here too)
const allowedOrigins = [
    'http://localhost:5173',   // Vite dev server
    'http://localhost:3000',   // CRA dev server
    process.env.FRONTEND_URL,  // Set this in Render env vars when deployed
].filter(Boolean); // remove undefined if FRONTEND_URL not set

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. Postman, curl, mobile apps)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true, // allow cookies/auth headers
}));

app.use(express.json());

// --------------- Routes ---------------
app.get('/', (req, res) => {
    res.send({
        name: "redwood",
        status: "running"
    });
});

app.get('/api/userData', (req, res) => {
    res.send({
        name: "Shivbodh Singh"
    });
});

const woodRoutes = require('./routes/woods');
app.use('/api/woods', woodRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// --------------- Start Server ---------------
mongoose.connect(mongoDBUrl)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });