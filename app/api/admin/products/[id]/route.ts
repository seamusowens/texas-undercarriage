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
  
  const data = await req.json()
  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      partName: data.partName,
      partNumber: data.partNumber,
      price: data.price,
      imageUrl: data.imageUrl || '/placeholder.jpg'
    }
  })
  return NextResponse.json(product)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
