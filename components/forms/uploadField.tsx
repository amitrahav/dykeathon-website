import { useField } from '@formiz/core'
import React from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadField(props) {
  const {
    errorMessage,
    id,
    isValid,
    isPristine,
    isSubmitted,
    resetKey,
    setValue
  } = useField(props)

  const { name, label, required, accept } = props
  const [isFocused, setIsFocused] = React.useState(false)
  const showError = !isValid && (!isPristine || isSubmitted)

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: accept || 'image/*',
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles.length) {
        setValue(null)
        return
      }
      setValue(acceptedFiles[0])
    }
  })

  return (
    <div className={`form-group ${showError ? 'is-error' : ''}`}>
      <label className='label' htmlFor={id}>
        {label}
        {required && ' *'}
      </label>

      <div {...getRootProps({ className: `dropzone isFocused`, tabIndex: -1 })}>
        <input
          key={resetKey}
          id={id}
          name={name}
          type='file'
          className='uploader-input'
          aria-invalid={!isValid}
          aria-describedby={!isValid ? `${id}-error` : null}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...getInputProps({ style: { display: 'block' } })}
        />
      </div>
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
