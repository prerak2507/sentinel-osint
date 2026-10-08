import { NextRequest, NextResponse } from 'next/server';
import { DEMO_IOCS } from '@/data/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const severity = searchParams.get('severity');

  let results = [...DEMO_IOCS];
  if (type && type !== 'ALL') {
    results = results.filter(i => i.type.toUpperCase() === type.toUpperCase());
  }
  if (severity && severity !== 'ALL') {
    results = results.filter(i => i.severity.toUpperCase() === severity.toUpperCase());
  }

  return NextResponse.json({
    status: 'success',
    data: results,
    total: results.length,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({
    status: 'success',
    message: 'Indicator registered and scheduled for correlation',
    data: {
      id: `IOC-${Date.now().toString().slice(-4)}`,
      ...body,
      firstSeen: new Date().toISOString().split('T')[0]
    }
  });
}
