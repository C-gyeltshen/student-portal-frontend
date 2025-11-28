"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CreditCard,
  DollarSign,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  ArrowRight,
  Shield,
  Clock,
  Users,
  Building2,
  Star,
  TrendingUp,
  CheckCircle2,
  Zap,
  BarChart3,
} from "lucide-react";

export default function Home() {
  const services: {
    icon: React.ComponentType<{ size: number }>;
    title: string;
    description: string;
    link: string;
    color: "blue" | "green" | "purple" | "orange";
  }[] = [
    {
      icon: DollarSign,
      title: "Stipend Management",
      description:
        "Automated stipend calculation and distribution. Track your Nu 2,500-3,000 monthly stipend in real-time with complete transparency.",
      link: "/student",
      color: "blue",
    },
    {
      icon: BarChart3,
      title: "Transparent Deductions",
      description:
        "View itemized breakdown of all deductions (hostel rent, electricity, mess fees). Know exactly how much you receive.",
      link: "/finance",
      color: "green",
    },
    {
      icon: LayoutDashboard,
      title: "Admin Dashboard",
      description:
        "Student Services Office (SSO) staff can manage student data, process stipends, and generate compliance reports.",
      link: "/user/dashboard",
      color: "purple",
    },
    {
      icon: TrendingUp,
      title: "Financial Reports",
      description:
        "College-level reports on stipend distribution, total disbursed amounts, and deduction summaries for audit compliance.",
      link: "/finance",
      color: "orange",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Automated Processing",
      description:
        "From week-long manual processes to minutes. Stipends processed and disbursed automatically every month.",
    },
    {
      icon: CheckCircle2,
      title: "Complete Transparency",
      description:
        "Real-time ledger access showing your total stipend and itemized deductions. No hidden charges or delays.",
    },
    {
      icon: Shield,
      title: "Secure & Auditable",
      description:
        "Centralized audit trail for all transactions. University compliance and fraud prevention built-in.",
    },
  ];

  const stats = [
    { value: "15,600+", label: "RUB Students" },
    { value: "13", label: "Colleges" },
    { value: "99.9%", label: "Uptime" },
    { value: "~5 min", label: "Processing Time" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b rounded-xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/image/1.png"
                  width={500}
                  height={500}
                  alt="RUB Logo"
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  RUB Student Portal
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Royal University of Bhutan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/user/login"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
              {/* Temporarily commented out - Get Started button */}
              {/* <Link
                href="/user/dashboard"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
              >
                <span>Get Started</span>
                <ArrowRight size={18} />
              </Link> */}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Star size={16} className="text-blue-600" />
                Digital Transformation for RUB
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Transparent, Automated
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {" "}
                Stipend Distribution
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              From manual processing delays to automated disbursement in
              minutes. Complete transparency on all deductions. One secure
              platform for 15,600+ RUB students across 13 colleges.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/user/login"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                <LayoutDashboard size={24} />
                Access Dashboard
              </Link>
              {/* <Link
                href="/user/financial-officer"
                className="flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg border-2 border-gray-200 hover:border-gray-300"
              >
                <GraduationCap size={24} />
                Learn More
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solving the stipend distribution challenge with automation,
              transparency, and accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const colorClasses: { [key: string]: string } = {
                blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                green:
                  "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
                purple:
                  "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
                orange:
                  "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
              };

              return (
                <Link
                  key={index}
                  href={service.link}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-r ${
                        colorClasses[service.color]
                      } text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      <service.icon size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                        <span>Access Service</span>
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why This Matters
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Addressing the critical challenges in RUB's current stipend system
              with proven solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Building2 size={48} className="text-blue-200" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Transform Your Stipend Experience
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            No more manual delays. No more unclear deductions. Complete
            transparency and automated processing for all RUB students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/user/login"
              className="flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              <LayoutDashboard size={24} />
              Access Your Dashboard
            </Link>
            <Link
              href="/user/login"
              className="flex items-center justify-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-xl hover:bg-blue-400 transition-all font-semibold text-lg border-2 border-blue-400 hover:border-blue-300"
            >
              <LogIn size={24} />
              Sign In Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Image
                    src="/image/1.png"
                    width={40}
                    height={40}
                    alt="RUB Logo"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">RUB Student Portal</h3>
                  <p className="text-gray-400 text-sm">
                    Royal University of Bhutan
                  </p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                Automated, transparent stipend distribution for RUB's 15,600+
                students across 13 colleges. Replacing manual processes with
                secure, auditable digital solutions.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/user/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/finance"
                    className="hover:text-white transition-colors"
                  >
                    Financial Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bank"
                    className="hover:text-white transition-colors"
                  >
                    Banking
                  </Link>
                </li>
                <li>
                  <Link
                    href="/student"
                    className="hover:text-white transition-colors"
                  >
                    Academic Records
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    System Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Royal University of Bhutan. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Built with</span>
              <div className="flex items-center gap-2">
                <Image
                  src="/next.svg"
                  alt="Next.js"
                  width={20}
                  height={20}
                  className="invert"
                />
                <span className="text-gray-400 text-sm">Next.js</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
