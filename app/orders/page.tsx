'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Order = {
  id: string
  total: number
  shippingCost: number
  status: string
  shippingAddress: string | null
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      partName: string
      partNumber: string
    }
  }>
}

export default function Orders() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          setOrders(Array.isArray(data) ? data : [])
          setLoading(false)
        })
        .catch(err => {
          console.error('Failed to load orders:', err)
          setOrders([])
          setLoading(false)
        })
    }
  }, [status, router])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Order #{order.id.slice(0, 8)}</h2>
                  <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                  <span className={`px-3 py-1 rounded text-sm ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              {order.shippingAddress && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-semibold">Shipping Address:</p>
                  <p className="text-sm">{order.shippingAddress}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="font-semibold">Items:</p>
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.partName} (#{item.product.partNumber}) x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>${order.shippingCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
