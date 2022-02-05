import React from 'react'
import { useForm } from 'react-hook-form'

export default function ParticipantsPreRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const registerSubmit = async (event) => {
    event.preventDefault()

    const res = await fetch('/api/register', {
      body: JSON.stringify({
        name: event.target.name.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    await res.json()
  }

  return (
    <form onSubmit={handleSubmit(registerSubmit)}>
      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input {...register('name', { required: true })} />
        {errors.name && <p>Name is required.</p>}

        <label htmlFor='email'>Email</label>
        <input {...register('email', { pattern: /\d+/ })} />
        {errors.email && <p>Please enter a valid mail.</p>}

        <label htmlFor='subject'>Subject</label>
        <select {...register('subject')}>
          <option value='health'>Health</option>
          <option value='safety'>Safety</option>
          <option value='community'>Community</option>
          <option value='legal'>Legal</option>
        </select>
        {/* What's your preferred subject */}
      </div>
      {errors.subject && <p>Please enter a valid mail.</p>}
      <input type='submit' />
    </form>
  )
}
