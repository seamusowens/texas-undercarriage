import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.product.groupBy({
      by: ['profile'],
      _count: {
        profile: true
      },
      orderBy: {
        _count: {
          profile: 'desc'
        }
      }
    })

    const result = categories.map(cat => ({
      profile: cat.profile,
      count: cat._count.profile
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
