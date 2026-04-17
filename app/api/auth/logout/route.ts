import { NextResponse } from 'next/server'
import { logoutUser } from '@/lib/auth'

export async function POST() {
  try {
    await logoutUser()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging out user:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao sair.' },
      { status: 500 }
    )
  }
}
