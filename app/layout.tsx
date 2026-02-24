import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Texas Undercarriage",
  description: "Premium undercarriage parts supplier",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <nav className="bg-blue-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">Texas Undercarriage</Link>
              <div className="space-x-4">
                <Link href="/products" className="hover:underline">Products</Link>
                <Link href="/cart" className="hover:underline">Cart</Link>
                <Link href="/auth/signin" className="hover:underline">Sign In</Link>
              </div>
            </div>
          </nav>
          <main className="container mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
