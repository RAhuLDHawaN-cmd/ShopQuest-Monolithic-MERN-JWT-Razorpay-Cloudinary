const mongoose = require('mongoose');
const dotenv = require('dotenv');

const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopquest.com',
      password: hashedPassword,
      role: 'admin'
    });

    const customers = await User.insertMany([
      { name: 'Maya Patel', email: 'maya@example.com', password: hashedPassword },
      { name: 'Liam Chen', email: 'liam@example.com', password: hashedPassword },
      { name: 'Ava Johnson', email: 'ava@example.com', password: hashedPassword }
    ]);

    const products = [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Immersive sound experience with advanced active noise cancellation.',
        price: 299.99,
        category: 'Electronics',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.8,
        numReviews: 24
      },
      {
        name: 'Minimalist Modern Chair',
        description: 'A stylish and comfortable addition to any contemporary living room.',
        price: 150.00,
        category: 'Furniture',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.2,
        numReviews: 12
      },
      {
        name: 'Professional DSLR Camera',
        description: 'Capture stunning moments with high-resolution clarity and speed.',
        price: 1199.99,
        category: 'Electronics',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.9,
        numReviews: 50
      },
      {
        name: 'Classic White Sneakers',
        description: 'Versatile and comfortable, a staple for any casual outfit.',
        price: 85.00,
        category: 'Clothing',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 89
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Track workouts, heart rate, and daily activity with a bright touch display.',
        price: 179.99,
        category: 'Electronics',
        stock: 22,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 37
      },
      {
        name: 'Everyday Canvas Backpack',
        description: 'A durable lightweight backpack with room for daily essentials.',
        price: 59.00,
        category: 'Accessories',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.4,
        numReviews: 18
      },
      {
        name: 'Ceramic Table Lamp',
        description: 'A warm, understated accent lamp for a bedside table or reading nook.',
        price: 74.50,
        category: 'Home',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.3,
        numReviews: 9
      },
      {
        name: 'Stainless Steel Water Bottle',
        description: 'Reusable insulated bottle that keeps drinks cold throughout the day.',
        price: 28.00,
        category: 'Accessories',
        stock: 65,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.7,
        numReviews: 42
      },
      {
        name: 'Linen Throw Pillow',
        description: 'A soft textured cushion cover that adds a relaxed touch to your sofa.',
        price: 34.99,
        category: 'Home',
        stock: 27,
        imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.1,
        numReviews: 14
      },
      {
        name: 'Classic Analog Wristwatch',
        description: 'A clean stainless steel watch with a simple, versatile dial.',
        price: 129.00,
        category: 'Accessories',
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 31
      }
    ];

    const createdProducts = await Product.insertMany(products);
    const productByName = Object.fromEntries(createdProducts.map((product) => [product.name, product]));
    const [maya, liam, ava] = customers;

    await Order.insertMany([
      {
        userId: maya._id,
        items: [
          { productId: productByName['Wireless Noise-Cancelling Headphones']._id, qty: 1, price: 299.99 },
          { productId: productByName['Stainless Steel Water Bottle']._id, qty: 2, price: 28.00 }
        ],
        totalAmount: 355.99,
        address: { fullName: maya.name, street: '12 Linking Road', city: 'Mumbai', postalCode: '400050', country: 'India' },
        paymentId: 'seed_payment_maya_001',
        status: 'Delivered'
      },
      {
        userId: liam._id,
        items: [
          { productId: productByName['Professional DSLR Camera']._id, qty: 1, price: 1199.99 },
          { productId: productByName['Everyday Canvas Backpack']._id, qty: 1, price: 59.00 }
        ],
        totalAmount: 1258.99,
        address: { fullName: liam.name, street: '88 Park Street', city: 'Kolkata', postalCode: '700016', country: 'India' },
        paymentId: 'seed_payment_liam_001',
        status: 'Shipped'
      },
      {
        userId: ava._id,
        items: [
          { productId: productByName['Classic White Sneakers']._id, qty: 1, price: 85.00 },
          { productId: productByName['Minimalist Modern Chair']._id, qty: 1, price: 150.00 },
          { productId: productByName['Ceramic Table Lamp']._id, qty: 1, price: 74.50 }
        ],
        totalAmount: 309.50,
        address: { fullName: ava.name, street: '5 Residency Road', city: 'Bengaluru', postalCode: '560025', country: 'India' },
        paymentId: 'seed_payment_ava_001',
        status: 'Pending'
      }
    ]);
    
    console.log('✅ Data Imported Successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

importData();
