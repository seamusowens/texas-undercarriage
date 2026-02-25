'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const backgroundImages = [
  '/images/Gemini_Generated_Image_xuul4vxuul4vxuul.png',
  '/images/Gemini_Generated_Image_newjdwnewjdwnewj.png',
  '/images/Gemini_Generated_Image_a99ca6a99ca6a99c.png',
  '/images/Gemini_Generated_Image_pq03w5pq03w5pq03.png'
]

export default function Home() {
  const [categories, setCategories] = useState<Array<{ profile: string; count: number }>>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetch('/api/products/categories')
      .then(res => res.json())
      .then(data => {
        console.log('Categories:', data)
        setCategories(data.slice(0, 10))
      })
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      <div 
        className="relative bg-blue-600 text-white py-20 transition-all duration-1000"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4">Texas Undercarriage</h1>
          <p className="text-xl mb-8">Premium Undercarriage Parts for Heavy Machinery</p>
          <Link href="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block">
            Browse All Products
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        {categories.length === 0 ? (
          <p className="text-center text-gray-600 mb-16">Loading categories...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
            {categories.map(cat => (
              <Link 
                key={cat.profile}
                href={`/products?profile=${encodeURIComponent(cat.profile)}`}
                className="border rounded-lg p-6 text-center hover:shadow-lg hover:border-blue-500 transition"
              >
                <h3 className="font-bold text-lg mb-2">{cat.profile}</h3>
                <p className="text-sm text-gray-600">{cat.count} parts</p>
              </Link>
            ))}
          </div>
        )}

        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Quality Parts</h3>
            <p>High-quality undercarriage components for all major brands</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
            <p>Quick delivery to keep your equipment running</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Expert Support</h3>
            <p>Knowledgeable team ready to help you find the right parts</p>
          </div>
        </div>
      </div>
    </div>
  )
}
