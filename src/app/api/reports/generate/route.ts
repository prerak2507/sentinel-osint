import { NextRequest, NextResponse } from 'next/server';
import { DEMO_REPORT } from '@/data/mockData';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const type = body.type || 'THREAT_INVESTIGATION';
  const customTitle = body.title;

  return NextResponse.json({
    status: 'success',
    message: 'Report compiled and cryptographically signed',
    data: {
      ...DEMO_REPORT,
      id: `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      title: customTitle || DEMO_REPORT.title,
      generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
    }
  });
}
