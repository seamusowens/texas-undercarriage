'use client'
import type { Metadata } from "next";
import "./globals.css";
import { Providers, useCart } from './providers'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

function Navigation() {
  const { cart } = useCart()
  const { data: session } = useSession()
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const isAdmin = session?.user?.role === 'admin'
  
  return (
    <nav className="metal-bg text-white p-4 shadow-lg border-b-2 border-orange-600">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <Link href="/" className="text-2xl md:text-3xl font-bold tracking-wider text-orange-500 hover:text-orange-400 transition">
          TEXAS UNDERCARRIAGE
        </Link>
        <div className="flex flex-wrap gap-3 md:gap-6 items-center text-sm md:text-base">
          <Link href="/products" className="hover:text-orange-400 transition font-semibold">Products</Link>
          {session && !isAdmin && <Link href="/orders" className="hover:text-orange-400 transition font-semibold">Orders</Link>}
          {!isAdmin && (
            <Link href="/cart" className="hover:text-orange-400 transition relative inline-block font-semibold">
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                  {itemCount}
                </span>
              )}
            </Link>
          )}
          {isAdmin && (
            <>
              <Link href="/admin/orders" className="hover:text-orange-400 transition font-semibold">Orders</Link>
              <Link href="/admin/products" className="hover:text-orange-400 transition font-semibold">Products</Link>
            </>
          )}
          {session ? (
            <Link href="/profile" className="text-xs md:text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded hover:bg-gray-700">Profile</Link>
          ) : (
            <Link href="/auth/signin" className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded font-semibold transition shadow-lg">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation />
          <main className="container mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
