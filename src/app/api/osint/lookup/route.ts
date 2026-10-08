import { NextRequest, NextResponse } from 'next/server';
import { performUnifiedLookup, detectIndicatorType } from '@/lib/osint-services';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = (body.query || '').trim();

    if (!query) {
      return NextResponse.json(
        { status: 'error', message: 'Missing query parameter' },
        { status: 400 }
      );
    }

    // Basic input sanitization
    if (query.length > 500) {
      return NextResponse.json(
        { status: 'error', message: 'Query too long' },
        { status: 400 }
      );
    }

    const result = await performUnifiedLookup(query);

    return NextResponse.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    console.error('OSINT lookup error:', error);
    return NextResponse.json(
      { status: 'error', message: 'OSINT lookup failed. Some feeds may be unreachable.' },
      { status: 500 }
    );
  }
}
