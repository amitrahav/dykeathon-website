import { useField } from '@formiz/core'
import React from 'react'

export default function CheckboxField(props) {
  const {
    errorMessage,
    id,
    isValid,
    isPristine,
    isSubmitted,
    resetKey,
    setValue,
    value
  } = useField(props)
  const { label, required, name } = props
  const [isFocused, setIsFocused] = React.useState(false)
  const showError = !isValid && !isFocused && (!isPristine || isSubmitted)

  return (
    <div className={`form-group ${showError ? 'is-error' : ''}`}>
      <input
        key={resetKey}
        id={id}
        name={name}
        type={'checkbox'}
        checked={value}
        className='checkbox-input'
        onChange={(e) => setValue(e.target.checked)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={!isValid}
        aria-describedby={!isValid ? `${id}-error` : null}
      />
      <label className='label' htmlFor={id}>
        {label}
        {required && ' *'}
      </label>
      {showError && (
        <div id={`${id}-error`} className='demo-form-feedback'>
          <p className='error' style={{ margin: '0 0 0 15px' }}>
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  )
}
