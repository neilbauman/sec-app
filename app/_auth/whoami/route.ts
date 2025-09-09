// app/_auth/whoami/route.ts
import { NextResponse } from 'next/server';
import { getCurrentRole, roleLabel } from '@/lib/role';

export const dynamic = 'force-dynamic';

export async function GET() {
  const role = await getCurrentRole();
  return NextResponse.json({ ok: true, role, label: roleLabel(role) });
}
