"use client"

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, User, Building2, GraduationCap, Phone, Mail, Calendar, CreditCard, Filter, Search, Download } from 'lucide-react';
import Image from 'next/image'

// Mock data based on your schema
const mockColleges = [
  { id: '1', name: 'College of Science and Technology' },
  { id: '2', name: 'College of Natural Resources' },
  { id: '3', name: 'Sherubtse College' }
];

const mockStudents = [
  {
    id: '1',
    name: 'Tshering Dorji',
    rub_id_card_number: 11901234,
    email: 'tshering.d@student.rub.edu.bt',
    phone_number: 17123456,
    date_of_birth: '2001-05-15',
    college_id: '1',
    college_name: 'College of Science and Technology',
    program: 'B.Tech in Information Technology',
    created_at: '2023-08-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Karma Wangmo',
    rub_id_card_number: 11901235,
    email: 'karma.w@student.rub.edu.bt',
    phone_number: 17234567,
    date_of_birth: '2002-03-22',
    college_id: '1',
    college_name: 'College of Science and Technology',
    program: 'B.Tech in Civil Engineering',
    created_at: '2023-08-15T10:30:00Z'
  },
  {
    id: '3',
    name: 'Pema Lhamo',
    rub_id_card_number: 11901236,
    email: 'pema.l@student.rub.edu.bt',
    phone_number: 17345678,
    date_of_birth: '2001-11-08',
    college_id: '2',
    college_name: 'College of Natural Resources',
    program: 'B.Sc in Forestry',
    created_at: '2023-08-16T09:00:00Z'
  },
  {
    id: '4',
    name: 'Sonam Tenzin',
    rub_id_card_number: 11901237,
    email: 'sonam.t@student.rub.edu.bt',
    phone_number: 17456789,
    date_of_birth: '2002-07-19',
    college_id: '2',
    college_name: 'College of Natural Resources',
    program: 'B.Sc in Agriculture',
    created_at: '2023-08-16T09:30:00Z'
  },
  {
    id: '5',
    name: 'Kinley Dem',
    rub_id_card_number: 11901238,
    email: 'kinley.d@student.rub.edu.bt',
    phone_number: 17567890,
    date_of_birth: '2001-09-30',
    college_id: '3',
    college_name: 'Sherubtse College',
    program: 'BA in Economics',
    created_at: '2023-08-17T08:00:00Z'
  }
];

const CollapsibleRow = ({ college, students, isExpanded, onToggle }) => {
  return (
    <>
      {/* College Header Row */}
      <tr 
        className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all border-b-2 border-blue-200"
        onClick={onToggle}
      >
        <td className="px-6 py-4" colSpan="7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-white" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white" />
                )}
              </div>
              <Building2 className="w-6 h-6 text-blue-700" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{college.name}</h3>
                <p className="text-sm text-gray-600">{students.length} Students Enrolled</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
              <span>{students.length}</span>
            </div>
          </div>
        </td>
      </tr>
      
      {/* Student Rows */}
      {isExpanded && students.map((student, idx) => (
        <tr 
          key={student.id} 
          className={`border-b hover:bg-blue-50 transition-colors ${
            idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
          }`}
        >
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-medium text-gray-900">{student.name}</div>
                <div className="text-sm text-gray-500">{student.rub_id_card_number}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{student.email}</span>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{student.phone_number}</span>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2 text-gray-700">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{student.program}</span>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{new Date(student.date_of_birth).toLocaleDateString()}</span>
            </div>
          </td>
          <td className="px-6 py-4">
            <span className="text-sm text-gray-600">
              {new Date(student.created_at).toLocaleDateString()}
            </span>
          </td>
          <td className="px-6 py-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium">
              View Details
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

const StudentDashboard = () => {
  const [userType] = useState('financial_officer'); // or 'student'
  const [expandedColleges, setExpandedColleges] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('all');

  const toggleCollege = (collegeId) => {
    setExpandedColleges(prev => ({
      ...prev,
      [collegeId]: !prev[collegeId]
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    mockColleges.forEach(college => {
      allExpanded[college.id] = true;
    });
    setExpandedColleges(allExpanded);
  };

  const collapseAll = () => {
    setExpandedColleges({});
  };

  // Filter students by search and college
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rub_id_card_number.toString().includes(searchTerm) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollege = selectedCollege === 'all' || student.college_id === selectedCollege;
    return matchesSearch && matchesCollege;
  });

  // Group students by college
  const groupedStudents = mockColleges.map(college => ({
    college,
    students: filteredStudents.filter(s => s.college_id === college.id)
  })).filter(group => group.students.length > 0);

  const totalStudents = filteredStudents.length;

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
                <h1 className="text-2xl font-bold text-gray-900">RUB Student Portal</h1>
                <p className="text-sm text-gray-600">Royal University of Bhutan</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />  
                <span className="text-sm font-medium text-gray-700">
                  {userType === 'financial_officer' ? 'Financial Officer' : 'Student'}
                </span>
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
                <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Colleges</p>
                <p className="text-3xl font-bold text-gray-900">{groupedStudents.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Programs</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(mockStudents.map(s => s.program)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Colleges</option>
                {mockColleges.map(college => (
                  <option key={college.id} value={college.id}>{college.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              >
                Collapse All
              </button>
              <button className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    DOB
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupedStudents.length > 0 ? (
                  groupedStudents.map(({ college, students }) => (
                    <CollapsibleRow
                      key={college.id}
                      college={college}
                      students={students}
                      isExpanded={expandedColleges[college.id]}
                      onToggle={() => toggleCollege(college.id)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <User className="w-12 h-12 text-gray-300" />
                        <p className="text-lg font-medium">No students found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;