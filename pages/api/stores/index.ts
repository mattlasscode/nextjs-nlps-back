import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { name, domain, baseUrl } = req.body;

      // Validate input
      if (!name || !domain || !baseUrl) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Generate API key
      const apiKey = crypto.randomBytes(32).toString('hex');

      // Create store
      const store = await prisma.store.create({
        data: {
          name,
          domain,
          baseUrl,
          apiKey,
        },
      });

      return res.status(200).json({
        id: store.id,
        apiKey: store.apiKey,
        message: 'Store registered successfully',
      });
    } catch (error) {
      console.error('Error creating store:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const { apiKey } = req.headers;

      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      const store = await prisma.store.findUnique({
        where: { apiKey: apiKey as string },
        include: {
          products: {
            select: {
              id: true,
              title: true,
              description: true,
              url: true,
              price: true,
              image: true,
              sku: true,
            },
          },
        },
      });

      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }

      return res.status(200).json(store);
    } catch (error) {
      console.error('Error fetching store:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 