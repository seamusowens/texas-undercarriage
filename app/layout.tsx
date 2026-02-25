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
    <nav className="bg-blue-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Texas Undercarriage</Link>
        <div className="space-x-4 flex items-center">
          <Link href="/products" className="hover:underline">Products</Link>
          {session && !isAdmin && <Link href="/orders" className="hover:underline">Orders</Link>}
          {!isAdmin && (
            <Link href="/cart" className="hover:underline relative inline-block">
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          )}
          {isAdmin && (
            <>
              <Link href="/admin/orders" className="hover:underline">Manage Orders</Link>
              <Link href="/admin/products" className="hover:underline">Manage Products</Link>
            </>
          )}
          {session ? (
            <span className="text-sm">{session.user?.email}</span>
          ) : (
            <Link href="/auth/signin" className="hover:underline">Sign In</Link>
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
