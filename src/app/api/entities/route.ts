import { NextResponse } from 'next/server';
import { DEMO_ENTITIES } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: DEMO_ENTITIES,
    total: DEMO_ENTITIES.length,
    timestamp: new Date().toISOString()
  });
}
