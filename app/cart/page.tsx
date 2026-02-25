'use client'
import { useCart } from '../providers'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  })
  const [shippingCost, setShippingCost] = useState<number | null>(null)
  const [calculatingShipping, setCalculatingShipping] = useState(false)
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + (shippingCost || 0)
  
  const calculateShipping = async () => {
    if (!shippingAddress.zip || !shippingAddress.state) {
      alert('Please enter at least ZIP code and state')
      return
    }
    
    setCalculatingShipping(true)
    try {
      const res = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: shippingAddress,
          weight: cart.reduce((sum, item) => sum + item.quantity, 0) * 10 // Estimate 10 lbs per item
        })
      })
      const data = await res.json()
      setShippingCost(data.cost || 0)
    } catch (error) {
      console.error('Shipping calculation error:', error)
      setShippingCost(25) // Fallback flat rate
    } finally {
      setCalculatingShipping(false)
    }
  }
  
  const handleCheckout = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, shippingCost })
    })
    
    const { url } = await res.json()
    if (url) window.location.href = url
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id} className="border p-4 rounded flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{item.partName}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Price: ${item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border p-6 rounded h-fit">
            <h2 className="text-xl font-bold mb-4">Shipping Calculator</h2>
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Street Address"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                className="w-full border p-2 rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="ZIP"
                  value={shippingAddress.zip}
                  onChange={(e) => setShippingAddress({...shippingAddress, zip: e.target.value})}
                  className="border p-2 rounded"
                />
              </div>
              <button
                onClick={calculateShipping}
                disabled={calculatingShipping}
                className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 disabled:bg-gray-400"
              >
                {calculatingShipping ? 'Calculating...' : 'Calculate Shipping'}
              </button>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              {shippingCost !== null && (
                <div className="flex justify-between">
                  <span>Shipping (from Victoria, TX):</span>
                  <span className="font-bold">${shippingCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <button
                onClick={handleCheckout}
                disabled={shippingCost === null}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full border py-2 rounded hover:bg-gray-100"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
