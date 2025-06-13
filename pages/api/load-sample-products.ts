import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getEmbedding } from '../../lib/openai';

const prisma = new PrismaClient();

const sampleProducts = [
  {
    title: 'Vintage Leather Backpack',
    description: 'Handcrafted genuine leather backpack with multiple compartments and adjustable straps. Perfect for daily use or travel.',
    price: '$129.99',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    url: '/products/vintage-leather-backpack'
  },
  {
    title: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
    price: '$249.99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    url: '/products/wireless-headphones'
  },
  {
    title: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and water resistance up to 50m.',
    price: '$199.99',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    url: '/products/smart-fitness-watch'
  },
  {
    title: 'Organic Cotton T-Shirt',
    description: 'Comfortable and eco-friendly t-shirt made from 100% organic cotton. Available in multiple colors and sizes.',
    price: '$29.99',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    url: '/products/organic-cotton-tshirt'
  },
  {
    title: 'Stainless Steel Water Bottle',
    description: 'Double-walled insulated water bottle that keeps drinks cold for 24 hours and hot for 12 hours.',
    price: '$24.99',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    url: '/products/stainless-steel-bottle'
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey } = req.body;
  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }

  try {
    // Verify store exists
    const store = await prisma.store.findFirst({
      where: {
        apiKey: apiKey,
      },
    });

    if (!store) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Load sample products
    for (const product of sampleProducts) {
      const embedding = await getEmbedding(
        `${product.title} ${product.description}`
      );

      await prisma.product.create({
        data: {
          ...product,
          storeId: store.id,
          embedding,
        },
      });
    }

    return res.status(200).json({ message: 'Sample products loaded successfully' });
  } catch (error) {
    console.error('Error loading sample products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 