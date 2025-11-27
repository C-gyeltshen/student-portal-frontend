import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Student Portal
          </h1>
          <h2 className="text-xl sm:text-2xl text-gray-600 mb-2">
            Royal University of Bhutan
          </h2>
          <p className="text-sm text-gray-500">
            Secure authentication & role-based access
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/login"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-indigo-600 text-white gap-2 hover:bg-indigo-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 min-w-[140px]"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-solid border-indigo-200 transition-colors flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 font-medium text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 min-w-[140px] text-indigo-600"
          >
            Create Account
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 max-w-md">
          <h3 className="font-medium text-gray-900 mb-3">Access Levels</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>
                <strong>Students:</strong> View profile & banking details
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>
                <strong>Finance Officers:</strong> Manage student banking
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>
                <strong>Administrators:</strong> Full system access
              </span>
            </li>
          </ul>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <div className="text-xs text-gray-500">
          Powered by Firebase Authentication & Next.js
        </div>
      </footer>
    </div>
  );
}
