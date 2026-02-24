'use client'
import { useCart } from '../providers'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  const handleCheckout = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
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
        <>
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
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-2xl font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="border px-6 py-2 rounded hover:bg-gray-100"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex-1"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
