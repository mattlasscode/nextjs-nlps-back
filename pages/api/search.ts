import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getEmbedding } from '../../lib/openai';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }

  try {
    // Verify store exists and API key is valid
    const store = await prisma.store.findFirst({
      where: {
        apiKey: apiKey as string,
      },
    });

    if (!store) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Get embedding for the search query
    const queryEmbedding = await getEmbedding(query);

    // Search for similar products using cosine similarity
    const results = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.url,
        p.image,
        1 - (p.embedding <=> ${queryEmbedding}::vector) as similarity
      FROM "Product" p
      WHERE p."storeId" = ${store.id}
      ORDER BY similarity DESC
      LIMIT 5
    `;

    return res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 