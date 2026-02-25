'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    password: ''
  })
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    if (res.ok) router.push('/auth/signin')
  }
  
  return (
    <div className="max-w-2xl mx-auto mt-10 card p-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">Register</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block mb-2 text-gray-300">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2 text-gray-300">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2 text-gray-300">Phone *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2 text-gray-300">Address *</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-gray-300">City *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-gray-300">State *</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
            className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"
            maxLength={2}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2 text-gray-300">ZIP Code *</label>
          <input
            type="text"
            value={formData.zip}
            onChange={(e) => setFormData({...formData, zip: e.target.value})}
            className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2 text-gray-300">Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="md:col-span-2 bg-orange-600 text-white p-3 rounded hover:bg-orange-700 font-bold">
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-gray-300">
        Already have an account? <Link href="/auth/signin" className="text-orange-500 hover:underline">Sign In</Link>
      </p>
    </div>
  )
}
