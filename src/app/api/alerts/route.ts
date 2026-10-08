import { NextResponse } from 'next/server';
import { DEMO_ALERTS } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: DEMO_ALERTS,
    total: DEMO_ALERTS.length,
    timestamp: new Date().toISOString()
  });
}
