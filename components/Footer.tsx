import * as React from 'react'
import * as config from 'lib/config'

import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export const Footer = () => {
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        Copyright {new Date().getFullYear()} {config.author}
      </div>

      {!!hasMounted && (
        <div className={styles.logos}>
          2022 sponsors:
          <a
            href='https://lgbtqcenter.org.il/'
            target='_blank'
            title='TLV LGBTQ center'
          >
            <img
              src={`https://${process.env.NEXT_PUBLIC_DOMAIN}/lgbt-logo-dark.jpeg`}
              style={{ maxHeight: 50 }}
            />
          </a>
        </div>
      )}
    </footer>
  )
}
