"use client"

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, User, GraduationCap, DollarSign, Users, CheckCircle, XCircle, CreditCard, Calendar, FileText, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

// Type definitions
interface Stats {
  totalStudents: number;
  stipendReceived: number;
  stipendNotReceived: number;
}

interface Transaction {
  id: string;
  amount: number;
  date: string;
  time: string;
  reference: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

interface Deduction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
}

interface StudentProfile {
  id: string;
  name: string;
  studentNumber: string;
  program: string;
  college: string;
  status: 'active' | 'inactive';
  email: string;
  phone: string;
  address: string;
  enrollmentDate: string;
  yearLevel: string;
  gpa: number;
}

interface StudentWithStipend {
  id: string;
  name: string;
  studentId: string;
  program: string;
  college: string;
  status: 'active' | 'inactive';
  stipendReceived: boolean;
  stipendReason: string;
  stipendAmount: number;
  totalDeductions: number;
  netStipend: number;
  deductions: Deduction[];
  transactions: Transaction[];
  profile: StudentProfile;
}

interface YearWithStudents {
  yearLevel: string;
  students: StudentWithStipend[];
}

interface ProgramWithStudents {
  programName: string;
  totalStudents: number;
  years: YearWithStudents[];
  students: StudentWithStipend[];
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection = ({ title, icon: Icon, count, isExpanded, onToggle, children }: CollapsibleSectionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
      <div 
        className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all border-b-2 border-blue-200 px-6 py-4"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-white" />
              ) : (
                <ChevronRight className="w-5 h-5 text-white" />
              )}
            </div>
            <Icon className="w-6 h-6 text-blue-700" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              {count !== undefined && (
                <p className="text-sm text-gray-600">{count} Records</p>
              )}
            </div>
          </div>
          {count !== undefined && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
              <span>{count}</span>
            </div>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="overflow-x-auto">
          {children}
        </div>
      )}
    </div>
  );
};

const StudentDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    stipendReceived: 0,
    stipendNotReceived: 0
  });
  
  const [programsWithStudents, setProgramsWithStudents] = useState<ProgramWithStudents[]>([]);
  const [expandedPrograms, setExpandedPrograms] = useState<{ [key: string]: boolean }>({});
  const [expandedYears, setExpandedYears] = useState<{ [key: string]: boolean }>({});
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithStipend | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all students with stipend data
      const studentsResponse = await fetch('/api/students/list');
      const studentsData = await studentsResponse.json();
      
      const eligibilityResponse = await fetch('/api/students/eligibility');
      const eligibilityData = await eligibilityResponse.json();
      
      // Merge student and eligibility data
      const studentsWithStipend: StudentWithStipend[] = studentsData.map((student: any) => {
        const eligibility = eligibilityData.find((e: any) => e.studentId === student.studentId);
        return {
          ...student,
          stipendReceived: eligibility?.isEligible || false,
          stipendReason: eligibility?.reason || 'No information'
        };
      });
      
      // Group students by program and year
      const programsMap: { [key: string]: StudentWithStipend[] } = {};
      studentsWithStipend.forEach(student => {
        if (!programsMap[student.program]) {
          programsMap[student.program] = [];
        }
        programsMap[student.program].push(student);
      });
      
      const programs: ProgramWithStudents[] = Object.keys(programsMap).map(programName => {
        const programStudents = programsMap[programName];
        
        // Group by year level
        const yearsMap: { [key: string]: StudentWithStipend[] } = {};
        programStudents.forEach(student => {
          const yearLevel = student.profile.yearLevel;
          if (!yearsMap[yearLevel]) {
            yearsMap[yearLevel] = [];
          }
          yearsMap[yearLevel].push(student);
        });
        
        const years: YearWithStudents[] = Object.keys(yearsMap)
          .sort() // Sort year levels
          .map(yearLevel => ({
            yearLevel,
            students: yearsMap[yearLevel]
          }));
        
        return {
          programName,
          totalStudents: programStudents.length,
          years,
          students: programStudents
        };
      });
      
      setProgramsWithStudents(programs);
      
      // Calculate stats
      const totalStudents = studentsWithStipend.length;
      const stipendReceived = studentsWithStipend.filter(s => s.stipendReceived).length;
      const stipendNotReceived = totalStudents - stipendReceived;
      
      setStats({
        totalStudents,
        stipendReceived,
        stipendNotReceived
      });
      
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data
      const mockStudents: StudentWithStipend[] = [
        { 
          id: '1', 
          name: 'Tshering Dorji', 
          studentId: '11901234', 
          program: 'B.Tech in IT', 
          college: 'CST', 
          status: 'active', 
          stipendReceived: true, 
          stipendReason: 'Meets all requirements',
          stipendAmount: 5000,
          totalDeductions: 350,
          netStipend: 4650,
          deductions: [
            { id: 'd1', type: 'Library Fee', amount: 150, description: 'Annual library membership', date: '2024-01-15' },
            { id: 'd2', type: 'Lab Fee', amount: 200, description: 'Computer lab usage fee', date: '2024-01-20' }
          ],
          transactions: [
            { id: 't1', amount: 4650, date: '2024-02-01', time: '10:30 AM', reference: 'TXN001234', paymentMethod: 'Bank Transfer', status: 'completed', description: 'Stipend payment for January 2024' },
            { id: 't2', amount: 4650, date: '2024-01-01', time: '09:15 AM', reference: 'TXN001100', paymentMethod: 'Bank Transfer', status: 'completed', description: 'Stipend payment for December 2023' }
          ],
          profile: {
            id: '1',
            name: 'Tshering Dorji',
            studentNumber: '11901234',
            program: 'B.Tech in IT',
            college: 'CST',
            status: 'active',
            email: 'tsheringdorji.cst@rub.edu.bt',
            phone: '+975 17123456',
            address: 'Thimphu, Bhutan',
            enrollmentDate: '2019-08-15',
            yearLevel: 'Year IV',
            gpa: 3.45
          }
        },
        { 
          id: '2', 
          name: 'Karma Wangmo', 
          studentId: '11901235', 
          program: 'B.Tech in IT', 
          college: 'CST', 
          status: 'active', 
          stipendReceived: true, 
          stipendReason: 'Active enrollment',
          stipendAmount: 5000,
          totalDeductions: 250,
          netStipend: 4750,
          deductions: [
            { id: 'd3', type: 'Library Fee', amount: 150, description: 'Annual library membership', date: '2024-01-15' },
            { id: 'd4', type: 'Sports Fee', amount: 100, description: 'Annual sports facility fee', date: '2024-01-18' }
          ],
          transactions: [
            { id: 't3', amount: 4750, date: '2024-02-01', time: '10:45 AM', reference: 'TXN001235', paymentMethod: 'Bank Transfer', status: 'completed', description: 'Stipend payment for January 2024' }
          ],
          profile: {
            id: '2',
            name: 'Karma Wangmo',
            studentNumber: '11901235',
            program: 'B.Tech in IT',
            college: 'CST',
            status: 'active',
            email: 'karmawangmo.cst@rub.edu.bt',
            phone: '+975 17234567',
            address: 'Paro, Bhutan',
            enrollmentDate: '2019-08-15',
            yearLevel: 'Year IV',
            gpa: 3.78
          }
        },
        { 
          id: '6', 
          name: 'Dorji Wangchuk', 
          studentId: '12001239', 
          program: 'B.Tech in IT', 
          college: 'CST', 
          status: 'active', 
          stipendReceived: true, 
          stipendReason: 'Meets all requirements',
          stipendAmount: 5000,
          totalDeductions: 200,
          netStipend: 4800,
          deductions: [
            { id: 'd9', type: 'Library Fee', amount: 150, description: 'Annual library membership', date: '2024-01-15' },
            { id: 'd10', type: 'Sports Fee', amount: 50, description: 'Sports facility usage', date: '2024-01-19' }
          ],
          transactions: [
            { id: 't6', amount: 4800, date: '2024-02-01', time: '10:50 AM', reference: 'TXN001239', paymentMethod: 'Bank Transfer', status: 'completed', description: 'Stipend payment for January 2024' }
          ],
          profile: {
            id: '6',
            name: 'Dorji Wangchuk',
            studentNumber: '12001239',
            program: 'B.Tech in IT',
            college: 'CST',
            status: 'active',
            email: 'dorjiwangchuk.cst@rub.edu.bt',
            phone: '+975 17678901',
            address: 'Thimphu, Bhutan',
            enrollmentDate: '2020-08-15',
            yearLevel: 'Year III',
            gpa: 3.25
          }
        },
        { 
          id: '7', 
          name: 'Tashi Pelden', 
          studentId: '12101240', 
          program: 'B.Tech in IT', 
          college: 'CST', 
          status: 'active', 
          stipendReceived: true, 
          stipendReason: 'Active enrollment',
          stipendAmount: 5000,
          totalDeductions: 180,
          netStipend: 4820,
          deductions: [
            { id: 'd11', type: 'Library Fee', amount: 150, description: 'Annual library membership', date: '2024-01-15' },
            { id: 'd12', type: 'IT Lab Fee', amount: 30, description: 'Computer lab maintenance', date: '2024-01-21' }
          ],
          transactions: [
            { id: 't7', amount: 4820, date: '2024-02-01', time: '11:05 AM', reference: 'TXN001240', paymentMethod: 'Bank Transfer', status: 'completed', description: 'Stipend payment for January 2024' }
          ],
          profile: {
            id: '7',
            name: 'Tashi Pelden',
            studentNumber: '12101240',
            program: 'B.Tech in IT',
            college: 'CST',
            status: 'active',
            email: 'tashipelden.cst@rub.edu.bt',
            phone: '+975 17789012',
            address: 'Paro, Bhutan',
            enrollmentDate: '2021-08-15',
            yearLevel: 'Year II',
            gpa: 3.62
          }
        },
        { 
          id: '3', 
          name: 'Pema Lhamo', 
          studentId: '11901236', 
          program: 'B.Sc Forestry', 
          college: 'CNR', 
          status: 'inactive', 
          stipendReceived: false, 
          stipendReason: 'Inactive status',
          stipendAmount: 0,
          totalDeductions: 0,
          netStipend: 0,
          deductions: [],
          transactions: [],
          profile: {
            id: '3',
            name: 'Pema Lhamo',
            studentNumber: '11901236',
            program: 'B.Sc Forestry',
            college: 'CNR',
            status: 'inactive',
            email: 'pemalhamo.cnr@rub.edu.bt',
            phone: '+975 17345678',
            address: 'Lobesa, Bhutan',
            enrollmentDate: '2019-08-15',
            yearLevel: 'Year IV',
            gpa: 2.95
          }
        },
        { 
          id: '4', 
          name: 'Sonam Tenzin', 
          studentId: '11901237', 
          program: 'B.Sc Forestry', 
          college: 'CNR', 
          status: 'active', 
          stipendReceived: true, 
          stipendReason: 'All criteria met',
          stipendAmount: 5000,
          totalDeductions: 300,
          netStipend: 4700,
          deductions: [
            { id: 'd5', type: 'Library Fee', amount: 150, description: 'Annual library membership', date: '2024-01-15' },
            { id: 'd6', type: 'Field Trip Fee', amount: 150, description: 'Forestry field trip cost', date: '2024-01-22' }
          ],
          transactions: [
            { id: 't4', amount: 4700, date: '2024-02-01', time: '11:00 AM', reference: 'TXN001236', paymentMethod: 'Bank Transfer', status: 'completed', description: 'Stipend payment for January 2024' }
          ],
          profile: {
            id: '4',
            name: 'Sonam Tenzin',
            studentNumber: '11901237',
            program: 'B.Sc Forestry',
            college: 'CNR',
            status: 'active',
            email: 'sonamtenzin.cnr@rub.edu.bt',
            phone: '+975 17456789',
            address: 'Wangdue, Bhutan',
            enrollmentDate: '2019-08-15',
            yearLevel: 'Year IV',
            gpa: 3.52
          }
        },
        { 
          id: '8', 
          name: 'Ugyen Dorji', 
          studentId: '12001241', 
          program: 'B.Sc Forestry', 
          college: 'CNR', 
          status: 'active', 
          stipendReceived: true, 
          stipendReason: 'Good academic standing',
          stipendAmount: 5000,
          totalDeductions: 280,
          netStipend: 4720,
          deductions: [
            { id: 'd13', type: 'Library Fee', amount: 150, description: 'Annual library membership', date: '2024-01-15' },
            { id: 'd14', type: 'Field Equipment', amount: 130, description: 'Forestry field equipment', date: '2024-01-23' }
          ],
          transactions: [
            { id: 't8', amount: 4720, date: '2024-02-01', time: '11:10 AM', reference: 'TXN001241', paymentMethod: 'Bank Transfer', status: 'completed', description: 'Stipend payment for January 2024' }
          ],
          profile: {
            id: '8',
            name: 'Ugyen Dorji',
            studentNumber: '12001241',
            program: 'B.Sc Forestry',
            college: 'CNR',
            status: 'active',
            email: 'ugyendorji.cnr@rub.edu.bt',
            phone: '+975 17890123',
            address: 'Punakha, Bhutan',
            enrollmentDate: '2020-08-15',
            yearLevel: 'Year III',
            gpa: 3.38
          }
        },
        { 
          id: '5', 
          name: 'Kinley Dem', 
          studentId: '11901238', 
          program: 'BA Economics', 
          college: 'Sherubtse', 
          status: 'active', 
          stipendReceived: false, 
          stipendReason: 'Academic probation',
          stipendAmount: 5000,
          totalDeductions: 200,
          netStipend: 0,
          deductions: [
            { id: 'd7', type: 'Library Fee', amount: 150, description: 'Annual library membership', date: '2024-01-15' },
            { id: 'd8', type: 'Club Fee', amount: 50, description: 'Economics club membership', date: '2024-01-19' }
          ],
          transactions: [
            { id: 't5', amount: 0, date: '2024-02-01', time: '11:15 AM', reference: 'TXN001237', paymentMethod: 'N/A', status: 'failed', description: 'Stipend withheld - Academic probation' }
          ],
          profile: {
            id: '5',
            name: 'Kinley Dem',
            studentNumber: '11901238',
            program: 'BA Economics',
            college: 'Sherubtse',
            status: 'active',
            email: 'kinleydem.she@rub.edu.bt',
            phone: '+975 17567890',
            address: 'Kanglung, Bhutan',
            enrollmentDate: '2019-08-15',
            yearLevel: 'Year IV',
            gpa: 2.45
          }
        },
        { 
          id: '9', 
          name: 'Choden Zangmo', 
          studentId: '12201242', 
          program: 'BA Economics', 
          college: 'Sherubtse', 
          status: 'active', 
          stipendReceived: true, 
          stipendReason: 'Active enrollment',
          stipendAmount: 5000,
          totalDeductions: 170,
          netStipend: 4830,
          deductions: [
            { id: 'd15', type: 'Library Fee', amount: 150, description: 'Annual library membership', date: '2024-01-15' },
            { id: 'd16', type: 'Club Fee', amount: 20, description: 'Economics club fee', date: '2024-01-20' }
          ],
          transactions: [
            { id: 't9', amount: 4830, date: '2024-02-01', time: '11:20 AM', reference: 'TXN001242', paymentMethod: 'Bank Transfer', status: 'completed', description: 'Stipend payment for January 2024' }
          ],
          profile: {
            id: '9',
            name: 'Choden Zangmo',
            studentNumber: '12201242',
            program: 'BA Economics',
            college: 'Sherubtse',
            status: 'active',
            email: 'chodenzangmo.she@rub.edu.bt',
            phone: '+975 17901234',
            address: 'Kanglung, Bhutan',
            enrollmentDate: '2022-08-15',
            yearLevel: 'Year I',
            gpa: 3.12
          }
        },
      ];
      
      const mockPrograms: { [key: string]: StudentWithStipend[] } = {};
      mockStudents.forEach(student => {
        if (!mockPrograms[student.program]) {
          mockPrograms[student.program] = [];
        }
        mockPrograms[student.program].push(student);
      });
      
      const programs: ProgramWithStudents[] = Object.keys(mockPrograms).map(programName => {
        const programStudents = mockPrograms[programName];
        
        // Group by year level
        const yearsMap: { [key: string]: StudentWithStipend[] } = {};
        programStudents.forEach(student => {
          const yearLevel = student.profile.yearLevel;
          if (!yearsMap[yearLevel]) {
            yearsMap[yearLevel] = [];
          }
          yearsMap[yearLevel].push(student);
        });
        
        const years: YearWithStudents[] = Object.keys(yearsMap)
          .sort() // Sort year levels
          .map(yearLevel => ({
            yearLevel,
            students: yearsMap[yearLevel]
          }));
        
        return {
          programName,
          totalStudents: programStudents.length,
          years,
          students: programStudents
        };
      });
      
      setProgramsWithStudents(programs);
      
      setStats({
        totalStudents: mockStudents.length,
        stipendReceived: mockStudents.filter(s => s.stipendReceived).length,
        stipendNotReceived: mockStudents.filter(s => !s.stipendReceived).length
      });
    }
  };

  const toggleProgram = (programName: string) => {
    setExpandedPrograms(prev => ({
      ...prev,
      [programName]: !prev[programName]
    }));
  };

  const toggleYear = (programName: string, yearLevel: string) => {
    const key = `${programName}-${yearLevel}`;
    setExpandedYears(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleProgramClick = (programName: string) => {
    setSelectedProgram(selectedProgram === programName ? null : programName);
    if (selectedProgram !== programName) {
      setExpandedPrograms({ [programName]: true });
    }
  };

  const displayedPrograms = selectedProgram 
    ? programsWithStudents.filter(p => p.programName === selectedProgram)
    : programsWithStudents;

  const handleStudentClick = (student: StudentWithStipend) => {
    setSelectedStudent(student);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  // If a student is selected, show detailed view
  if (selectedStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-b rounded-xl flex items-center justify-center overflow-hidden">
                  <Image
                    src="/image/1.png"
                    width={48}
                    height={48}
                    alt="RUB Logo"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                  <p className="text-sm text-gray-600">Royal University of Bhutan</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />  
                  <span className="text-sm font-medium text-gray-700">Student Portal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={handleBackToList}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Student List
          </button>

          {/* Student Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                {selectedStudent.profile.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.profile.name}</h2>
                <p className="text-gray-600">{selectedStudent.profile.studentNumber} • {selectedStudent.profile.program}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedStudent.profile.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedStudent.profile.status.charAt(0).toUpperCase() + selectedStudent.profile.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedStudent.stipendReceived 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    Stipend: {selectedStudent.stipendReceived ? 'Received' : 'Not Received'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Email</p>
                  <p className="text-sm font-medium text-gray-900">{selectedStudent.profile.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{selectedStudent.profile.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Address</p>
                  <p className="text-sm font-medium text-gray-900">{selectedStudent.profile.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Enrollment</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(selectedStudent.profile.enrollmentDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Year Level</p>
                  <p className="text-sm font-medium text-gray-900">{selectedStudent.profile.yearLevel}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">GPA</p>
                  <p className="text-sm font-medium text-gray-900">{selectedStudent.profile.gpa.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">College</p>
                  <p className="text-sm font-medium text-gray-900">{selectedStudent.profile.college}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stipend Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Stipend Amount</p>
                  <p className="text-3xl font-bold text-blue-600">Nu. {selectedStudent.stipendAmount.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Deductions</p>
                  <p className="text-3xl font-bold text-red-600">Nu. {selectedStudent.totalDeductions.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Net Stipend</p>
                  <p className="text-3xl font-bold text-green-600">Nu. {selectedStudent.netStipend.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-700" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Deductions</h3>
                  <p className="text-sm text-gray-600">{selectedStudent.deductions.length} Deduction(s)</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {selectedStudent.deductions.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.deductions.map((deduction, idx) => (
                      <tr 
                        key={deduction.id}
                        className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">{deduction.type}</td>
                        <td className="px-6 py-4 text-red-600 font-semibold">Nu. {deduction.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{deduction.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{new Date(deduction.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No deductions recorded</p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction History Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-green-700" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
                  <p className="text-sm text-gray-600">{selectedStudent.transactions.length} Transaction(s)</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {selectedStudent.transactions.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.transactions.map((transaction, idx) => (
                      <tr 
                        key={transaction.id}
                        className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900">Nu. {transaction.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{new Date(transaction.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{transaction.time}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-mono">{transaction.reference}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{transaction.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{transaction.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No transactions recorded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-b rounded-xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/image/1.png"
                  width={48}
                  height={48}
                  alt="RUB Logo"
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-600">Royal University of Bhutan</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />  
                <span className="text-sm font-medium text-gray-700">Student Portal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Stipend Received</p>
                <p className="text-3xl font-bold text-green-600">{stats.stipendReceived}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Stipend Not Received</p>
                <p className="text-3xl font-bold text-red-600">{stats.stipendNotReceived}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Program Filter Buttons */}
        {selectedProgram && (
          <div className="mb-4">
            <button
              onClick={() => setSelectedProgram(null)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              ← Back to All Programs
            </button>
          </div>
        )}

        {/* Program Distribution with Students */}
        {displayedPrograms.map((program) => (
          <div key={program.programName} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
            {/* Program Header */}
            <div 
              className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all border-b-2 border-blue-200 px-6 py-4"
              onClick={() => !selectedProgram && handleProgramClick(program.programName)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    {expandedPrograms[program.programName] ? (
                      <ChevronDown className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <GraduationCap className="w-6 h-6 text-blue-700" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{program.programName}</h3>
                    <p className="text-sm text-gray-600">{program.totalStudents} Students</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {((program.totalStudents / stats.totalStudents) * 100).toFixed(1)}% of Total
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                    <span>{program.totalStudents}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Year Levels */}
            {expandedPrograms[program.programName] && (
              <div className="bg-gray-50">
                {program.years.map((year) => {
                  const yearKey = `${program.programName}-${year.yearLevel}`;
                  return (
                    <div key={year.yearLevel} className="border-b border-gray-200 last:border-b-0">
                      {/* Year Header */}
                      <div 
                        className="bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 cursor-pointer transition-all px-8 py-3 flex items-center justify-between"
                        onClick={() => toggleYear(program.programName, year.yearLevel)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-indigo-600 rounded-lg">
                            {expandedYears[yearKey] ? (
                              <ChevronDown className="w-4 h-4 text-white" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <Calendar className="w-5 h-5 text-indigo-700" />
                          <div>
                            <h4 className="text-md font-semibold text-gray-800">{year.yearLevel}</h4>
                            <p className="text-xs text-gray-600">{year.students.length} Student(s)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium">
                          <span>{year.students.length}</span>
                        </div>
                      </div>

                      {/* Students Table for this Year */}
                      {expandedYears[yearKey] && (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Student ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  College
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Stipend Eligibility
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Reason
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {year.students.map((student, idx) => (
                                <tr 
                                  key={student.id}
                                  onClick={() => handleStudentClick(student)}
                                  className={`border-b hover:bg-blue-100 transition-colors cursor-pointer ${
                                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                  }`}
                                >
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                        {student.name.split(' ').map((n: string) => n[0]).join('')}
                                      </div>
                                      <span className="font-medium text-gray-900">{student.name}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-700">{student.studentId}</td>
                                  <td className="px-6 py-4 text-sm text-gray-700">{student.college}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      student.status === 'active' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                      {student.stipendReceived ? (
                                        <>
                                          <CheckCircle className="w-5 h-5 text-green-600" />
                                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            Received
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <XCircle className="w-5 h-5 text-red-600" />
                                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                            Not Received
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-700">{student.stipendReason}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
