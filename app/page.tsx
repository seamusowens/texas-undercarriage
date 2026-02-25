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
        className="relative text-white py-24 md:py-32 transition-all duration-1000 border-b-4 border-orange-600"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wider text-orange-500 drop-shadow-lg">
            TEXAS UNDERCARRIAGE
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-gray-200 font-light">
            Premium Undercarriage Parts for Heavy Machinery
          </p>
          <Link href="/products" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg inline-block transition shadow-2xl transform hover:scale-105">
            BROWSE ALL PRODUCTS
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-orange-500 tracking-wider">SHOP BY CATEGORY</h2>
        {categories.length === 0 ? (
          <p className="text-center text-gray-400 mb-16">Loading categories...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
            {categories.map(cat => (
              <Link 
                key={cat.profile}
                href={`/products?profile=${encodeURIComponent(cat.profile)}`}
                className="card p-4 md:p-6 text-center hover:shadow-2xl transition transform hover:scale-105"
              >
                <h3 className="font-bold text-base md:text-lg mb-2 text-orange-400">{cat.profile}</h3>
                <p className="text-xs md:text-sm text-gray-400">{cat.count} parts</p>
              </Link>
            ))}
          </div>
        )}

        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-orange-500 tracking-wider">WHY CHOOSE US</h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="card p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-orange-400">Quality Parts</h3>
            <p className="text-gray-300">High-quality undercarriage components for all major brands</p>
          </div>
          <div className="card p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-orange-400">Fast Shipping</h3>
            <p className="text-gray-300">Quick delivery to keep your equipment running</p>
          </div>
          <div className="card p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-orange-400">Expert Support</h3>
            <p className="text-gray-300">Knowledgeable team ready to help you find the right parts</p>
          </div>
        </div>
      </div>
    </div>
  )
}
