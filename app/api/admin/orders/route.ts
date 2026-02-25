import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

async function checkAdmin() {
  const session = await getServerSession()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { email: true, name: true } },
      items: { include: { product: { select: { partName: true } } } }
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(orders)
}
