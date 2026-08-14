import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Database Seeding...');

  // Clean existing tables
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const sellerPassword = await bcrypt.hash('seller1234', 10);
  const shopperPassword = await bcrypt.hash('shopper1234', 10);

  const seller = await prisma.user.create({
    data: {
      name: 'Aura Seller',
      email: 'seller@aura.com',
      password: sellerPassword,
      role: 'SELLER',
    },
  });

  const shopper = await prisma.user.create({
    data: {
      name: 'Alex Morgan (Shopper)',
      email: 'shopper@aura.com',
      password: shopperPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('👤 Created demo accounts: seller@aura.com & shopper@aura.com');

  // Create 6 Categories
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Footwear', slug: 'footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { name: 'Apparel', slug: 'apparel', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
    { name: 'Travel & Bags', slug: 'travel-bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
    { name: 'Home & Office', slug: 'home-office', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80' },
    { name: 'Fitness', slug: 'fitness', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }

  console.log('🏷️ Created 6 categories');

  console.log('🎉 Database seeding completed successfully! No default products seeded to support multi-vendor architecture.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
