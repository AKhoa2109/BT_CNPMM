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
      name: 'Iphone 17 Pro Max',
      price: 39.99,
      image: 'https://minhtuanmobile.com/uploads/products/iphone-16-plus-teal-pdp-image-position-1a-teal-color-vn-vi-240910110648.jpg',
    },
    {
      id: '2',
      name: 'Macbook Air M1',
      price: 29.99,
      image: 'https://product.hstatic.net/200000348419/product/macbook_air_13_inch_m1_2020_gold_0_94de8487ca60405dbf1bfea674d4ae7b_master.png',
    },
    {
      id: '3',
      name: 'Laptop HP',
      price: 19.99,
      image: 'https://e7.pngegg.com/pngimages/376/576/png-clipart-laptop-hewlett-packard-intel-hp-pavilion-gaming-computer-laptop-gadget-electronics-thumbnail.png',
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
