import React, { useState } from 'react';
import { Cart, Button } from './components';
import './App.css'
import { useCartContext } from './components/Cart/hook/CartContext';

function App() {
  const { addItem, items } = useCartContext();
  const [isCartOpen, setIsCartOpen] = useState(false)

  const sampleProducts = [
    {
      id: '1',
      name: 'Product 1',
      price: 19.99,
      image: 'https://via.placeholder.com/80',
    },
    {
      id: '2',
      name: 'Product 2',
      price: 29.99,
      image: 'https://via.placeholder.com/80',
    },
    {
      id: '3',
      name: 'Product 3',
      price: 39.99,
      image: 'https://via.placeholder.com/80',
    },
  ]

  return (
    <div className="App">
      <header className="App-header">
        <h1>E-commerce Store</h1>
        <Button onClick={() => setIsCartOpen(true)}>
          Open Cart ({items.length})
        </Button>
      </header>

      <div className="products">
        <h2>Products</h2>
        <div className="product-list">
          {sampleProducts.map((product) => (
            <div key={product.id} className="product">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
              <Button onClick={() => addItem(product)}>
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} showModal={true} />
    </div>
  )
}

export default App