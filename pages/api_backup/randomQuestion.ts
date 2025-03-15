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

  const databaseId = process.env.NOTION_QUESTIONS_DB
  if(!databaseId){
    return res.status(500).send({ error: 'NOTION_QUESTIONS_DB is not set' })
  }
  const response = await notion.databases.query({
    database_id: databaseId
  })
  const questions = response.results.map(
    //   @ts-ignore
    (q) => q.properties.Question.title[0].plain_text
  )
  if(questions.length === 0){
    return res.status(500).send({ error: 'No questions found' })
  }
  const rand = Math.floor(Math.random() * questions.length)

  res.status(200).json({ question: questions[rand] })
}
