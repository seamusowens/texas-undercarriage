import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const profile = searchParams.get('profile') || ''
    
    const products = await prisma.product.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { partNumber: { contains: search } },
              { partName: { contains: search } },
              { supplierName: { contains: search } },
            ]
          } : {},
          profile ? { profile: { contains: profile } } : {}
        ]
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
