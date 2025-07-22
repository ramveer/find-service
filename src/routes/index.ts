// Import necessary modules and controllers
import express from 'express';
import {
requestOtp, // Controller for handling OTP request
verifyOtp,  // Controller for verifying OTP
postLocation, // Controller for posting location data
streamLocations, // Controller for streaming location data
addUserDetails, // Controller for adding user details
registerDevice, // Controller for registering a device
grantPermission, // Controller for granting permission to share vehicle
getAllPublicVehicles, // Controller for getting all public vehicles
searchVehicle // Controller for searching a vehicle by ID
} from '../controller';

const router = express.Router();

// 1. Route to request an OTP for user login
router.post('/user/login/request-otp', requestOtp);

// 2. Route to verify the OTP for user login
router.post('/user/login/verify-otp', verifyOtp);

// 3. Route to register a new user
router.put('/user/profile', addUserDetails);

// 4. Route to register a new vehicle device/update existing one
router.post('/vehicle', registerDevice);

// 5. Route to post location data for a specific vehicle
router.post('/location/:vehicleId', postLocation);

// 6. Route to stream location data in real-time
router.get('/location/stream', streamLocations);

// 7. allow user to share vehicle with other users
router.post('/vehicle/:id/permission', grantPermission);

// 8. Route to search for a vehicle by ID
router.get('/vehicle/search?query=:id', searchVehicle);

// 9. Route to get the list of all vehicles for a user
router.get('/vehicle', getAllPublicVehicles);

export default router; // Export the router for use in the application