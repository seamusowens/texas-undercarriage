'use client'
import { useState, useEffect } from 'react'
import { useCart } from '../providers'

type Product = {
  id: string
  partNumber: string
  partName: string
  profile: string
  weightKg: number
  lengthMm: number
  supplierName: string
  price: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [profile, setProfile] = useState('')
  const { addToCart } = useCart()
  
  useEffect(() => {
    fetch(`/api/products?search=${search}&profile=${profile}`)
      .then(res => res.json())
      .then(setProducts)
  }, [search, profile])
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by part number, name, or supplier..."
          className="flex-1 border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by profile..."
          className="w-48 border p-2 rounded"
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 shadow">
            <div className="bg-gray-200 h-48 mb-4 flex items-center justify-center">
              <span className="text-gray-500">Image Placeholder</span>
            </div>
            <h3 className="font-bold text-lg">{product.partName}</h3>
            <p className="text-sm text-gray-600">Part #: {product.partNumber}</p>
            <p className="text-sm text-gray-600">Profile: {product.profile}</p>
            <p className="text-sm text-gray-600">Weight: {product.weightKg} kg</p>
            <p className="text-sm text-gray-600">Length: {product.lengthMm} mm</p>
            <p className="text-sm text-gray-600 mb-2">Supplier: {product.supplierName}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">${product.price}</span>
              <button
                onClick={() => addToCart({ id: product.id, quantity: 1, partName: product.partName, price: product.price })}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
