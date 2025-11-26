"use client"

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, User, GraduationCap, DollarSign, Users, CheckCircle, XCircle, Upload, FileText, X } from 'lucide-react';
import Image from 'next/image';

// Type definitions
interface Stats {
  totalStudents: number;
  stipendReceived: number;
  stipendNotReceived: number;
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

const FinanceOfficerDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    stipendReceived: 0,
    stipendNotReceived: 0
  });
  
  const [programsWithStudents, setProgramsWithStudents] = useState<ProgramWithStudents[]>([]);
  const [expandedPrograms, setExpandedPrograms] = useState<{ [key: string]: boolean }>({});
  const [expandedYears, setExpandedYears] = useState<{ [key: string]: boolean }>({});
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      
      // Group students by program
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
          id: '1', name: 'Tshering Dorji', studentId: '11901234', program: 'B.Tech in IT', college: 'CST', status: 'active', stipendReceived: true, stipendReason: 'Meets all requirements',
          profile: { id: '1', name: 'Tshering Dorji', studentNumber: '11901234', program: 'B.Tech in IT', college: 'CST', status: 'active', email: 'tshering@student.edu.bt', phone: '+97517123456', address: 'Thimphu', enrollmentDate: '2019-08-01', yearLevel: 'Year 4', gpa: 3.8 }
        },
        { 
          id: '2', name: 'Karma Wangmo', studentId: '11901235', program: 'B.Tech in IT', college: 'CST', status: 'active', stipendReceived: true, stipendReason: 'Active enrollment',
          profile: { id: '2', name: 'Karma Wangmo', studentNumber: '11901235', program: 'B.Tech in IT', college: 'CST', status: 'active', email: 'karma@student.edu.bt', phone: '+97517123457', address: 'Paro', enrollmentDate: '2020-08-01', yearLevel: 'Year 3', gpa: 3.6 }
        },
        { 
          id: '3', name: 'Pema Lhamo', studentId: '11901236', program: 'B.Sc Forestry', college: 'CNR', status: 'inactive', stipendReceived: false, stipendReason: 'Inactive status',
          profile: { id: '3', name: 'Pema Lhamo', studentNumber: '11901236', program: 'B.Sc Forestry', college: 'CNR', status: 'inactive', email: 'pema@student.edu.bt', phone: '+97517123458', address: 'Punakha', enrollmentDate: '2019-08-01', yearLevel: 'Year 4', gpa: 3.2 }
        },
        { 
          id: '4', name: 'Sonam Tenzin', studentId: '11901237', program: 'B.Sc Forestry', college: 'CNR', status: 'active', stipendReceived: true, stipendReason: 'All criteria met',
          profile: { id: '4', name: 'Sonam Tenzin', studentNumber: '11901237', program: 'B.Sc Forestry', college: 'CNR', status: 'active', email: 'sonam@student.edu.bt', phone: '+97517123459', address: 'Wangdue', enrollmentDate: '2021-08-01', yearLevel: 'Year 2', gpa: 3.5 }
        },
        { 
          id: '5', name: 'Kinley Dem', studentId: '11901238', program: 'BA Economics', college: 'Sherubtse', status: 'active', stipendReceived: false, stipendReason: 'Academic probation',
          profile: { id: '5', name: 'Kinley Dem', studentNumber: '11901238', program: 'BA Economics', college: 'Sherubtse', status: 'active', email: 'kinley@student.edu.bt', phone: '+97517123460', address: 'Trashigang', enrollmentDate: '2022-08-01', yearLevel: 'Year 1', gpa: 2.8 }
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
          .sort()
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

  const toggleYear = (key: string) => {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else if (file) {
      alert('Please select a CSV file');
      event.target.value = '';
    }
  };

  const handleCancelFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleProceed = () => {
    if (selectedFile) {
      // Placeholder for future CSV processing logic
      alert(`File "${selectedFile.name}" ready for processing. (Feature coming soon)`);
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Finance Officer Dashboard</h1>
                <p className="text-sm text-gray-600">Royal University of Bhutan</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* CSV Upload Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                {!selectedFile ? (
                  <div className="flex items-center gap-3">
                    <label 
                      htmlFor="csv-upload" 
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors font-medium"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload CSV</span>
                    </label>
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="text-sm text-gray-500">Import student data</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCancelFile}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleProceed}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Proceed
                      </button>
                    </div>
                  </div>
                )}
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

            {/* Year-wise Students */}
            {expandedPrograms[program.programName] && (
              <div className="p-6 space-y-6">
                {program.years.map((year) => {
                  const yearKey = `${program.programName}-${year.yearLevel}`;
                  const isYearExpanded = expandedYears[yearKey] ?? true; // Default expanded
                  
                  return (
                    <div key={year.yearLevel} className="space-y-3">
                      {/* Year Level Header - Clickable */}
                      <div 
                        className="flex items-center gap-2 mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => toggleYear(yearKey)}
                      >
                        <div className="h-px bg-gradient-to-r from-blue-300 to-indigo-300 flex-1"></div>
                        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                          {isYearExpanded ? (
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-blue-600" />
                          )}
                          <h4 className="text-sm font-semibold text-gray-700">
                            {year.yearLevel} ({year.students.length} {year.students.length === 1 ? 'Student' : 'Students'})
                          </h4>
                        </div>
                        <div className="h-px bg-gradient-to-r from-indigo-300 to-blue-300 flex-1"></div>
                      </div>

                      {/* Students Table */}
                      {isYearExpanded && (
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
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
                        <tbody>
                          {year.students.map((student, idx) => (
                            <tr 
                              key={student.id}
                              className={`border-b hover:bg-blue-50 transition-colors ${
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

export default FinanceOfficerDashboard;
