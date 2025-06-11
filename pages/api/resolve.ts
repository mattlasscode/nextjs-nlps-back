import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

globalThis.memoryDB = globalThis.memoryDB || []

function cosineSim(a: number[], b: number[]) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dot / (magA * magB)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q = '' } = req.query
  if (!q || typeof q !== 'string') return res.status(400).json({ error: 'Missing q' })

  const embeddingRes = await openai.createEmbedding({
    model: 'text-embedding-3-small',
    input: q,
  })

  const queryVec = embeddingRes.data.data[0].embedding

  const best = globalThis.memoryDB
    .map((item: any) => ({
      ...item,
      score: cosineSim(queryVec, item.embedding),
    }))
    .sort((a, b) => b.score - a.score)[0]

  res.status(200).json({ bestMatch: best?.title || null, full: best || null })
}

