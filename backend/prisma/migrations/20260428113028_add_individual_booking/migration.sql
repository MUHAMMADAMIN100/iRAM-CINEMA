-- CreateEnum
CREATE TYPE "IndividualBookingStatus" AS ENUM ('NEW', 'CONTACTED', 'CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "IndividualBooking" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "movieTitle" TEXT NOT NULL,
    "preferredAt" TIMESTAMP(3) NOT NULL,
    "guestsCount" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "IndividualBookingStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndividualBooking_pkey" PRIMARY KEY ("id")
);
