import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

async function checkAdmin() {
  const session = await getServerSession()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { status } = await req.json()
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status }
  })
  return NextResponse.json(order)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  await prisma.order.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
