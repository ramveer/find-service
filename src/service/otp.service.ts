import * as userRepo from '../repository/user.repository';

// Generate OTP
async function generateOtp(userId: number, type: 'LOGIN' | 'PASSWORD_RESET') {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes

  await userRepo.createOtp({
    data: {
      userId,
      otp,
      type,
      expiresAt,
    },
  });

  // Send OTP via SMS (use your SMS utility)
  // sendSms(user.phone, `Your OTP is ${otp}`);
}

// Verify OTP
async function verifyOtp(userId: number, inputOtp: string, type: 'LOGIN' | 'PASSWORD_RESET') {
  const otpRecord = await userRepo.findOtpFirst({
    where: {
      userId,
      otp: inputOtp,
      type,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otpRecord) {
    throw new Error('Invalid or expired OTP.');
  }

  // Mark OTP as used
  await userRepo.updateOTP({
    where: { id: otpRecord.id },
    data: { isUsed: true },
  });

  // If OTP is for login, mark user as verified
  if (type === 'LOGIN') {
    await userRepo.updateUser({
      where: { id: userId },
      data: { isVerified: true },
    });
  }

  return 'OTP verified successfully.';
}