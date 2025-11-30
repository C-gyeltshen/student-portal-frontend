import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for demonstration
  const students = [
    { id: '1', name: 'Tshering Dorji', studentId: '11901234', program: 'B.Tech in IT', college: 'CST', status: 'active' },
    { id: '2', name: 'Karma Wangmo', studentId: '11901235', program: 'B.Tech Civil', college: 'CST', status: 'active' },
    { id: '3', name: 'Pema Lhamo', studentId: '11901236', program: 'B.Sc Forestry', college: 'CNR', status: 'inactive' },
    { id: '4', name: 'Sonam Tenzin', studentId: '11901237', program: 'B.Sc Agriculture', college: 'CNR', status: 'active' },
    { id: '5', name: 'Kinley Dem', studentId: '11901238', program: 'BA Economics', college: 'Sherubtse', status: 'active' },
    { id: '6', name: 'Dorji Wangchuk', studentId: '11901239', program: 'B.Tech in IT', college: 'CST', status: 'active' },
    { id: '7', name: 'Tashi Yangzom', studentId: '11901240', program: 'B.Tech Civil', college: 'CST', status: 'inactive' },
    { id: '8', name: 'Ugyen Penjor', studentId: '11901241', program: 'B.Sc Forestry', college: 'CNR', status: 'active' },
  ];

  return NextResponse.json(students);
}
