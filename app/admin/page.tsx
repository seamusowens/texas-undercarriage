'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/')
    }
  }, [status, session, router])

  if (status === 'loading') return <div>Loading...</div>
  if (session?.user?.role !== 'admin') return null

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/admin/products" className="border rounded-lg p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-2">Manage Products</h2>
          <p className="text-gray-600">Add, edit, delete products and upload images</p>
        </Link>
        
        <Link href="/admin/orders" className="border rounded-lg p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-2">Manage Orders</h2>
          <p className="text-gray-600">View, edit, and delete customer orders</p>
        </Link>
      </div>
    </div>
  )
}
