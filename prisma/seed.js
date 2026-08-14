const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Database Seeding (Node JS)...');

  // Clean existing tables
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const shopperPassword = await bcrypt.hash('shopper1234', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Aura Admin',
      email: 'admin@aura.com',
      password: adminPassword,
      role: 'ADMIN',
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

  console.log('👤 Created demo accounts: admin@aura.com & shopper@aura.com');

  // Create 6 Categories
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Footwear', slug: 'footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { name: 'Apparel', slug: 'apparel', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
    { name: 'Travel & Bags', slug: 'travel-bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
    { name: 'Home & Office', slug: 'home-office', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80' },
    { name: 'Fitness', slug: 'fitness', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80' },
  ];

  const categoriesMap = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({ data: cat });
    categoriesMap[cat.slug] = createdCat.id;
  }

  console.log('🏷️ Created 6 categories');

  // Seed Products
  const productsData = [
    {
      title: 'Aura Sound ANC Wireless Headphones',
      slug: 'aura-sound-anc-headphones',
      description: 'Active Noise-Cancelling Bluetooth 5.3 over-ear headphones with 45-hour battery life and spatial audio driver.',
      price: 199.99,
      compareAtPrice: 249.99,
      categorySlug: 'electronics',
      images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']),
      stock: 45,
      rating: 4.9,
      featured: true,
      tags: JSON.stringify(['audio', 'bluetooth', 'noise cancelling']),
    },
    {
      title: 'Zenith OLED Smartwatch Pro',
      slug: 'zenith-oled-smartwatch-pro',
      description: 'Sleek AMOLED workout tracker with ECG, sleep monitoring, GPS, and water resistance up to 50m.',
      price: 249.50,
      compareAtPrice: 299.99,
      categorySlug: 'electronics',
      images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80']),
      stock: 30,
      rating: 4.8,
      featured: true,
      tags: JSON.stringify(['smartwatch', 'fitness', 'amoled']),
    },
    {
      title: 'Verve Studio Condenser Microphone',
      slug: 'verve-studio-condenser-microphone',
      description: 'Professional USB condenser microphone with zero-latency monitoring and custom Pop filter.',
      price: 129.00,
      compareAtPrice: 159.00,
      categorySlug: 'electronics',
      images: JSON.stringify(['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80']),
      stock: 25,
      rating: 4.7,
      featured: false,
      tags: JSON.stringify(['microphone', 'podcast', 'audio']),
    },
    {
      title: 'Minimalist Mechanical Keyboard RGB',
      slug: 'minimalist-mechanical-keyboard-rgb',
      description: 'Tactile mechanical switches with per-key customizable RGB backlighting and solid aluminum chassis.',
      price: 139.99,
      compareAtPrice: 169.99,
      categorySlug: 'electronics',
      images: JSON.stringify(['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80']),
      stock: 40,
      rating: 4.9,
      featured: true,
      tags: JSON.stringify(['keyboard', 'mechanical', 'rgb']),
    },
    {
      title: 'Aura SwiftRunner Knit Sneakers',
      slug: 'aura-swiftrunner-knit-sneakers',
      description: 'Breathable merino wool knit running shoes with cushioned responsive foam midsole.',
      price: 119.00,
      compareAtPrice: 140.00,
      categorySlug: 'footwear',
      images: JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80']),
      stock: 60,
      rating: 4.9,
      featured: true,
      tags: JSON.stringify(['sneakers', 'running', 'footwear']),
    },
    {
      title: 'Organic Heavyweight Crewneck Hoodie',
      slug: 'organic-heavyweight-crewneck-hoodie',
      description: '450gsm 100% organic French terry cotton hoodie with double-lined hood and durable ribbing.',
      price: 85.00,
      compareAtPrice: 100.00,
      categorySlug: 'apparel',
      images: JSON.stringify(['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80']),
      stock: 55,
      rating: 4.9,
      featured: true,
      tags: JSON.stringify(['hoodie', 'organic', 'apparel']),
    },
    {
      title: 'WeatherShield Technical Rain Shell',
      slug: 'weathershield-technical-rain-shell',
      description: '3-layer waterproof breathable shell jacket with fully taped seams and helmet-compatible hood.',
      price: 165.00,
      compareAtPrice: 195.00,
      categorySlug: 'apparel',
      images: JSON.stringify(['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80']),
      stock: 28,
      rating: 4.8,
      featured: true,
      tags: JSON.stringify(['jacket', 'rain jacket', 'waterproof', 'hike']),
    },
    {
      title: 'Urban Explorer Waterproof 25L Backpack',
      slug: 'urban-explorer-waterproof-25l-backpack',
      description: 'Durable 25L commuter backpack with padded 16-inch laptop sleeve, hidden anti-theft pocket, and luggage pass-through.',
      price: 110.00,
      compareAtPrice: 135.00,
      categorySlug: 'travel-bags',
      images: JSON.stringify(['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80']),
      stock: 32,
      rating: 4.9,
      featured: true,
      tags: JSON.stringify(['backpack', 'travel', 'waterproof', 'hike']),
    },
    {
      title: 'Minimalist Ergonomic LED Desk Lamp',
      slug: 'minimalist-ergonomic-led-desk-lamp',
      description: 'Touch-controlled LED desk lamp with customizable color temperature and wireless Qi charging base.',
      price: 64.99,
      compareAtPrice: 79.99,
      categorySlug: 'home-office',
      images: JSON.stringify(['https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80']),
      stock: 65,
      rating: 4.8,
      featured: true,
      tags: JSON.stringify(['lamp', 'desk', 'wireless charger']),
    },
    {
      title: 'Eco-Grip Natural Rubber Yoga Mat',
      slug: 'ecogrip-natural-rubber-yoga-mat',
      description: '6mm extra thick non-slip eco rubber yoga mat with laser-etched alignment lines.',
      price: 68.00,
      compareAtPrice: 80.00,
      categorySlug: 'fitness',
      images: JSON.stringify(['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80']),
      stock: 45,
      rating: 4.9,
      featured: true,
      tags: JSON.stringify(['yoga', 'mat', 'fitness']),
    }
  ];

  const createdProducts = [];
  for (const p of productsData) {
    const categoryId = categoriesMap[p.categorySlug];
    if (categoryId) {
      const prod = await prisma.product.create({
        data: {
          title: p.title,
          slug: p.slug,
          description: p.description,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          categoryId,
          images: p.images,
          stock: p.stock,
          rating: p.rating,
          featured: p.featured,
          tags: p.tags,
        },
      });
      createdProducts.push(prod);
    }
  }

  console.log(`📦 Seeded ${createdProducts.length} realistic products`);

  // Seed 10 Sample Orders
  const orderStatuses = ['DELIVERED', 'DELIVERED', 'SHIPPED', 'PROCESSING', 'DELIVERED', 'SHIPPED'];

  for (let i = 0; i < 10; i++) {
    const randomProduct = createdProducts[i % createdProducts.length];
    const orderNum = `ORD-${Date.now().toString().slice(-6)}-${1000 + i}`;
    const status = orderStatuses[i % orderStatuses.length];

    await prisma.order.create({
      data: {
        orderNumber: orderNum,
        userId: shopper.id,
        totalAmount: randomProduct.price * 2,
        status,
        shippingName: shopper.name,
        shippingEmail: shopper.email,
        shippingAddress: '123 Tech Avenue, Suite 400',
        shippingCity: 'San Francisco',
        shippingZip: '94107',
        paymentMethod: 'Credit Card (Test)',
        items: {
          create: [
            {
              productId: randomProduct.id,
              title: randomProduct.title,
              price: randomProduct.price,
              quantity: 2,
              image: JSON.parse(randomProduct.images)[0],
            },
          ],
        },
      },
    });

    if (i < 5) {
      await prisma.review.create({
        data: {
          productId: randomProduct.id,
          userId: shopper.id,
          userName: shopper.name,
          rating: 5,
          comment: 'Absolute top quality! Arrived early and exceeded expectations.',
        },
      });
    }
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
