// pages/api/load.ts
// Updated for Vercel deployment - OpenAI SDK v4+ and UUID support
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import * as cheerio from 'cheerio'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

declare global {
  // eslint-disable-next-line no-var
  var memoryDB: any[] | undefined;
}
globalThis.memoryDB = globalThis.memoryDB || [];

interface Book {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

async function scrapeBooks(): Promise<Book[]> {
  try {
    const response = await axios.get('https://www.gibert.com/livres/livres-nouveaute-7702.html', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      }
    })

    const $ = cheerio.load(response.data)
    const books: Book[] = []

    // Get the first 10 books
    $('.product-item').slice(0, 10).each((_, element) => {
      const title = $(element).find('.product-name a').text().trim()
      let description = $(element).find('.product-description').text().trim()
      
      // If no description, use category + price as fallback
      if (!description) {
        const category = $(element).find('.product-category').text().trim()
        const price = $(element).find('.price').text().trim()
        description = `${category} - ${price}`
      }

      const url = $(element).find('.product-name a').attr('href')
      const image = $(element).find('img').attr('src')

      books.push({
        title,
        description,
        url: url ? `https://www.gibert.com${url}` : undefined,
        image
      })
    })

    return books
  } catch (error) {
    console.error('Error scraping books:', error)
    throw error
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Scrape books from the website
    const books = await scrapeBooks()

    // Create embeddings for each book
    const embedded = await Promise.all(books.map(async (book) => {
      const text = `${book.title} ${book.description}`
      const embeddingRes = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      })

      return {
        id: uuidv4(),
        ...book,
        embedding: embeddingRes.data[0].embedding,
      }
    }))

    // Store in memory
    globalThis.memoryDB = embedded

    res.status(200).json({ 
      success: true, 
      count: embedded.length,
      books: embedded.map(({ title, description, url, image }) => ({ title, description, url, image }))
    })
  } catch (error) {
    console.error('Error in load handler:', error)
    res.status(500).json({ 
      error: 'Failed to load books',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
