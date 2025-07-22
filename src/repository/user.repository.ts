import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.$connect();
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
})();

export const upsertUserByPhone = async (phone: string, otp: string) => {
  console.log('upsertUserByPhone called with:', { phone, otp });
  return prisma.user.upsert({
    where: { phone },
    update: { otp },
    create: { phone, otp },
  });
};

export const findUserByPhone = async (phone: string) => {
    return prisma.user.findUnique({
        where: { phone },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isVerified: true,
            isActive: true,
            otp: true, // Assuming OTP is stored in the user model
        },
    });
};

export const clearUserOTP = async (phone: string) => {
  // Logic to clear OTP for a user
};

export const createUser = async (data: { name: string; email: string; phone: string; isVerified: boolean; isActive: boolean }) => {
  // Logic to create a new user in the database
};

export function createOtp(arg0: { data: { userId: number; otp: string; type: "LOGIN" | "PASSWORD_RESET"; expiresAt: Date; }; }) {
    console.log('createOtp called with:', arg0);
    return prisma.otp.create(arg0);
}
export function findOtpFirst(arg0: { where: { userId: number; otp: string; type: "LOGIN" | "PASSWORD_RESET"; isUsed: boolean; expiresAt: { gt: Date; }; }; }) {
    console.log('findOtpFirst called with:', arg0);
    return prisma.otp.findFirst(arg0);
}

export function updateOTP(arg0: { where: { id: any; }; data: { isUsed: boolean; }; }) {
   console.log('updateOTP called with:', arg0);
   return prisma.otp.update(arg0);
}


export function updateUser(arg0: { where: { id: number; }; data: { isVerified: boolean; }; }) {
    console.log('updateUser called with:', arg0);
    return prisma.user.update(arg0);
}
