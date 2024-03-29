import React, { useEffect, useState } from 'react'
import { api } from '../../lib/config'
import Image from 'next/image'

export default function Participants(props) {
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoading || !!data) return
    setLoading(true)
    fetch(api.getTeams, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [isLoading, data])

  return (
    <div
      {...props}
      style={{
        display: 'flex',
        textAlign: 'center',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
      }}
    >
      {data.map((team) => (
        <div
          key={team.id}
          style={{
            flex: 1,
            minWidth: 250,
            margin: '10px',
            background: 'white',
            padding: 20,
            borderRadius: '4px'
          }}
        >
          <div
            style={{
              display: 'absolute',
              background: team.domainColor,
              color: 'white',
              padding: 10
            }}
          >
            {team.domain}
          </div>
          {team.link ? (
            <h2>
              <a href={team.link}>{team.title}</a>
            </h2>
          ) : (
            <h2>{team.title}</h2>
          )}
          {team.image && <Image src={team.image} />}
          <p style={{ textAlign: 'left' }}>By: {team.participants}</p>
        </div>
      ))}
    </div>
  )
}
