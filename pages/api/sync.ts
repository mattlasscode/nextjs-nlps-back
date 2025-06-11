import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

globalThis.memoryDB = globalThis.memoryDB || []

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { products = [], domain = 'unknown' } = req.body

  const embedded = await Promise.all(products.map(async (p: any) => {
    const embeddingRes = await openai.createEmbedding({
      model: 'text-embedding-3-small',
      input: `${p.title} ${p.description || ''}`,
    })
    return {
      ...p,
      embedding: embeddingRes.data.data[0].embedding,
      domain,
    }
  }))

  globalThis.memoryDB = embedded
  res.status(200).json({ success: true, count: embedded.length })
}

