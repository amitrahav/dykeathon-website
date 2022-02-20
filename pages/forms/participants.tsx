import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '../../lib/config'
import Select from 'react-select'

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

  const registerSubmit = async (event) => {
    setLoading(true)
    if (event.cv[0]) {
      const fileSizeValid = validateFileSize(event.cv[0])
      if (!fileSizeValid) {
        return alert('CV size exceeds 5 MiB')
      }
    }

    const data = new FormData()
    for (const key of Object.keys(event)) {
      if (key === 'cv' && event[key][0]) {
        data.append(key, event[key][0], event.name)
      }
      data.append(key, event[key])
    }

    await fetch(api.registerParticipant, {
      body: data,
      method: 'POST',
      headers: {
        Accept: 'application/json'
      }
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error(res.statusText)
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
        {errors.name && <p className='error'>Name is required.</p>}

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
        {errors.email && <p className='error'>Please enter a valid mail.</p>}

        <label htmlFor='cv'>CV</label>
        <input
          type='file'
          id='cv'
          {...register('cv')}
          accept='.pdf,application/pdf'
        />
        {errors.cv && (
          <p className='error'>This must be a valid PDF under 5mib</p>
        )}

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
        {errors.linkeding && (
          <p className='error'>Please enter a valid linkeding link.</p>
        )}

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
        {errors.recruitersApproval && (
          <p className='error'>
            We will share your CV and empoyment status only with the best
            recruiters in the industry.
          </p>
        )}
      </div>

      <div className='form-group'>
        <h3>The challange</h3>
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
        <Select
          id='subject'
          {...register('subject')}
          options={[
            { value: 'health', label: 'Health' },
            { value: 'safety', label: 'Safety' },
            { value: 'community', label: 'Community' },
            { value: 'legal', label: 'Legal' }
          ]}
        />
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

        <hr />

        <div>
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
            Vegetarian
          </label>
        </div>

        <div>
          <input
            style={{
              display: 'inline-block',
              width: 'auto',
              marginLeft: '15px'
            }}
            type='checkbox'
            {...register('vegan')}
            id='vegan'
          />
          <label
            htmlFor='vegan'
            style={{ display: 'inline-block', marginLeft: '10px' }}
          >
            Vegan
          </label>
        </div>

        <div>
          <input
            style={{
              display: 'inline-block',
              width: 'auto',
              marginLeft: '15px'
            }}
            type='checkbox'
            {...register('kosher')}
            id='kosher'
          />
          <label
            htmlFor='kosher'
            style={{ display: 'inline-block', marginLeft: '10px' }}
          >
            Kosher
          </label>
        </div>

        <div>
          <input
            style={{
              display: 'inline-block',
              width: 'auto',
              marginLeft: '15px'
            }}
            type='checkbox'
            id='gluten'
            {...register('gluten')}
          />
          <label
            htmlFor='gluten'
            style={{ display: 'inline-block', marginLeft: '10px' }}
          >
            Gluten free
          </label>
        </div>
        <br />

        <label htmlFor='foos'>
          Wanna Tell us more about your food prefernces or alergies?
        </label>
        <textarea
          id='food'
          {...register('food')}
          placeholder={'ex. have a life threatening allergy of peanuts'}
        />

        <hr />

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

      <div className='form-group flex-full'>
        <input type='submit' disabled={isLoading} />
      </div>
    </form>
  )
}
