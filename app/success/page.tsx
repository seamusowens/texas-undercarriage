import Link from 'next/link'

export default function Success() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4 text-green-600">Payment Successful!</h1>
      <p className="text-xl mb-8">Thank you for your order.</p>
      <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
        Continue Shopping
      </Link>
    </div>
  )
}
