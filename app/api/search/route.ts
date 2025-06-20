import { NextRequest, NextResponse } from 'next/server';
import { searchListings, searchByImage } from '@/lib/search';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, imageUrl } = body;

    if (!query && !imageUrl) {
      return NextResponse.json(
        { error: 'Either query or imageUrl must be provided' },
        { status: 400 }
      );
    }

    let results;
    if (imageUrl) {
      results = await searchByImage(imageUrl);
    } else {
      results = await searchListings(query);
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 