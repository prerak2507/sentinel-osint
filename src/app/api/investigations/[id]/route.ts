import { NextRequest, NextResponse } from 'next/server';
import { DEMO_INVESTIGATION } from '@/data/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    status: 'success',
    data: {
      ...DEMO_INVESTIGATION,
      id
    }
  });
}
