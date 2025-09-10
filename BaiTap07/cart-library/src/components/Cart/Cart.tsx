import React from 'react'
import styled from 'styled-components'
import { type ICartItem } from '../../../types'
import { useCart } from './hook/useCart'
import { CartItem } from './CartItem'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { useCartContext } from './hook/CartContext'

const CartContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 70vh;
`

const CartItems = styled.div`
  overflow-y: auto;
  margin-bottom: 16px;
`

const CartSummary = styled(Card)`
  margin-top: auto;
  padding: 16px;
  background: #f8f9fa;
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`

const TotalRow = styled(SummaryRow)`
  font-weight: bold;
  font-size: 1.2rem;
  border-top: 1px solid #ddd;
  padding-top: 12px;
  margin-top: 12px;
`

const EmptyCart = styled.p`
  text-align: center;
  padding: 20px;
  color: #6c757d;
`

const CheckoutButton = styled(Button)`
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
  margin-top: 16px;
`

interface CartProps {
  isOpen?: boolean
  onClose?: () => void
  showModal?: boolean
}

export const Cart: React.FC<CartProps> = ({
  isOpen = false,
  onClose = () => {},
  showModal = false,
}) => {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCartContext()

  const handleCheckout = () => {
    alert('Proceeding to checkout!')
    clearCart()
    if (showModal) onClose()
  }

  const cartContent = (
    <CartContainer>
      <h2>Your Cart ({getTotalItems()} items)</h2>
      
      <CartItems>
        {items.length === 0 ? (
          <EmptyCart>Your cart is empty</EmptyCart>
        ) : (
          items.map((item: ICartItem) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))
        )}
      </CartItems>
      
      {items.length > 0 && (
        <CartSummary>
          <SummaryRow>
            <span>Subtotal:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Shipping:</span>
            <span>$5.00</span>
          </SummaryRow>
          <TotalRow>
            <span>Total:</span>
            <span>${(getTotalPrice() + 5).toFixed(2)}</span>
          </TotalRow>
          
          <CheckoutButton onClick={handleCheckout}>
            Proceed to Checkout
          </CheckoutButton>
        </CartSummary>
      )}
    </CartContainer>
  )

  if (showModal) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Shopping Cart">
        {cartContent}
      </Modal>
    )
  }

  return cartContent
}