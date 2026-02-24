import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold mb-6">Texas Undercarriage</h1>
      <p className="text-xl mb-8">Your trusted source for premium undercarriage parts</p>
      <Link href="/products" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">
        Browse Products
      </Link>
    </div>
  )
}
