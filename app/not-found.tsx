import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8fafc] text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">404 - Page Not Found</h2>
      <p className="text-sm text-slate-600 mb-4">The requested page could not be found.</p>
      <Link href="/" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs">
        Return Home
      </Link>
    </div>
  );
}
