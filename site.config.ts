import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: process.env.NEXT_PUBLIC_NOTION_ROOT_PAGE_ID,

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Dykeathon',
  domain: process.env.NEXT_PUBLIC_VERCEL_URL,
  author: 'Amit Rahav',

  // open graph metadata (optional)
  description: 'Queer women* hacking LGBTQ+ issues',

  // social usernames (optional)
  // twitter: 'transitive_bs',
  // github: 'transitive-bullshit',
  // linkedin: 'fisch2',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCoverPosition: 0.5,
  // defaultPageCover: `${process.env.NEXT_PUBLIC_VERCEL_URL}/dykeathon.png`,
  // defaultPageCover: null,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: true,
  isSearchEnabled: false,
  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  pageUrlAdditions: {
    '/projects': '2024-Projects-7135810517474cf4a3bd0a50d4821b6d',
  },
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: '2022',
      pageId: '0fab356c3de7444f98706bc98314e560'
    },{
      title: '2023',
      pageId: '4a9f5794697440129252f34ade6a0d82'
    }, {
      title: 'Hanukka 2023 meetaup',
      pageId: '3501956e4d3740a5a802a612f74e712c'
    }, {
      title: 'Press',
      pageId: '0755748c892e401d969a5f6de764a2be'
    }
  ]
})
