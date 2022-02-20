/* eslint-disable dot-notation */
import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'
import {
  CreatePageParameters,
  GetDatabaseResponse
} from '@notionhq/client/build/src/api-endpoints'
import { google } from 'googleapis'
import multiparty from 'multiparty'
import fs from 'fs'

export const config = { api: { bodyParser: false } }
interface FileObject {
  fieldName: string
  originalFilename: string
  path: string
  headers: object
  size: number
}
export class GoogleDriveService {
  private driveClient

  public constructor() {
    this.driveClient = this.createDriveClient()
  }

  private credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }

  createDriveClient() {
    const scopes = ['https://www.googleapis.com/auth/drive']
    const auth = new google.auth.JWT(
      this.credentials.client_email,
      null,
      this.credentials.private_key,
      scopes
    )

    return google.drive({
      version: 'v3',
      auth
    })
  }

  public uploadFile(file: FileObject) {
    const folderId: string = process.env.GOOGLE_CV_FOLDER
    const fileName: string = file.originalFilename
    const mimeType = 'application/pdf'

    return this.driveClient.files
      .create({
        resource: {
          name: fileName,
          mimeType: mimeType,
          parents: folderId ? [folderId] : []
        },
        media: {
          mimeType: mimeType,
          body: fs.createReadStream(file.path)
        },
        fields: 'id'
      })
      .then((response) => {
        // console.log({ response, file, fileName, mimeType })
        return response.config.url
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

const buildType = (fieldType: string, value: [any] | any, fieldDesc) => {
  if (
    fieldType !== 'checkbox' &&
    (value === null || value === undefined || value === '' || !value.length)
  ) {
    return
  }
  let field = fieldDesc
  switch (fieldType) {
    case 'date':
      field = {
        start: value || new Date()
      }
      break
    case 'multi_select':
      field = {
        multi_select: value.split(',').map((select) => {
          return {
            id: field.multi_select.options.filter(
              (option) => option.name === select
            )[0]['id']
          }
        })
      }
      break
    case 'select':
      field = {
        select: {
          name: value
        }
      }
      break
    case 'checkbox':
      field = {
        checkbox: value
      }
      break
    case 'number':
      field = {
        number: value
      }
      break
    case 'url':
      field = { url: value }
      break
    case 'email':
      field = { email: value }
      break
    case 'title':
      field = {
        title: [
          {
            text: {
              content: value
            }
          }
        ]
      }
      break
    case 'rich_text':
      field = {
        rich_text: [
          {
            text: {
              content: value
            }
          }
        ]
      }
      break
    case 'phone_number':
      field = { phone_number: value }
      break
    default:
      console.log('unimplemented property type: ', fieldType, field)
      break
  }
  return field
}

const mapDatasToNotionDBFields = (data: FormFields, props, cvUrl: string) => {
  const {
    name,
    email,
    linkedin,
    workSeek,
    recruitersApproval,
    teamMembers,
    skils,
    subject,
    party,
    foodPrefs,
    food,
    questions,
    phoneNumber,
    children,
    leadFrom
  } = data

  const idsByName = Object.keys(props).reduce((result, name) => {
    result[name] = props[name].id
    return result
  }, {})

  const mapNotionDB = {
    Name: name,
    Email: email,
    CV: cvUrl,
    Linkedin: linkedin,
    'Job Searching': workSeek === 'true',
    'Approved share CV with recruiters': recruitersApproval === 'true',
    'team members': teamMembers,
    'Food allergies': food,
    Source: leadFrom,
    Field: subject,
    'Staying for afterparty': party === 'true',
    'Food preferences': foodPrefs,
    'questions for us': questions,
    'Skill set': skils,
    Phone: phoneNumber,
    'Children for daycare': children
  }

  const nameById = Object.keys(mapNotionDB).map((name) => {
    return { [idsByName[name]]: name }
  })

  const valueById = Object.values(nameById).reduce((res, key) => {
    const name = Object.values(key)[0]
    const id = Object.keys(key)[0]
    const built = buildType(props[name]?.type, mapNotionDB[name], props[name])
    if (built !== undefined) {
      res[id] = built
    }
    return res
  }, {})
  return valueById
}

interface FormFields {
  name: string
  email: string
  linkedin: string
  workSeek: 'false' | 'true'
  recruitersApproval: 'false' | 'true'
  teamMembers: string
  skils: string
  subject: string
  party: 'false' | 'true'
  food: string
  foodPrefs: string
  questions: string
  leadFrom: string
  phoneNumber: string
  children: number
}
interface dataPrased {
  err: Error
  fields: FormFields
  files: { cv: [FileObject] }
}
export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }
  const data = await new Promise(
    (resolve: (value: dataPrased) => void, reject: (value: Error) => void) => {
      const form = new multiparty.Form()

      form.parse(
        req,
        (err: Error, fields: FormFields, files: { cv: [FileObject] }) => {
          if (err) reject(err)
          resolve({ err, fields, files })
        }
      )
    }
  )

  data.fields = Object.keys(data.fields).reduce((result, key) => {
    result[key] = data.fields[key][0]
    return result
  }, data.fields)

  const databaseId = process.env.NOTION_PARTICIPANTS_DB
  const notion = new Client({
    auth: process.env.NOTION_API_KEY
  })
  const db: GetDatabaseResponse = await notion.databases.retrieve({
    database_id: databaseId
  })

  let cvUrl = null
  if (data.files.cv) {
    const googleClient = new GoogleDriveService()
    cvUrl = await googleClient.uploadFile(data.files.cv[0])
  }

  const properties = mapDatasToNotionDBFields(data.fields, db.properties, cvUrl)
  const createBody: CreatePageParameters = {
    parent: {
      database_id: databaseId
    },
    properties
  }
  try {
    const response = await notion.pages.create(createBody)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({
      res: JSON.parse(err.body).message,
      req: createBody,
      props: db.properties
    })
  }
}
