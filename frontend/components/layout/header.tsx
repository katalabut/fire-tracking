'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 leading-none">
                  Cyprus Fire Tracker
                </h1>
                <span className="text-xs text-gray-500 leading-none mt-0.5">Emergency Response System</span>
              </div>
            </Link>
            {user && (
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  href="/"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  🗺️ Map
                </Link>
                <Link
                  href="/fires"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/fires')
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  📋 All Fires
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 leading-none">
                      {user.name}
                    </span>
                    {user.role === 'firefighter' && (
                      <span className="text-xs text-red-600 font-medium leading-none mt-0.5">
                        🚒 Firefighter
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
