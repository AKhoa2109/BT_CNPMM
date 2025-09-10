import React from 'react'
import styled from 'styled-components'
import { type ICartItem } from '../../../types'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { InputText } from '../common/InputText'

const ItemContainer = styled(Card)`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
`

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`

const ItemDetails = styled.div`
  flex: 1;
`

const ItemName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.1rem;
`

const ItemPrice = styled.p`
  margin: 0;
  color: #007bff;
  font-weight: bold;
`

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const QuantityInput = styled(InputText)`
  width: 60px;
  text-align: center;
`

const RemoveButton = styled(Button)`
  background: #dc3545;
  
  &:hover {
    background: #c82333;
  }
`

interface CartItemProps {
  item: ICartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 0
    onUpdateQuantity(item.id, newQuantity)
  }

  return (
    <ItemContainer>
      {item.image && <ItemImage src={item.image} alt={item.name} />}
      <ItemDetails>
        <ItemName>{item.name}</ItemName>
        <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
      </ItemDetails>
      <QuantityControl>
        <QuantityInput
          type="number"
          value={item.quantity}
          onChange={handleQuantityChange}
          min={1}
        />
        <RemoveButton
          onClick={() => onRemove(item.id)}
          variant="danger"
        >
          Remove
        </RemoveButton>
      </QuantityControl>
    </ItemContainer>
  )
}