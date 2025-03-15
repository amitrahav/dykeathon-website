// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const imgs = withBundleAnalyzer({
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      process.env.NEXT_PUBLIC_VERCEL_URL || '',
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

module.exports = {
  async redirects() {
    return [
      {
        source: '/3f28084663cc46a9a912104ac657942f',
        destination: '/',
        permanent: true
      },
      {
        source: '/tech-person-registration',
        destination: '/main-registration',
        permanent: true
      },
      {
        source: '/hidden-links-page-1b3949a289bd8085851cd085e459b7b5',
        destination: '/',
        permanent: true
      }
    ]
  },
  ...imgs,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error
      config.resolve.fallback = {
        fs: false,
        child_process: false,
        net: false,
        tls: false,
        http2: false
      }
    }
    return config
  },
  // Exclude API routes from the export process
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    // Remove API routes from export
    const pathMap = { ...defaultPathMap }

    // Filter out api_backup routes
    Object.keys(pathMap).forEach((path) => {
      if (path.startsWith('/api_backup/')) {
        delete pathMap[path]
      }
    })

    return pathMap
  }
}
