import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { items, shippingCost } = await req.json()
    
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    
    // Calculate total
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const total = subtotal + (shippingCost || 0)
    
    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        shippingCost: shippingCost || 0,
        status: 'pending',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })
    
    // For now, redirect to success page without Stripe
    // In production, integrate Stripe here
    return NextResponse.json({ url: `/success?orderId=${order.id}` })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed: ' + String(error) }, { status: 500 })
  }
}
