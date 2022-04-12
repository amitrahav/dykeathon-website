import React, { useEffect, useState } from 'react'
import { api } from '../lib/config'

export default function Participants(props) {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoading) return
    setLoading(true)
    fetch(api.getRandomQuestion, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.question)
        setLoading(false)
      })
  }, [])

  return (
    <h2
      {...props}
      style={{
        direction: 'rtl',
        lineHeight: 'calc(100vh - 0.83em * 2)',
        textAlign: 'center',
        color: 'white'
      }}
    >
      {data}
    </h2>
  )
}
