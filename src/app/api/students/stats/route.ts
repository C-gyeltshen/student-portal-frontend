import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for demonstration
  const stats = {
    totalStudents: 125,
    stipendReceived: 92,
    stipendNotReceived: 33
  };

  return NextResponse.json(stats);
}
