import * as userRepo from '../repository/user.repository';

// Generate OTP
async function generateOtp(userId: number, type: 'LOGIN' | 'PASSWORD_RESET') {
  console.log('generateOtp called with:', { userId, type });
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

  console.log('OTP generated and saved:', otp);

  // Send OTP via SMS (use your SMS utility)
  // sendSms(user.phone, `Your OTP is ${otp}`);
}

// Verify OTP
async function verifyOtp(userId: number, inputOtp: string, type: 'LOGIN' | 'PASSWORD_RESET') {
  console.log('verifyOtp called with:', { userId, inputOtp, type });
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
    console.warn('Invalid or expired OTP for:', { userId, inputOtp, type });
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

  console.log('OTP verified successfully for:', userId);
  return 'OTP verified successfully.';
}