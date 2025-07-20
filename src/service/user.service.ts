import { sendOTP, generateToken } from '../utils/util';
import * as userRepo from '../repository/user.repository';

export const requestOtp = async (phone: string) => {
  console.log('requestOtp called with:', phone);
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
  await userRepo.upsertUserByPhone(phone, otp); // Save OTP in the database
  await sendOTP(phone, otp); // Send OTP via SMS
};

export const verifyOtp = async (phone: string, otp: string): Promise<string> => {
  console.log('verifyOtp called with:', { phone, otp });
  const user = await userRepo.findUserByPhone(phone);
  if (!user) throw new Error('User not found');
  if (user.otp !== otp) throw new Error('Invalid OTP');
  await userRepo.clearUserOTP(phone); // Clear OTP after successful verification
  return generateToken({ id: user.id, role: user.role }); // Generate JWT token
};

export const registerPrivateDevice = async ({ deviceId, owner }: { deviceId: string; owner: string }) => {
  console.log('registerPrivateDevice called with:', { deviceId, owner });
  if (!deviceId || !owner) {
    throw new Error('Device ID and owner are required');
  }

  // Check if the device already exists
  let existingDevice = await userRepo.findUnique(deviceId);
  if (existingDevice) {
    throw new Error('Device already registered');
  }

  // Create and save the new private device
  const newDevice = await userRepo.createDevice({
    data: {
      name: deviceId,
      userId: parseInt(owner), // Assuming owner is the user ID
      shareType: 'PRIVATE',
      isActive: true,
    },
  });

  return newDevice;
};

export const registerPublicDevice = async ({ deviceId }: { deviceId: string }) => {
  console.log('registerPublicDevice called with:', { deviceId });
  if (!deviceId) {
    throw new Error('Device ID is required');
  }

  // Create and save the public device
  const newDevice = await userRepo.createDevice({
    data: {
        name: deviceId,
        shareType: 'PUBLIC',
        isActive: true,
        userId: 0
    },
  });

  return newDevice;
};

export const addUserDetails = async (userDetails: { name: string; email: string; phone: string }) => {
  console.log('addUserDetails called with:', userDetails);
  const { name, email, phone } = userDetails;

  // Validate input
  if (!name || !email || !phone) {
    throw new Error('Name, email, and phone are required');
  }

  // Add user details to the database
  const newUser = await userRepo.createUser({
    data: {
      name,
      email,
      phone,
      isVerified: false,
      isActive: true,
    },
  });

  return newUser;
};
