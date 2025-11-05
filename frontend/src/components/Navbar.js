"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">NaixturAi</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <Link href="/portfolio" className="hover:text-blue-600">Portfolio</Link>
          <Link href="/subscriptions" className="hover:text-blue-600">Plans</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              {user?.role === "admin" || user?.role === "owner" ? (
                <Link href="/dashboard/admin" className="hover:text-blue-600">Admin</Link>
              ) : null}
              <Link href="/notifications" className="hover:text-blue-600">Notifications</Link>
              <button onClick={logout} className="hover:text-blue-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-blue-600">Login</Link>
              <Link href="/auth/register" className="hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
