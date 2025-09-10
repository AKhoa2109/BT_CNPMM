import React from 'react'
import styled from 'styled-components'
import { type CardProps } from '../../../types'

const StyledCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin: 8px 0;
  border: 1px solid #e0e0e0;
`

export const Card: React.FC<CardProps> = ({ children, className }) => {
  
  return <StyledCard className={className}>{children}</StyledCard>
}