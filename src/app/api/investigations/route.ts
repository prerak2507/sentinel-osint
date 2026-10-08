import { NextRequest, NextResponse } from 'next/server';
import { DEMO_INVESTIGATION } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: [DEMO_INVESTIGATION],
    total: 1,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const query = body.query || 'unknown-query';

  return NextResponse.json({
    status: 'success',
    message: 'Investigation initiated',
    data: {
      ...DEMO_INVESTIGATION,
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      targetQuery: query,
      title: `Correlated Investigation: ${query}`
    }
  });
}
