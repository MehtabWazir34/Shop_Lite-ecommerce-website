import React from 'react'

function InpLable({labelName, labelFor}) {
  return (
    <label htmlFor={labelFor} className='text-left font-medium '>{labelName}</label>
  )
}

export default InpLable
