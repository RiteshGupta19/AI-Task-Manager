// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); // ✅ Security headers
const compression = require('compression'); // ✅ Gzip compression
const Router = require('./Router/routes');

dotenv.config();

const app = express();

// Security + Performance Middlewares
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    'https://taskmaster-io.netlify.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Healthchecks for Kubernetes
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/ready', (req, res) => res.status(200).send('READY'));

app.use('/', Router);

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const app = express();
// const Router = require('./Router/routes')
// const cookieParser = require('cookie-parser');


// dotenv.config();

// // Middleware

// app.use(express.json());  // To parse incoming JSON requests
// app.use(cookieParser());

// app.use(cors({
//     origin: ['https://taskmaster-io.netlify.app','http://localhost:5173','http://localhost:3000','http://192.168.49.2:30000'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
//   }));

// app.get('/health', (req, res) => res.status(200).send('OK'));
// app.get('/ready', (req, res) => res.status(200).send('READY'));
// // app.use(cors());

// app.use('/', Router);

// connectDB();

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is Running on Port ${PORT}`);
// });

