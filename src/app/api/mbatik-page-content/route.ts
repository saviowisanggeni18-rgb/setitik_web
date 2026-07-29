import { NextResponse } from 'next/server'
import { loadMbatikPageContent, saveMbatikPageContent } from '@/lib/mbatik-page-content'
import { isAdminPasswordConfigured, isAdminPasswordValid } from '@/lib/site-updates'

export const dynamic = 'force-dynamic'

function authorized(request: Request) {
  return isAdminPasswordValid(request.headers.get('x-admin-password'))
}

export async function GET(request: Request) {
  if (!isAdminPasswordConfigured()) return NextResponse.json({ message: 'Password admin belum dikonfigurasi.' }, { status: 503 })
  if (!authorized(request)) return NextResponse.json({ message: 'Password admin tidak sesuai.' }, { status: 401 })
  return NextResponse.json({ content: await loadMbatikPageContent() })
}

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) return NextResponse.json({ message: 'Password admin belum dikonfigurasi.' }, { status: 503 })
  if (!authorized(request)) return NextResponse.json({ message: 'Password admin tidak sesuai.' }, { status: 401 })
  try {
    const body = await request.json()
    if (!body?.content) return NextResponse.json({ message: 'Konten tidak lengkap.' }, { status: 400 })
    await saveMbatikPageContent(body.content)
    return NextResponse.json({ saved: true, content: await loadMbatikPageContent() })
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Gagal menyimpan konten.' }, { status: 500 })
  }
}
