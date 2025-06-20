import { Pinecone } from '@pinecone-database/pinecone';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
  environment: process.env.PINECONE_ENVIRONMENT || '',
});

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: {
    url: string;
    roomType?: string;
    style?: string;
  }[];
  score: number;
}

export async function searchListings(query: string): Promise<SearchResult[]> {
  try {
    // Generate text embedding
    const textEmbedding = await generateTextEmbedding(query);

    // Search in Pinecone
    const index = pinecone.index('listings');
    const searchResults = await index.query({
      vector: textEmbedding,
      topK: 10,
      includeMetadata: true,
    });

    // Fetch full listing details from database
    const listingIds = searchResults.matches.map(match => match.id);
    const listings = await prisma.listing.findMany({
      where: {
        id: { in: listingIds },
      },
      include: {
        images: true,
      },
    });

    // Combine search scores with listing details
    const results = listings.map(listing => {
      const match = searchResults.matches.find(m => m.id === listing.id);
      return {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        images: listing.images.map(img => ({
          url: img.url,
          roomType: img.roomType,
          style: img.style,
        })),
        score: match?.score || 0,
      };
    });

    return results.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error searching listings:', error);
    throw error;
  }
}

export async function searchByImage(imageUrl: string): Promise<SearchResult[]> {
  try {
    // Generate image embedding (using the same vector generation as in imageProcessing.ts)
    const imageVector = await generateImageVector(imageUrl);

    // Search in Pinecone
    const index = pinecone.index('listings');
    const searchResults = await index.query({
      vector: imageVector,
      topK: 10,
      includeMetadata: true,
    });

    // Fetch full listing details
    const listingIds = searchResults.matches.map(match => match.id);
    const listings = await prisma.listing.findMany({
      where: {
        id: { in: listingIds },
      },
      include: {
        images: true,
      },
    });

    // Combine search scores with listing details
    const results = listings.map(listing => {
      const match = searchResults.matches.find(m => m.id === listing.id);
      return {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        images: listing.images.map(img => ({
          url: img.url,
          roomType: img.roomType,
          style: img.style,
        })),
        score: match?.score || 0,
      };
    });

    return results.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error searching by image:', error);
    throw error;
  }
}

async function generateTextEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  return response.data[0].embedding;
}

async function generateImageVector(imageUrl: string): Promise<number[]> {
  // This should use the same vector generation as in imageProcessing.ts
  // For now, returning a placeholder
  return Array(512).fill(0).map(() => Math.random());
} 