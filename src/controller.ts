import { Request, Response } from 'express';
import * as userService from './service/user.service';
import * as locationService from './service/location.service';

// Handles OTP request by delegating to the user service
export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }
    await userService.requestOtp(phone);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to request OTP' });
  }
};

// Verifies the OTP and returns a token if successful
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Phone and OTP are required' });
    }
    const token = await userService.verifyOtp(phone, otp);
    res.json({ success: true, token });
  } catch (e) {
    res.status(401).json({ success: false, error: 'Invalid OTP' });
  }
};

// Broadcasts the location of a vehicle and handles errors
export const postLocation = async (req: Request, res: Response) => {
  console.log('postLocation endpoint called');
  try {
    const { lat, lng } = req.body;
    console.log('Received location data:', { lat, lng, vehicleId: req.params.vehicleId });
    const vehicleId = req.params.vehicleId;
    if (!lat || !lng || !vehicleId) {
      console.warn('Missing lat/lng/vehicleId:', { lat, lng, vehicleId });
      return res.status(400).json({ success: false, error: 'Latitude, longitude, and vehicle ID are required' });
    }
    await locationService.broadcastLocation(vehicleId, { lat, lng });
    console.log('Location broadcasted for vehicle:', vehicleId);
    res.status(201).json({ success: true });
  } catch (e) {
    console.error('Failed to broadcast location:', e);
    res.status(500).json({ success: false, error: 'Failed to broadcast location' });
  }
};

// Streams locations for a list of vehicle IDs using Server-Sent Events (SSE)
export const streamLocations = (req: Request, res: Response) => {
  console.log('streamLocations endpoint called');
  try {
    const vehicleIds = (req.query.v || '').toString().split(',').filter(id => id.trim() !== '');
    console.log('Streaming locations for vehicle IDs:', vehicleIds);
    if (vehicleIds.length === 0) {
      console.warn('No valid vehicle IDs provided');
      return res.status(400).json({ success: false, error: 'No valid vehicle IDs provided' });
    }
    locationService.setupSSE(vehicleIds, res);
  } catch (e) {
    console.error('Failed to stream locations:', e);
    res.status(500).json({ success: false, error: 'Failed to stream locations' });
  }
};

// Adds user details to the database
export const addUserDetails = async (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, error: 'Name, email, and phone are required' });
    }
    const user = await userService.addUserDetails({ name, email, phone });
    res.status(201).json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to add user details' });
  }
};

// Registers a device
export const registerDevice = async (req: Request, res: Response) => {
  try {
    const { name, deviceType, deviceNumber, shareType, startLoc, endLoc, owner } = req.body;
    const device = await userService.registerDevice({
      name,
      deviceType,
      deviceNumber,
      shareType,
      startLoc,
      endLoc,
      owner,
    });
    res.status(201).json({ success: true, device });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

export const grantPermission = async (req: Request, res: Response) => {
  try {
    const { deviceId, phone } = req.body;
    if (!deviceId || !phone) {
      return res.status(400).json({ success: false, error: 'Device ID and phone are required' });
    }
    const permission = await userService.grantPermission(deviceId, phone);
    res.status(200).json({ success: true, permission });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to grant permission' });
  }
};

export const getAllPublicVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await userService.getAllPublicVehicles();
    res.status(200).json({ success: true, vehicles });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to fetch public vehicles' });
  }
};
