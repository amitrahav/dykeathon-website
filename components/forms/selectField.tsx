import { useField } from '@formiz/core'
import React from 'react'
import Select from 'react-select'

export default function TextField(props) {
  const {
    errorMessage,
    id,
    isValid,
    isPristine,
    isSubmitted,
    setValue,
    value
  } = useField(props)

  const { label, options, required, name, mutliple } = props
  const [isFocused, setIsFocused] = React.useState(false)
  const showError = !isValid && !isFocused && (!isPristine || isSubmitted)

  return (
    <div className={`form-group ${showError ? 'is-error' : ''}`}>
      <label className='label' htmlFor={id}>
        {label}
        {required && ' *'}
      </label>
      <Select
        isMulti={mutliple || false}
        id={id}
        name={name}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        onChange={(value) => setValue(value)}
        value={value}
        options={options}
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
