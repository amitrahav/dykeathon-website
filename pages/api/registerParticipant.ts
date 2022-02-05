import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'

const buildType = (fieldType, value) => {
  return {
    [fieldType]: [
      {
        text: {
          content: value
        }
      }
    ]
  }
}
const mapDatasToNotionDBFields = ({
  name,
  email,
  cv,
  linkedin,
  workSeek,
  recruitersApproval,
  teamMembers,
  skils,
  subject,
  party,
  vegetarian,
  vegan,
  food,
  kosher,
  gluten,
  questions,
  leadFrom
}) => {
  let foodPrefs = ''
  if (kosher) {
    foodPrefs += 'kosher '
  }
  if (gluten) {
    foodPrefs += 'gluten-free '
  }
  if (vegan) {
    foodPrefs += 'vegan '
  }
  if (vegetarian) {
    foodPrefs += 'vegetarian '
  }

  return {
    Name: buildType('titie', name),
    Email: buildType('email', email),
    CV: buildType('email', cv),
    linkedin: buildType('url', linkedin),
    'Job Searching': buildType('checkbox', workSeek),
    'Approved share CV with recruiters': buildType(
      'checkbox',
      recruitersApproval
    ),
    'team members': buildType('reach_text', teamMembers),
    'Food allergies': buildType('reach_text', food),
    Source: buildType('text', leadFrom),
    Field: buildType('multi_select', subject),
    'Staying for afterparty': buildType('checkbox', party),
    'Food preferences': buildType('multi_select', foodPrefs),
    'questions for us': buildType('reach_text', questions),
    'Skill set': buildType('reach_text', skils)
  }
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }
  const properties = mapDatasToNotionDBFields(req.body)

  const notion = new Client({
    auth: process.env.NOTION_API_KEY
  })
  const databaseId = process.env.NOTION_PARTICIPANTS_DB
  const response = await notion.pages.create({
    parent: {
      database_id: databaseId
    },
    properties
  })

  res.status(200).json(response)
}
