import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const findTrackDeviceById = async (deviceId: string) => {
  console.log('findTrackDeviceById called with:', deviceId);
  return prisma.trackDevice.findUnique({ where: { id: deviceId } });
};

export const createTrackDevice = async (data: {
  name: string;
  deviceType: string;
  deviceNumber: string;
  shareType: string;
  startLoc: string;
  endLoc: string;
  userId: number;
  isActive: boolean;
}) => {
  console.log('createTrackDevice called with:', data);
  return prisma.trackDevice.create({ data });
};

export const updateTrackDevice = async (deviceId: number, data: Partial<{ isActive: boolean; shareType: string }>) => {
  console.log('updateTrackDevice called with:', { deviceId, data });
  return prisma.trackDevice.update({ where: { id: deviceId }, data });
};

export const findManyTrackDevices = async (query: { where: { shareType: string; isActive: boolean } }) => {
  console.log('findManyTrackDevices called with:', query);
  return prisma.trackDevice.findMany(query);
};

export const findTrackDeviceByName = async (name: string) => {
  console.log('findTrackDeviceByName called with:', name);
  return prisma.trackDevice.findUnique({ where: { name } });
};