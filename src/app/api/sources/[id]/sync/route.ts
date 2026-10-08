import { NextRequest, NextResponse } from 'next/server';
import { DEMO_SOURCES } from '@/data/mockData';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const source = DEMO_SOURCES.find(s => s.id === id);

  if (!source) {
    return NextResponse.json(
      { status: 'error', message: 'Source not found' },
      { status: 404 }
    );
  }

  // Simulate network ingest
  const newRecordsIngested = Math.floor(Math.random() * 400) + 120;

  return NextResponse.json({
    status: 'success',
    message: `Synchronized ${source.name}`,
    data: {
      id: source.id,
      name: source.name,
      lastSync: 'Just now',
      recordsAdded: newRecordsIngested,
      totalRecords: source.recordsCollected + newRecordsIngested,
      latencyMs: source.latencyMs
    }
  });
}
