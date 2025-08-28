import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminToken = process.env.ADMIN_TOKEN!;

const adminDb = createClient(url, serviceKey, { auth: { persistSession: false } });

export async function GET(req: NextRequest) {
  // Download: build an Excel from current data
  const { searchParams } = new URL(req.url);
  if (searchParams.get('download') !== '1') return NextResponse.json({ ok: true });

  const { data, error } = await adminDb
    .from('ssc_rows')
    .select('*')
    .order('dimension_order', { ascending: true })
    .order('indicator_order', { ascending: true })
    .order('question_order', { ascending: true })
    .order('choice_order', { ascending: true });

  if (error) return new NextResponse(error.message, { status: 500 });

  const ws = XLSX.utils.json_to_sheet(data || []);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Framework');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="ssc_framework.xlsx"'
    }
  });
}

export async function POST(req: NextRequest) {
  // Upload: only if header matches ADMIN_TOKEN
  const token = req.headers.get('x-admin-token');
  if (!token || token !== adminToken) return new NextResponse('Unauthorized', { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return new NextResponse('No file', { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const wb = XLSX.read(arrayBuffer);
  const ws = wb.Sheets['Framework'] || wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: null });

  // wipe & replace (MVP, keep it simple)
  const del = await adminDb.from('ssc_rows').delete().neq('id', -1);
  if (del.error) return new NextResponse(`Delete failed: ${del.error.message}`, { status: 500 });

  const chunkSize = 500;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const ins = await adminDb.from('ssc_rows').insert(chunk as any[]);
    if (ins.error) return new NextResponse(`Insert failed near row ${i}: ${ins.error.message}`, { status: 500 });
  }

  return new NextResponse(`Imported ${rows.length} rows`);
}
