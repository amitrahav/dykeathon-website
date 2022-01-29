import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }
  const notion = new Client({
    auth: process.env.NOTION_API_KEY
  })

  const databaseId = process.env.NOTION_PARTICIPANTS_DB
  const response = await notion.databases.query({
    database_id: databaseId
  })

  res.status(200).json({ num: response.results.length })
}
