// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const imgs = withBundleAnalyzer({
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      process.env.NEXT_PUBLIC_DOMAIN,
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      's3.us-west-2.amazonaws.com',
      'transitivebullsh.it'
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  }
})

const securedPages = ['/Teams-and-projects'].map(securedUrl => ({
  source: securedUrl,
  destination: '/signIn',
  permanent: true,
}))

module.exports = {
  async redirects() {
    return [
      {
        source: '/tech-person-registration',
        destination: '/main-registration',
        permanent: true,
      },{
        source: '/hidden-links-page',
        destination: '/',
        permanent: true,
      },{
        source: '/product-ideas--main-db-must-be-under-dykeathon-website-page',
        destination: '/',
        permanent: true,
      }, 
      ...securedPages
    ]
  }, 
  ...imgs
}