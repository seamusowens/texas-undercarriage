import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import prisma from '@/lib/prisma'

async function checkAdmin() {
  const session = await getServerSession()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

export async function POST(req: Request) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const path = join(process.cwd(), 'public', 'uploads', filename)

    await writeFile(path, buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
