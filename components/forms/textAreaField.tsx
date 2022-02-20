import { useField } from '@formiz/core'
import React from 'react'

export default function TextField(props) {
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
  const { label, required, name, placeholder } = props
  const [isFocused, setIsFocused] = React.useState(false)
  const showError = !isValid && !isFocused && (!isPristine || isSubmitted)

  return (
    <div className={`form-group ${showError ? 'is-error' : ''}`}>
      <label className='label' htmlFor={id}>
        {label}
        {required && ' *'}
      </label>
      <textarea
        key={resetKey}
        id={id}
        name={name}
        value={value || ''}
        className='text-input'
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={!isValid}
        aria-describedby={!isValid ? `${id}-error` : null}
      />
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
