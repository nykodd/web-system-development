import { useState } from 'react'
import './App.css'

interface Product {
  id: number
  name: string
  price: number
}

interface CartItem extends Product {
  cartIndex: number
}

function App() {
  // Define products
  const products: Product[] = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Wireless Mouse', price: 29.99 },
    { id: 3, name: 'Mechanical Keyboard', price: 89.99 },
    { id: 4, name: 'USB-C Cable', price: 12.99 }
  ]

  const [cart, setCart] = useState<CartItem[]>([])

  // Add product to cart
  const addToCart = (product: Product) => {
    const cartIndex = cart.length
    setCart([...cart, { ...product, cartIndex }])
  }

  // Remove product from cart
  const removeFromCart = (cartIndex: number) => {
    setCart(cart.filter(item => item.cartIndex !== cartIndex))
  }

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price, 0)

  return (
    <div className="app-container">
      <h1>Shopping Cart</h1>
      
      <div className="content">
        {/* Products Section */}
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

        {/* Cart Section */}
        <div className="cart-section">
          <h2>Cart</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div 
                    key={item.cartIndex} 
                    data-testid={`cart-item-${item.cartIndex}`}
                    className="cart-item"
                  >
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price">${item.price.toFixed(2)}</span>
                    </div>
                    <button 
                      data-testid={`remove-${item.cartIndex}`}
                      onClick={() => removeFromCart(item.cartIndex)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-total">
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
