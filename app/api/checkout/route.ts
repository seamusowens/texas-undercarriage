import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-01-28.clover' })

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { items } = await req.json()
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  
  const lineItems = await Promise.all(items.map(async (item: any) => {
    const product = await prisma.product.findUnique({ where: { id: item.id } })
    return {
      price_data: {
        currency: 'usd',
        product_data: { name: product!.partName },
        unit_amount: Math.round(product!.price * 100),
      },
      quantity: item.quantity,
    }
  }))
  
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
  })
  
  return NextResponse.json({ url: checkoutSession.url })
}
