-- CreateEnum
CREATE TYPE "ORDER_STATUS" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "USER_ROLES" AS ENUM ('CUSTOMER', 'RIDER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "USER_ROLES" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dishes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "popularity_score" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "restaurant_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "total_cost" INTEGER NOT NULL,
    "order_time" INTEGER NOT NULL,
    "status" "ORDER_STATUS" NOT NULL,
    "user_id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderDish" (
    "order_id" TEXT NOT NULL,
    "dish_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orderDish_pkey" PRIMARY KEY ("order_id","dish_id")
);

-- CreateTable
CREATE TABLE "Deliveries" (
    "id" TEXT NOT NULL,
    "delivery_time" INTEGER NOT NULL,
    "estimated_delivery_duration" INTEGER NOT NULL,
    "assigned_rider_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deliveries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dishes" ADD CONSTRAINT "Dishes_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderDish" ADD CONSTRAINT "orderDish_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "Dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderDish" ADD CONSTRAINT "orderDish_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliveries" ADD CONSTRAINT "Deliveries_assigned_rider_id_fkey" FOREIGN KEY ("assigned_rider_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliveries" ADD CONSTRAINT "Deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
