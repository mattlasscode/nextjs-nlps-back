// pages/api/load.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

declare global {
  // eslint-disable-next-line no-var
  var memoryDB: any[] | undefined;
}
globalThis.memoryDB = globalThis.memoryDB || [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { items } = req.body
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected items array' })

  const embeddings = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: items.map(i => i.title),
  })

  items.forEach((item, i) => {
    if (!globalThis.memoryDB) return;
    globalThis.memoryDB.push({
      id: uuidv4(),
      ...item,
      embedding: embeddings.data[i].embedding,
    })
  })

  res.status(200).json({ success: true, count: items.length })
}
