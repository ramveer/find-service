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

export const upsertUserByPhone = (phone: string, otp: string) => {
  console.log('upsertUserByPhone called with:', { phone, otp });
  return prisma.user.upsert({
    where: { phone },
    update: { otp },
    create: { phone, name: '', otp }
  });
};

export const findUserByPhone = (phone: string) => {
  console.log('findUserByPhone called with:', phone);
  return prisma.user.findUnique({ where: { phone } });
};

export const clearUserOTP = (phone: string) => {
  console.log('clearUserOTP called with:', phone);
  return prisma.user.update({ where: { phone }, data: { otp: null } });
};
export function findUnique(arg0: String) {
    console.log('findUnique called with:', arg0);
    return prisma.trackDevice.findUnique(arg0);
}

export function createDevice(arg0: { data: { name: string; userId: number; shareType: string; isActive: boolean; }; }) {
    console.log('createDevice called with:', arg0);
    return prisma.trackDevice.create(arg0);
}

export function createUser(arg0: { data: { name: string; email: string; phone: string; isVerified: boolean; isActive: boolean; }; }) {
   console.log('createUser called with:', arg0);
   return prisma.user.create(arg0);
}


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
