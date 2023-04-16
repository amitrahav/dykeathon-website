import { Formiz, useForm } from '@formiz/core'
// import * as validations from '@formiz/validations'
// import TextField from '../../components/forms/textField'
// import UploadField from '../../components/forms/uploadField'
// import CheckboxField from '../../components/forms/checkboxField'
// import TextAreaField from '../../components/forms/textAreaField'
// import SelectField from '../../components/forms/selectField'

import React, { useEffect } from 'react'
import { api } from 'lib/config'

export default function ParticipantsPreRegister() {
  const myForm = useForm()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDone, setIsDone] = React.useState(false)
  const [isEmbbeded, setIsEmbbeded] = React.useState(true)
  const submitForm = async (values) => {
    setIsLoading(true)
    const data = new FormData()
    try {
      for (const key of Object.keys(values)) {
        if (values[key] === null) {
          continue
        }
        if (key === 'cv' && values[key]) {
          data.append(key, values[key], values.name)
        } else if (Array.isArray(values[key])) {
          const vals = values[key].map((val) => val.value)
          data.append(key, vals)
        } else if (typeof values[key] === 'object') {
          if ('value' in values[key]) {
            data.append(key, values[key].value)
          }
        } else {
          data.append(key, values[key])
        }
      }
    } catch (err) {
      console.error(err)
      setIsLoading(false)
      return
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
        setIsDone(true)
        console.log({ data })
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // const validateFileSize = (file: Blob): boolean => {
  //   if (!file) {
  //     return true
  //   }
  //   const mb = file.size / 1024 / 1024
  //   return mb < 5
  // }

  useEffect(function onFirstMount() {
    let queryParams = new URLSearchParams()
    queryParams = new URLSearchParams(window.location.search)
    setIsEmbbeded(queryParams.get('e') !== null)
  }, []) // empty dependencies array means "run this once on first mount"

  return isDone ? (
    <form style={{ textAlign: 'center' }}>
      <h2>Check your mail for more detials (:</h2>
      <button type='button' onClick={() => setIsDone(false)}>
        Or fill this form once again
      </button>
    </form>
  ) : (
    <Formiz onValidSubmit={submitForm} connect={myForm}>
      {!isEmbbeded && <h1>Dykeathon registration</h1>}
      <form
        noValidate
        onSubmit={myForm.submitStep}
        className='demo-form'
        style={{ minHeight: '16rem', paddingBottom: 70 }}
      >

        <div className='demo-form__footer'>
          <div
            className='mr-auto'
            style={{ minWidth: '6rem', textAlign: 'left' }}
          >
            {!myForm.isFirstStep && (
              <button
                className='demo-button is-full is-primary'
                type='button'
                onClick={myForm.prevStep}
              >
                Previous
              </button>
            )}
          </div>
          <div
            className='text-sm text-gray-500 p-2 text-center w-full xs:w-auto order-first xs:order-none'
            style={{ paddingTop: '25px', textAlign: 'center' }}
          >
            <span style={{ textAlign: 'center' }}>
              {' '}
              Step {(myForm.currentStep && myForm.currentStep.index + 1) ||
                0}{' '}
              of {myForm.steps.length}
            </span>
          </div>
          <div
            className='ml-auto'
            style={{ minWidth: '6rem', textAlign: 'right' }}
          >
            {myForm.isLastStep ? (
              <button
                className='demo-button is-full is-primary'
                type='submit'
                disabled={
                  isLoading || (!myForm.isValid && myForm.isStepSubmitted)
                }
              >
                {isLoading ? 'Loading...' : 'Submit'}
              </button>
            ) : (
              <button
                className='demo-button is-full is-primary'
                type='submit'
                disabled={!myForm.isStepValid && myForm.isStepSubmitted}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </form>
    </Formiz>
  )
}
