import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'
import Readable from 'stream'
import { google } from 'googleapis'
import credentials from '../../credentials.json'

export const config = { api: { bodyParser: { sizeLimit: '5MB' } } }
function bufferToStream(myBuuffer: ArrayBuffer) {
  const readable:any = new Readable()
  readable._read = () => {} // _read is required but you can noop it
  readable.push(myBuuffer)
  readable.push(null)
  
  return readable
}

// const cvPrepare = async (file: File) => {
//   return new Promise((resolve, reject) => {
//     const fr = new FileReader()
//     fr.onload = (e) => {
//       const cv = {
//         fileName: file.name,
//         mimeType: file.type,
//         bytes: [...new Int8Array(e.target.result)]
//       }
//       resolve(cv)
//     }
//     fr.readAsArrayBuffer(file)
//   })
// }
export class GoogleDriveService {
  private driveClient

  public constructor() {
    this.driveClient = this.createDriveClient()
  }

  createDriveClient() {
    const scopes = ['https://www.googleapis.com/auth/drive']
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      scopes
    )

    return google.drive({
      version: 'v3',
      auth
    })
  }

  public uploadFile(bytes: ArrayBuffer, fileName: string, mimeType: string) {
    const folderId: string = process.env.GOOGLE_CV_FOLDER
    return this.driveClient.files
      .create({
        resource: {
          name: fileName,
          mimeType: mimeType,
          parents: folderId ? [folderId] : []
        },
        media: {
          mimeType: mimeType,
          body: bufferToStream(bytes)
        },
        fields: 'id'
      })
      .then((response) => {
        console.log({ response, bytes, fileName, mimeType })
        return response.config.url
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

const buildType = (fieldType: string, value: [any] | any, fieldDesc) => {
  console.log({ fieldType, value })
  if (value === undefined || value === '') {
    return
  }
  let field = fieldDesc
  switch (fieldType) {
    case 'date':
      field.start = value
      break
    case 'multi_select':
      field.multi_select = value.map(
        (select) =>
          field.multi_select.options.filter(
            (option) => option.name === select
          )[0]
      )
      break
    case 'select':
      field.select = value
      break
    case 'email':
    case 'url':
      delete field.name
      delete field.email
      delete field.url
      field.type = 'title'
      field.title = [{ text: { content: value } }]
      break
    case 'checkbox':
      field = { checkbox: !!value }
      break
    case 'number':
      console.log('number', field)
      field.number = value
      break
    case 'title':
      field = {
        title: [{ text: { content: value } }],
        type: 'text'
      }
      break
    case 'rich_text':
      delete field.name
      delete field.rich_text
      field.title = [{ text: { content: value } }]
      field.type = 'title'
      break
    case 'phone_number':
      field.phone_number = value
      break
    default:
      console.log('unimplemented property type: ', fieldType, field)
      break
  }
  return field
}

const mapDatasToNotionDBFields = async (
  {
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
  },
  props
): Promise<object> => {
  const foodPrefs = <any>[]
  if (kosher) {
    foodPrefs.push('kosher')
  }
  if (gluten) {
    foodPrefs.push('gluten-free')
  }
  if (vegan) {
    foodPrefs.push('vegan')
  }
  if (vegetarian) {
    foodPrefs.push('vegetarian')
  }

  console.log({ cv })
  const googleClient = new GoogleDriveService()
  const cvUrl = await googleClient.uploadFile(
    cv.bytes,
    cv.fileName,
    cv.mimeType
  )
  console.log({ cvUrl })

  const mapNotionDB = {
    Name: name,
    Email: email,
    CV: cvUrl,
    Linkedin: linkedin,
    'Job Searching': workSeek,
    'Approved share CV with recruiters': recruitersApproval,
    'team members': teamMembers,
    'Food allergies': food,
    Source: leadFrom,
    Field: subject,
    'Staying for afterparty': party,
    'Food preferences': foodPrefs,
    'questions for us': questions,
    'Skill set': skils
  }

  Object.keys(mapNotionDB).forEach(function (key) {
    const built = buildType(props[key]?.type, mapNotionDB[key], props[key])
    if (built !== undefined) {
      mapNotionDB[key] = built
    }
  })
  return mapNotionDB
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }
  const databaseId = process.env.NOTION_PARTICIPANTS_DB
  const notion = new Client({
    auth: process.env.NOTION_API_KEY
  })
  const db = await notion.databases.retrieve({
    database_id: databaseId
  })
  const properties = mapDatasToNotionDBFields(req.body, db.properties)
  console.log({ properties })

  // console.log({ db })
  const response = await notion.pages.create({
    parent: {
      database_id: databaseId
    },
    properties
  })

  res.status(200).json(response)
}
