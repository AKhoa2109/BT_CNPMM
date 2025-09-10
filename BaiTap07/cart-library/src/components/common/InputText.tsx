import React from 'react'
import styled from 'styled-components'
import { type InputTextProps } from '../../../types'

const StyledInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin: 4px 0;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`

export const InputText: React.FC<InputTextProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  max,
}) => {
  return (
    <StyledInput
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}  // Giờ đây hỗ trợ cả string và number
      max={max}  // Giờ đây hỗ trợ cả string và number
    />
  )
}