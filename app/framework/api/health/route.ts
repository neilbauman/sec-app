// app/framework/api/health/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = getServerClient()
  let pingOk = false
  let pingError: string | undefined

  try {
    const { error } = await supabase.from('pillars').select('code', { count: 'exact', head: true })
    if (!error) pingOk = true
    else pingError = error.message
  } catch (e: any) {
    pingError = e?.message ?? 'unknown'
  }

  return NextResponse.json({
    ok: true,
    env: {
      has_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    pingOk,
    pingError,
  })
}
