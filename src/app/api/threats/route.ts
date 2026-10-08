import { NextResponse } from 'next/server';
import { DEMO_THREATS } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: DEMO_THREATS,
    total: DEMO_THREATS.length,
    timestamp: new Date().toISOString()
  });
}
