import jwt from 'jsonwebtoken';
export const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '365d' });
};

export const sendOTP = async (phone: string, otp: string) => {
  console.log(`Sending OTP ${otp} to ${phone}`);
}; 