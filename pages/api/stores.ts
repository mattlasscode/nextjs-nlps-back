import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, domain, baseUrl } = req.body;

  if (!name || !domain || !baseUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Generate a unique API key
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

    return res.status(201).json({
      id: store.id,
      name: store.name,
      apiKey: store.apiKey,
    });
  } catch (error) {
    console.error('Error creating store:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 