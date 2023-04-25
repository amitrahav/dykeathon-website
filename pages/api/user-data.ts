import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY
})

const queryDb = async (id: string) => {
  const response = await notion.pages.retrieve({
    page_id: id
  })
  return response;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }
    const userId: string = req.query.id as string;
    console.log({userId});
    if (!userId) {
        return res.status(422).send({ error: 'no userId provided' })
    }

    const notionRes = await queryDb(userId)

    if (!notionRes) {
      return res.status(500).send({ error: 'Could not find registered user' })
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.status(200).json(notionRes.properties)
}
