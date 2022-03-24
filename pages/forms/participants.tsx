import { Formiz, FormizStep, useForm } from '@formiz/core'
import * as validations from '@formiz/validations'
import TextField from '../../components/forms/textField'
import UploadField from '../../components/forms/uploadField'
import CheckboxField from '../../components/forms/checkboxField'
import TextAreaField from '../../components/forms/textAreaField'
import SelectField from '../../components/forms/selectField'

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

  const validateFileSize = (file: Blob): boolean => {
    if (!file) {
      return true
    }
    const mb = file.size / 1024 / 1024
    return mb < 5
  }

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
        <div className='demo-form__content'>
          {myForm.currentStep && <h2>{myForm.currentStep.label}</h2>}
          <FormizStep name='step1' label='General and work status'>
            <TextField
              name='name'
              label='Full Name'
              required='Name is required'
            />

            <TextField
              name='email'
              label='Email'
              type='email'
              required='Email is required'
              validations={[
                {
                  rule: validations.isEmail(),
                  message: 'Not a valid email'
                }
              ]}
            />

            <TextField
              name='linkedin'
              label='Linkedin'
              validations={[
                {
                  rule: (address) =>
                    !address ||
                    address.match(
                      /((https?:\/\/)?((www|\w\w)\.)?linkedin\.com\/)((([\w]{2,3})?)|([^/]+\/(([\w|\d-&#?=])+\/?){1,}))$/gm
                    ),
                  message:
                    'Invalid linkedin url. make sure that`s your public link'
                }
              ]}
            />
            <TextField
              name='phoneNumber'
              label='Phone number'
              validations={[
                {
                  rule: (phone) =>
                    phone === '' ||
                    phone === null ||
                    phone.match(/^[0][5][0|2|3|4|5|9]{1}[-]{0,1}[0-9]{7}$/),
                  message: 'Invalid israli phone number'
                }
              ]}
            />
            <UploadField
              name='cv'
              label='CV'
              accept='application/pdf'
              validations={[
                {
                  rule: (file: null | Blob) => !file || validateFileSize(file),
                  message: 'This must be a valid PDF under 5mib'
                }
              ]}
            />
            <CheckboxField
              name='workSeek'
              label="I'm looking for a new challange in my carear"
            />
            {/* <CheckboxField
              name='recruitersApproval'
              label='I approve sharing my CV and work status with recruiters'
              required='We will share your CV and empoyment status only with the best
                          recruiters in the industry.'
            /> */}
          </FormizStep>
          <FormizStep name='step2' label='The challange'>
            <TextAreaField
              name='teamMembers'
              label='Whos your friends? (Use ; to sparete between your team mates email addresses)'
            />
            <p>
              If you want to come alone it's fine (: We will reach out few weeks
              before the event and set you up with amaizng group
            </p>

            <SelectField
              name='subject'
              label='Preffered subject for project'
              required='Please choose a subject that your going to hack.'
              options={[
                { value: 'health', label: 'Health' },
                { value: 'safety', label: 'Safety' },
                { value: 'community', label: 'Community' },
                { value: 'legal', label: 'Legal' }
              ]}
            />

            <TextAreaField
              name='skils'
              label='What is your skill set'
              required='Please help us get to know you better'
            />
          </FormizStep>
          <FormizStep name='step3' label='Food Preferences'>
            <SelectField
              name='foodPrefs'
              mutliple={true}
              label='Your general food preferences'
              options={[
                { value: 'vegetarian', label: 'Vegetarian' },
                { value: 'vegan', label: 'Vegan' },
                { value: 'kosher', label: 'Kosher' },
                { value: 'gluten-free', label: 'Gluten Free' }
              ]}
            />

            <TextAreaField
              name='food'
              label='Wanna Tell us about your food prefernces and alergies?'
              placeholder='ex. have a life threatening allergy of peanuts'
            />
          </FormizStep>
          <FormizStep name='step4' label='Other Preferences'>
            <CheckboxField
              name='party'
              label="I'm definitely staying for the after party"
            />
            <p>The plan is to code from 10 to 22, and dance from 22 to 02</p>
            <TextAreaField
              name='questions'
              label='Any qustions for us?'
              placeholder=''
            />

            {/* <TextField
              name='children'
              label='How many children do you want to attend at our daycare durring the event?'
              type='number'
            />
            <p>
              The LGBTQ TLV center kindergarten teacher will operate a daycare
              for the dykeathon children between 16:00-22:00
            </p> */}

            <SelectField
              name='leadFrom'
              mutliple={true}
              label='And finally, would you mind telling us how you heard about the Dykeathon?'
              options={[
                { value: 'facebook', label: 'Facebook' },
                { value: 'linkedin', label: 'Linkedin' },
                { value: 'twitter', label: 'Twitter' },
                { value: 'friend', label: 'Friend' }
              ]}
            />
          </FormizStep>
        </div>

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
