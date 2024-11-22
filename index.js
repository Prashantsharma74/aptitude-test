const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./Config/db');
const questionRoutes = require('./Routes/question');  // Corrected route import
const adminRoutes = require('./Routes/admin');
const candidateRoutes = require('./Routes/user'); // Import candidate routes      // Corrected route import
require('dotenv').config();
const cors = require('cors');
const app = express();

// Connect to MongoDB
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://technorizen-solution-examhub.vercel.app']
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

connectDB();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/candidates', candidateRoutes);

// Set port to 8000

const PORT = 8000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/', (req, res) => {
  res.status(200).json("Started")
})

module.exports = app;
