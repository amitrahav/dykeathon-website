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

  const registerSubmit = async (event) => {
    setLoading(true)

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
        <input {...register('name', { required: true })} />
        {errors.name && <p>Name is required.</p>}

        <label htmlFor='email'>Email</label>
        <input
          type='mail'
          {...register('email', { pattern: /\d+/, required: true })}
        />
        {errors.email && <p>Please enter a valid mail.</p>}

        <label htmlFor='cv'>CV</label>
        <input type='file' {...register('cv', { pattern: /\d+/ })} />
        {errors.cv && <p>This must be a valid PDF</p>}

        <label htmlFor='linkeding'>Linkedin link</label>
        <input {...register('linkedin', { pattern: /\d+/ })} />
        {errors.linkeding && <p>Please enter a valid linkeding link.</p>}

        <input
          style={{ display: 'inline-block', width: 'auto' }}
          type='checkbox'
          defaultChecked={false}
          {...register('work-seek')}
        />
        <label
          htmlFor='work-seek'
          style={{ display: 'inline-block', marginLeft: '10px' }}
        >
          I'm looking for a new challange in my carear
        </label>
        <br />

        <input
          style={{ display: 'inline-block', width: 'auto' }}
          type='checkbox'
          defaultChecked={false}
          {...register('recruts-approval', { required: true })}
        />
        <label
          htmlFor='recruts-approval'
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
            <label>Whos your friends?</label>
            <p>Use ; to sparete between them</p>
            <textarea {...register('teamMembers')} />
          </>
        )}

        <label>What is your skill set</label>
        <textarea {...register('skils')} />

        <label htmlFor='subject'>Issue to solve</label>
        <select {...register('subject')}>
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
          {...register('food')}
          placeholder={"ex. I'm eating kosher vegetarian"}
        />

        <label htmlFor='questions'>Any qustions for us?</label>
        <textarea {...register('questions')} />

        <label htmlFor='leadFrom'>
          And finally, would you mind telling us how you heard about the
          Dyke'athon?
        </label>
        <select {...register('leadFrom')}>
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
