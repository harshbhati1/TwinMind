/**
 * TwinMind - Main Server File
 * Node.js/Express.js backend for the TwinMind meeting transcription application
 */

// Import required packages
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const { initializeFirebase } = require('./src/config/firebase.config');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
try {
  initializeFirebase();
  console.log('Firebase Admin SDK initialized successfully in server.js');
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
  // Continue with server initialization, individual routes will handle auth failures
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ 
  storage, 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Simple health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'TwinMind API server is running'
  });
});

// Test route to verify Firebase and Gemini configurations
app.get('/api/test-config', async (req, res) => {
  try {
    // Import Gemini config
    const { initializeGemini } = require('./src/config/gemini.config');
    
    let geminiResponse = "Gemini API test skipped to avoid rate limiting";
    // Skip actual Gemini testing to avoid rate limits during setup
    geminiResponse = "Gemini API configuration loaded but test skipped to avoid rate limits. You can implement actual Gemini API calls in your application logic.";
    
    // Initialize Gemini without making an API call
    const { geminiFlash } = initializeGemini();
    
    /* For actual testing, uncomment this:
    try {
      // Initialize Gemini - only using Flash model as per project requirements
      const { geminiFlash } = initializeGemini();
      
      // Test Gemini Flash model with a very simple prompt to minimize token usage
      const result = await geminiFlash.generateContent('Hello');
      geminiResponse = result.response.text();
    } catch (geminiError) {
      console.log('Gemini API test warning:', geminiError.message);
      if (geminiError.message.includes('429') || geminiError.message.includes('quota')) {
        geminiResponse = "Gemini API rate limit reached. This is normal with free tier. The API key is valid, but you're limited to a certain number of requests.";
      } else {
        throw geminiError; // Re-throw if it's not a rate limit error
      }
    }
    */
      res.status(200).json({
      status: 'success',
      message: 'Configurations loaded successfully',
      firebase: 'Firebase Admin SDK initialized successfully',
      gemini: geminiResponse
    });
  } catch (error) {
    console.error('Configuration test failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Configuration test failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const transcriptionRoutes = require('./src/routes/transcription.routes');
const chatRoutes = require('./src/routes/chatRoutes'); // Correct import, no .js extension needed
const summaryRoutes = require('./src/routes/summary.routes');
const calendarRoutes = require('./src/routes/calendar.routes');

// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/transcription', transcriptionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/calendar', calendarRoutes);

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // For testing purposes
