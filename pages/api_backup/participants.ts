import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY
})

const queryDb = async(cursor?: string) => {
  const dbId = process.env.NOTION_PARTICIPANTS_DB
  if(!dbId){
    return []
  }
  const response = await notion.databases.query({
    database_id: dbId,
    start_cursor: cursor
  })
  const participants = [...response.results]

  if(response.has_more){
    const more = await queryDb(response.next_cursor)
    participants.push(...more)
  }

  return participants;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const notionRes = await queryDb()

  res.status(200).json({ num: notionRes.length })
}
