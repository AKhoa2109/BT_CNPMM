import React from 'react'

export interface ICartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
}

export interface InputTextProps {
  type?: 'text' | 'number' | 'email' | 'password'
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  min?: number | string
  max?: number | string
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export interface CardProps {
  children: React.ReactNode
  className?: string
}