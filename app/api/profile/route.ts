import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { name: true, phone: true, address: true, city: true, state: true, zip: true } })
  return NextResponse.json(user)
}

export async function PUT(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const data = await req.json()
  const user = await prisma.user.update({ where: { email: session.user.email }, data: { name: data.name, phone: data.phone, address: data.address, city: data.city, state: data.state, zip: data.zip } })
  return NextResponse.json(user)
}
