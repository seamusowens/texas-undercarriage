'use client'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({name: '', phone: '', address: '', city: '', state: '', zip: ''})
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
    else if (status === 'authenticated') {
      fetch('/api/profile').then(res => res.json()).then(data => setFormData(data))
    }
  }, [status, router])

  const handleSave = async () => {
    await fetch('/api/profile', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)})
    setEditing(false)
  }

  if (status === 'loading') return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto card p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-500">Profile</h1>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
      </div>
      <div className="space-y-4">
        <div><label className="block text-gray-300">Email</label><p className="text-white">{session?.user?.email}</p></div>
        <div><label className="block text-gray-300">Name</label>
          {editing ? <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"/> : <p className="text-white">{formData.name}</p>}
        </div>
        <div><label className="block text-gray-300">Phone</label>
          {editing ? <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"/> : <p className="text-white">{formData.phone}</p>}
        </div>
        <div><label className="block text-gray-300">Address</label>
          {editing ? <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"/> : <p className="text-white">{formData.address}</p>}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-gray-300">City</label>
            {editing ? <input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"/> : <p className="text-white">{formData.city}</p>}
          </div>
          <div><label className="block text-gray-300">State</label>
            {editing ? <input value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"/> : <p className="text-white">{formData.state}</p>}
          </div>
          <div><label className="block text-gray-300">ZIP</label>
            {editing ? <input value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"/> : <p className="text-white">{formData.zip}</p>}
          </div>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Save</button>
            <button onClick={() => setEditing(false)} className="border border-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Edit Profile</button>
        )}
      </div>
    </div>
  )
}
