import React from 'react'
import styled from 'styled-components'
import { type ButtonProps } from '../../../types'

const StyledButton = styled.button<ButtonProps>`
  background: ${(props) => {
    switch (props.variant) {
      case 'secondary':
        return '#6c757d'
      case 'danger':
        return '#dc3545'
      default:
        return '#007bff'
    }
  }};
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  
  &:hover {
    opacity: ${(props) => (props.disabled ? 0.6 : 0.8)};
  }
`

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
}) => {
  return (
    <StyledButton
      onClick={onClick}
      variant={variant}
      type={type}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  )
}