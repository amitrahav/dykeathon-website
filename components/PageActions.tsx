import React from 'react'

import styles from './styles.module.css'

/**
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/web-intents/overview
 */
export const PageActions: React.FC<{ tweet: string }> = () => {
  return <div className={styles.pageActions} />
}
