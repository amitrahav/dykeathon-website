import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '../../lib/config'

export default function ParticipantsPreRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [gotTeam, setTeam] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const validateFileSize = (file: Blob): boolean => {
    const mb = file.size / 1024 / 1024
    return mb < 5
  }

  const cvPrepare = async (file: File) => {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = (e) => {
        const cv = {
          fileName: file.name,
          mimeType: file.type,
          bytes: [...new Uint8Array(e.target.result)]
        }
        resolve(cv)
      }
      fr.readAsArrayBuffer(file)
    })
  }

  const registerSubmit = async (event) => {
    setLoading(true)
    const fileSizeValid = validateFileSize(event.cv[0])
    if (!fileSizeValid) {
      return alert('CV size exceeds 5 MiB')
    }

    event.cv = await cvPrepare(event.cv[0])
    console.log({ event })

    await fetch(api.registerParticipant, {
      body: JSON.stringify(event),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then((res) => {
        try {
          console.log(res)
          return res.json()
        } catch (err) {
          return res
        }
      })
      .then((data) => {
        console.log({ data })
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <form onSubmit={handleSubmit(registerSubmit)}>
      <div className='form-group'>
        <h3>General and work status</h3>

        <label htmlFor='name'>Name</label>
        <input id='name' {...register('name', { required: true })} />
        {errors.name && <p>Name is required.</p>}

        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          {...register('email', {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'invalid email address'
            },
            required: true
          })}
        />
        {errors.email && <p>Please enter a valid mail.</p>}

        <label htmlFor='cv'>CV</label>
        <input
          type='file'
          id='cv'
          {...register('cv')}
          accept='.pdf,application/pdf'
        />
        {errors.cv && <p>This must be a valid PDF</p>}

        <label htmlFor='linkeding'>Linkedin link</label>
        <input
          id='linkedin'
          type='url'
          {...register('linkedin', {
            pattern: {
              value:
                /((https?:\/\/)?((www|\w\w)\.)?linkedin\.com\/)((([\w]{2,3})?)|([^/]+\/(([\w|\d-&#?=])+\/?){1,}))$/gm,
              message: 'invalid linkedin url. make sure that`s your public link'
            }
          })}
        />
        {errors.linkeding && <p>Please enter a valid linkeding link.</p>}

        <input
          style={{ display: 'inline-block', width: 'auto' }}
          type='checkbox'
          id='workSeek'
          defaultChecked={false}
          {...register('workSeek')}
        />
        <label
          htmlFor='workSeek'
          style={{ display: 'inline-block', marginLeft: '10px' }}
        >
          I'm looking for a new challange in my carear
        </label>
        <br />

        <input
          style={{ display: 'inline-block', width: 'auto' }}
          id='recruitersApproval'
          type='checkbox'
          defaultChecked={false}
          {...register('recruitersApproval', { required: true })}
        />
        <label
          htmlFor='recruitersApproval'
          style={{ display: 'inline-block', marginLeft: '10px' }}
        >
          I approve sharing my CV and work status with recruiters
        </label>
      </div>

      <div className='form-group'>
        <h3>The dyke-athon challange</h3>
        <input
          style={{ display: 'inline-block', width: 'auto' }}
          type='checkbox'
          id='team'
          defaultChecked={gotTeam}
          {...register('team')}
          onChange={() => setTeam(!gotTeam)}
        />
        <label
          htmlFor='team'
          style={{ display: 'inline-block', marginLeft: '10px' }}
        >
          Got a team?
        </label>
        {!gotTeam && <p>If not - we will match you with other great team</p>}

        {gotTeam && (
          <>
            <label htmlFor='teamMembers'>Whos your friends?</label>
            <p>Use ; to sparete between your team mates email addresses</p>
            <textarea id='teamMembers' {...register('teamMembers')} />
          </>
        )}

        <label htmlFor='skils'>What is your skill set</label>
        <textarea {...register('skils')} id='skils' />

        <label htmlFor='subject'>Issue to solve</label>
        <select id='subject' {...register('subject')}>
          <option value='health'>Health</option>
          <option value='safety'>Safety</option>
          <option value='community'>Community</option>
          <option value='legal'>Legal</option>
        </select>
        {/* What's your preferred subject */}
      </div>

      <div className='form-group'>
        <h3>Event prefernces</h3>
        <input
          style={{ display: 'inline-block', width: 'auto' }}
          type='checkbox'
          id='party'
          defaultChecked={true}
          {...register('party')}
        />
        <label
          htmlFor='party'
          style={{ display: 'inline-block', marginLeft: '10px' }}
        >
          I'm definitely staying for the after party
        </label>
        <p>The plan is to code from 10 to 22, and dance from 22 to 02</p>

        <input
          style={{ display: 'inline-block', width: 'auto' }}
          type='checkbox'
          id='vegetarian'
          {...register('vegetarian')}
        />
        <label
          htmlFor='vegetarian'
          style={{ display: 'inline-block', marginLeft: '10px' }}
        >
          I'm a vegetarian
        </label>

        <input
          style={{ display: 'inline-block', width: 'auto', marginLeft: '15px' }}
          type='checkbox'
          {...register('vegan')}
          id='vegan'
        />
        <label
          htmlFor='vegan'
          style={{ display: 'inline-block', marginLeft: '10px' }}
        >
          I'm a vegan
        </label>

        <input
          style={{ display: 'inline-block', width: 'auto', marginLeft: '15px' }}
          type='checkbox'
          {...register('kosher')}
          id='kosher'
        />
        <label
          htmlFor='kosher'
          style={{ display: 'inline-block', marginLeft: '10px' }}
        >
          I'm eating kosher
        </label>

        <input
          style={{ display: 'inline-block', width: 'auto', marginLeft: '15px' }}
          type='checkbox'
          id='gluten'
          {...register('gluten')}
        />
        <label
          htmlFor='gluten'
          style={{ display: 'inline-block', marginLeft: '10px' }}
        >
          I'm gluten free
        </label>
        <br />

        <label htmlFor='foos'>
          Wanna Tell us about your food prefernces and alergies?
        </label>
        <textarea
          id='food'
          {...register('food')}
          placeholder={"ex. I'm eating kosher vegetarian"}
        />

        <label htmlFor='questions'>Any qustions for us?</label>
        <textarea id='questions' {...register('questions')} />

        <label htmlFor='leadFrom'>
          And finally, would you mind telling us how you heard about the
          Dyke'athon?
        </label>
        <select {...register('leadFrom')} id='leadFrom'>
          <option value='facebook'>Facebook</option>
          <option value='linkedin'>Linkedin</option>
          <option value='twitter'>Twitter</option>
          <option value='friend'>A friend</option>
        </select>
      </div>

      <div className='form-group'>
        <input type='submit' disabled={isLoading} />
      </div>
    </form>
  )
}

