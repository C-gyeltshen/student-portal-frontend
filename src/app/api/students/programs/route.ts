import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for demonstration
  const programs = [
    { programName: 'B.Tech in Information Technology', totalStudents: 35 },
    { programName: 'B.Tech in Civil Engineering', totalStudents: 28 },
    { programName: 'B.Sc in Forestry', totalStudents: 22 },
    { programName: 'B.Sc in Agriculture', totalStudents: 20 },
    { programName: 'BA in Economics', totalStudents: 20 },
  ];

  return NextResponse.json(programs);
}
