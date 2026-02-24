import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const profile = searchParams.get('profile') || ''
  
  const products = await prisma.product.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { partNumber: { contains: search, mode: 'insensitive' } },
            { partName: { contains: search, mode: 'insensitive' } },
            { supplierName: { contains: search, mode: 'insensitive' } },
          ]
        } : {},
        profile ? { profile: { contains: profile } } : {}
      ]
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json(products)
}
