import * as React from 'react'

import { FaEnvelopeOpenText } from '@react-icons/all-files/fa/FaEnvelopeOpenText'
import { FaGithub } from '@react-icons/all-files/fa/FaGithub'
import { FaLinkedin } from '@react-icons/all-files/fa/FaLinkedin'
import { FaMastodon } from '@react-icons/all-files/fa/FaMastodon'
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter'
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube'
import { FaZhihu } from '@react-icons/all-files/fa/FaZhihu'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'

import * as config from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export const FooterImpl: React.FC = () => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  const onToggleDarkMode = React.useCallback(
    (e) => {
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode]
  )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}> (c) {new Date().getFullYear()} {config.author}</div>

      <div className={styles.settings}>
        {hasMounted && (
          <a
            className={styles.toggleDarkMode}
            href='#'
            role='button'
            onClick={onToggleDarkMode}
            title='Toggle dark mode'
          >
            {isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
          </a>
        )}
      </div>

      <div className='right-footer'>
        <div style={{ display: "flex", gap: 15}}>
            <a
              href='https://lgbtqcenter.org.il/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <img src="https://lgbtqcenter.org.il/wp-content/uploads/2019/08/lgbt_GayCenter-Logo.svg" style={{
                    maxHeight: "50px",
                    width: "100%",
                    height: "auto"
              }}/>
            </a>

            <a
              href='https://www.tel-aviv.gov.il/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <img src="https://www.tel-aviv.gov.il/_layouts/15/TlvSP2013PublicSite/images/header/logo-mobile.png" style={{
                    maxHeight: "50px",
                    height: "auto"
              }}/>
            </a>
        </div>


        <div className={styles.social}>
          {config.twitter && (
            <a
              className={styles.twitter}
              href={`https://twitter.com/${config.twitter}`}
              title={`Twitter @${config.twitter}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaTwitter />
            </a>
          )}

          {config.mastodon && (
            <a
              className={styles.mastodon}
              href={config.mastodon}
              title={`Mastodon ${config.getMastodonHandle()}`}
              rel='me'
            >
              <FaMastodon />
            </a>
          )}

          {config.zhihu && (
            <a
              className={styles.zhihu}
              href={`https://zhihu.com/people/${config.zhihu}`}
              title={`Zhihu @${config.zhihu}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaZhihu />
            </a>
          )}

          {config.github && (
            <a
              className={styles.github}
              href={`https://github.com/${config.github}`}
              title={`GitHub @${config.github}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaGithub />
            </a>
          )}

          {config.linkedin && (
            <a
              className={styles.linkedin}
              href={`https://www.linkedin.com/in/${config.linkedin}`}
              title={`LinkedIn ${config.author}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaLinkedin />
            </a>
          )}

          {config.newsletter && (
            <a
              className={styles.newsletter}
              href={`${config.newsletter}`}
              title={`Newsletter ${config.author}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaEnvelopeOpenText />
            </a>
          )}

          {config.youtube && (
            <a
              className={styles.youtube}
              href={`https://www.youtube.com/${config.youtube}`}
              title={`YouTube ${config.author}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaYoutube />
            </a>
          )}
        </div>
      </div>

    </footer>
  )
}

export const Footer = React.memo(FooterImpl)
