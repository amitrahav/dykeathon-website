/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'method not allowed' })
  }
  if(!process.env.NOTION_API_KEY){
    return res.status(500).send({ error: 'NOTION_API_KEY is not set' })
  }
  const notion = new Client({
    auth: process.env.NOTION_API_KEY
  })

  const databaseId = process.env.NOTION_TEAMS_DB
  if(!databaseId){
    return res.status(500).send({ error: 'NOTION_TEAMS_DB is not set' })
  }
  const response = await notion.databases.query({
    database_id: databaseId
  })

  const data = response.results.map((proj) => {
    return {
      id: proj.id,
      // @ts-ignore
      title: proj.properties.Name.title[0].plain_text,
      // @ts-ignore
      domain: proj.properties['תחום'].select.name,
      // @ts-ignore
      domainColor: proj.properties['תחום'].select.color,
      // @ts-ignore
      participants: proj.properties.NamesClean.formula?.string
        ?.toString()
        .replaceAll(',', ', '),
      // @ts-ignore
      image: proj.cover,
      // @ts-ignore
      link: proj.properties['Project link'].url
    }
  })
  res.status(200).json(data)
}
