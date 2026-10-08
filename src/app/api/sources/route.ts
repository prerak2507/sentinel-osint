import { NextResponse } from 'next/server';
import { DEMO_SOURCES } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: DEMO_SOURCES,
    total: DEMO_SOURCES.length,
    timestamp: new Date().toISOString()
  });
}
