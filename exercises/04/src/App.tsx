import { useState } from 'react'
import './App.css'

interface Product {
  id: number
  name: string
  price: number
}

function App() {
  // Define products
  const products: Product[] = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Wireless Mouse', price: 29.99 },
    { id: 3, name: 'Mechanical Keyboard', price: 89.99 },
    { id: 4, name: 'USB-C Cable', price: 12.99 }
  ]

  const [cart, setCart] = useState<Product[]>([])

  // Add product to cart
  const addToCart = (product: Product) => {
    //add it only once
    if (cart.some(item => item.id === product.id)) {
      return
    }
    setCart([...cart, product])
  }

  // Remove product from cart
  const removeFromCart = (product: Product) => {
    setCart(cart.filter(item => item.id !== product.id))
  }

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price, 0)

  return (
    <div className="app-container">
      <h1>Shopping Cart</h1>
      <div className="content">
        <div className="products-section">
          <h2>Products</h2>
          <div className="products-list">
            {products.map((product, index) => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p className="price">${product.price.toFixed(2)}</p>
                <button
                  data-testid={`add-${index}`}
                  onClick={() => addToCart(product)}
                  className="add-button"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <h2>Cart</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    data-testid={`cart-item-${item.id}`}
                    className="cart-item"
                  >
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price"> ${item.price.toFixed(2)}</span>
                    </div>
                    <button
                      data-testid={`remove-${item.id}`}
                      onClick={() => removeFromCart(item)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-total">
                <button onClick={() => setCart([])} className="clear-cart-button">Clear Cart</button>
                <strong>Total: </strong>
                <span data-testid="cart-total">${totalPrice.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
