'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Product = {
  id: string
  partNumber: string
  partName: string
  price: number
  imageUrl: string
}

export default function AdminProducts() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ partName: '', partNumber: '', price: 0, imageUrl: '' })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      loadProducts()
    } else if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, session, router])

  const loadProducts = () => {
    fetch('/api/products?search=&profile=')
      .then(res => res.json())
      .then(setProducts)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      setFormData(prev => ({ ...prev, imageUrl: data.url }))
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products'
    const method = editingId ? 'PUT' : 'POST'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    setEditingId(null)
    setFormData({ partName: '', partNumber: '', price: 0, imageUrl: '' })
    loadProducts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    loadProducts()
  }

  if (status === 'loading') return <div>Loading...</div>
  if (session?.user?.role !== 'admin') return null

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
      
      <div className="mb-6 border p-4 rounded">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Product</h2>
        <div className="grid gap-3">
          <input
            placeholder="Part Name"
            value={formData.partName}
            onChange={e => setFormData({...formData, partName: e.target.value})}
            className="border p-2 rounded"
          />
          <input
            placeholder="Part Number"
            value={formData.partNumber}
            onChange={e => setFormData({...formData, partNumber: e.target.value})}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
            className="border p-2 rounded"
          />
          <div>
            <label className="block text-sm font-semibold mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="border p-2 rounded w-full"
            />
            {uploading && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
            {formData.imageUrl && (
              <div className="mt-2">
                <img src={formData.imageUrl} alt="Preview" className="h-32 object-cover rounded" />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
              Save
            </button>
            {editingId && (
              <button onClick={() => {setEditingId(null); setFormData({ partName: '', partNumber: '', price: 0, imageUrl: '' })}} className="border px-4 py-2 rounded">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{product.partName}</p>
              <p className="text-sm text-gray-600">#{product.partNumber} - ${product.price}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {setEditingId(product.id); setFormData({partName: product.partName, partNumber: product.partNumber, price: product.price, imageUrl: product.imageUrl})}}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
