import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for demonstration
  const eligibility = [
    { studentId: '11901234', studentName: 'Tshering Dorji', isEligible: true, reason: 'Meets all requirements' },
    { studentId: '11901235', studentName: 'Karma Wangmo', isEligible: true, reason: 'Active enrollment, good standing' },
    { studentId: '11901236', studentName: 'Pema Lhamo', isEligible: false, reason: 'Inactive status' },
    { studentId: '11901237', studentName: 'Sonam Tenzin', isEligible: true, reason: 'All criteria met' },
    { studentId: '11901238', studentName: 'Kinley Dem', isEligible: false, reason: 'Academic probation' },
    { studentId: '11901239', studentName: 'Dorji Wangchuk', isEligible: true, reason: 'Meets all requirements' },
    { studentId: '11901240', studentName: 'Tashi Yangzom', isEligible: false, reason: 'Inactive status' },
    { studentId: '11901241', studentName: 'Ugyen Penjor', isEligible: true, reason: 'Good academic standing' },
  ];

  return NextResponse.json(eligibility);
}
