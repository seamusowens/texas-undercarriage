'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Order = {
  id: string
  total: number
  status: string
  createdAt: string
  user: { email: string; name: string | null }
  items: Array<{ quantity: number; product: { partName: string } }>
}

export default function AdminOrders() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      loadOrders()
    } else if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, session, router])

  const loadOrders = () => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(setOrders)
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    loadOrders()
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Delete this order?')) return
    await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' })
    loadOrders()
  }

  if (status === 'loading') return <div>Loading...</div>
  if (session?.user?.role !== 'admin') return null

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border p-4 rounded">
            <div className="flex justify-between mb-2">
              <div>
                <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-600">{order.user.email} - {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
            </div>
            <div className="text-sm mb-2">
              {order.items.map((item, i) => (
                <p key={i}>{item.product.partName} x{item.quantity}</p>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={order.status}
                onChange={e => updateStatus(order.id, e.target.value)}
                className="border p-1 rounded text-sm"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={() => deleteOrder(order.id)} className="text-red-600 text-sm hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
