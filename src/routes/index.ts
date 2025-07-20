// Import necessary modules and controllers
import express from 'express';
import {
requestOtp, // Controller for handling OTP request
verifyOtp,  // Controller for verifying OTP
postLocation, // Controller for posting location data
streamLocations // Controller for streaming location data
} from '../controller';

const router = express.Router();

// Route to request an OTP for user login
router.post('/user/login/request-otp', requestOtp);

//Route to verify the OTP for user login
router.post('/user/login/verify-otp', verifyOtp);

// Route to post location data for a specific vehicle
router.post('/location/:vehicleId', postLocation);

// Route to stream location data in real-time
router.get('/location/stream', streamLocations);

export default router; // Export the router for use in the application