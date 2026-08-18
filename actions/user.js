"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const getCurrentUser = async () => {
  const { userId } = await auth();
  if (!userId) return null;

  return db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      role: true,
      name: true,
      title: true,
      company: true,
      imageUrl: true,
    },
  });
};
