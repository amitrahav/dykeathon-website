import * as React from 'react'
import Head from 'next/head'

import * as config from '@/lib/config'
import * as types from '@/lib/types'
import { CustomFont } from './CustomFont'
// import { getSocialImageUrl } from '@/lib/get-social-image-url'


export const PageHead: React.FC<
  types.PageProps & {
    title?: string
    description?: string
    image?: string
    url?: string
  }
// > = ({ site, title, description, pageId, image, url }) => {
  > = ({ site, title, description, url }) => {
  const rssFeedUrl = `${config.host}/feed`

  title = title ?? site?.name
  description = description ?? site?.description

  // const socialImageUrl = getSocialImageUrl(pageId) || image
  const staticSocialImageUrl = new URL(`${config.host}/social.png`).toString()

 return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no'
      />

      <meta name='robots' content='index,follow' />
      <meta property='og:type' content='website' />
      <script async src="https://tally.so/widgets/embed.js"></script>

      {site && (
        <>
          <meta property='og:site_name' content={site.name} />
          <meta property='twitter:domain' content={site.domain} />
        </>
      )}

      {config.twitter && (
        <meta name='twitter:creator' content={`@${config.twitter}`} />
      )}

      {description && (
        <>
          <meta name='description' content={description} />
          <meta property='og:description' content={description} />
          <meta name='twitter:description' content={description} />
        </>
      )}

      { (
        <>
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:image' content={staticSocialImageUrl}/>
          <meta property='og:image' content={staticSocialImageUrl}/>
       </> 
      ) 
        
      }

      {url && (
        <>
          <link rel='canonical' href={url} />
          <meta property='og:url' content={url} />
          <meta property='twitter:url' content={url} />
        </>
      )}

      <link
        rel='alternate'
        type='application/rss+xml'
        href={rssFeedUrl}
        title={site?.name}
      />

      <meta property='og:title' content={title} />
      <meta name='twitter:title' content={title} />
      <title>{title}</title>
      <CustomFont site={site} />

    </Head>
  )
}
