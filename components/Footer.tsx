import * as React from 'react'
// import { IoSunnyOutline, IoMoonSharp } from 'react-icons/io5'
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

      {hasMounted ? (
        <div className={styles.logos}>
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
          <a href='https://www.is.com/' target='_blank' title='Ironsource'>
            <img
              src={`https://s3.amazonaws.com/tracxn-data-image/logo/company/5da9fa5a2fb4fffa1cc11b92dbc2e423`}
              style={{ maxHeight: 50 }}
            />
          </a>
          <a href='https://www.intuit.com/' target='_blank' title='Intuit'>
            <img
              src={`https://soupizza.co.il/wp-content/uploads/2016/07/logo-intuit-preferred.png`}
              style={{ maxHeight: 50 }}
            />
          </a>
          <a
            href='https://www.f2vc.com/'
            target='_blank'
            title='F2 Venture Capital'
          >
            <img
              src={`https://image.pitchbook.com/l6SIXOX224HxvqLkYPr2xv6LpHQ1588754661524_200x200`}
              style={{ maxHeight: 50 }}
            />
          </a>
          <a href='https://hourone.ai/' target='_blank' title='HourOne.ai'>
            <img
              src={`https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/auxhogpcwgr19zub2qgi`}
              style={{ maxHeight: 50 }}
            />
          </a>
        </div>
      ) : null}
    </footer>
  )
}
