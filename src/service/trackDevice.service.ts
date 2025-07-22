
import * as trackDeviceRepo from '../repository/trackDevice.repository';

export const registerTrackDevice = async ({
  name,
  deviceType,
  deviceNumber,
  shareType,
  startLoc,
  endLoc
}: {
  name: string;
  deviceType: string;
  deviceNumber: string;
  shareType: 'PRIVATE' | 'PUBLIC' | 'RESTRICTED';
  startLoc?: string;
  endLoc?: string;
}) => {
  const userId = 1; // Placeholder for user ID, replace with actual user ID logic
  console.log('registerTrackDevice called with:', { name, deviceType, deviceNumber, shareType, startLoc, endLoc, userId });
  if (!name || !deviceType || !deviceNumber || !shareType) {
    throw new Error('name, deviceType, deviceNumber, and shareType are required');
  }

  // Check if the device already exists
  const existingDevice = await trackDeviceRepo.findTrackDeviceByName(name);
  if (existingDevice) {
    throw new Error('Device already registered');
  }

  // Create and save the device
  const newDevice = await trackDeviceRepo.createTrackDevice({
    name,
    deviceType,
    deviceNumber,
    shareType,
    startLoc: startLoc || '',
    endLoc: endLoc || '',
    userId,
    isActive: true,
  });

  return newDevice;
};

export const updateTrackDevice = async (deviceId: number, data: Partial<{ isActive: boolean; shareType: string }>) => {
  console.log('updateTrackDevice called with:', { deviceId, data });
  const updatedDevice = await trackDeviceRepo.updateTrackDevice(deviceId, data);
  return updatedDevice;
};

export const getTrackDeviceById = async (deviceId: string) => {
  console.log('getTrackDeviceById called with:', deviceId);
  const device = await trackDeviceRepo.findTrackDeviceById(deviceId);
  if (!device) {
    throw new Error('Device not found');
  }
  return device;
};

export const getAllPublicTrackDevices = async () => {
  console.log('getAllPublicTrackDevices called');
  const devices = await trackDeviceRepo.findManyTrackDevices({
    where: { shareType: 'PUBLIC', isActive: true },
  });
  return devices;
};

export function grantPermission(deviceId: any, phone: any) {
    throw new Error('Function not implemented.');
}

