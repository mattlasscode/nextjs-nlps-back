// pages/api/load.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'
import { v4 as uuidv4 } from 'uuid'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

globalThis.memoryDB = globalThis.memoryDB || []

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { items } = req.body
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected items array' })

  const embeddings = await openai.createEmbedding({
    model: 'text-embedding-3-small',
    input: items.map(i => i.title),
  })

  items.forEach((item, i) => {
    globalThis.memoryDB.push({
      id: uuidv4(),
      ...item,
      embedding: embeddings.data.data[i].embedding,
    })
  })

  res.status(200).json({ success: true, count: items.length })
}
