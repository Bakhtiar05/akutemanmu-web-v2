import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminHeader from './AdminHeader'
import { getUserRole } from '@/lib/auth/roles'
import { LayoutDashboard, FileText, PenTool, Users, ArrowLeft } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  // Jika belum login, tampilkan form login tanpa Header/Sidebar
  // Kita tidak menggunakan redirect karena sudah diurus oleh middleware.ts
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        {children}
      </div>
    )
  }

  // Jika sudah login, tampilkan Dashboard Admin secara utuh
  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader email={user.email || ''} />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 border-r border-neutral-200 bg-white min-h-[calc(100vh-64px)]">
          <nav className="p-4 space-y-1">
            {role === 'super_admin' && (
              <Link href="/admin" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-700 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
            
            {(role === 'super_admin' || role === 'admin_artikel') && (
              <>
                <Link href="/admin/artikel" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-700 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-colors">
                  <FileText className="w-4 h-4" />
                  Artikel
                </Link>
                <Link href="/admin/artikel/editor" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-700 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-colors">
                  <PenTool className="w-4 h-4" />
                  Tulis Artikel
                </Link>
              </>
            )}

            {(role === 'super_admin' || role === 'admin_konseling') && (
              <Link href="/admin/konseling" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-700 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-colors">
                <Users className="w-4 h-4" />
                Konseling
              </Link>
            )}

            <div className="pt-4 mt-4 border-t border-neutral-200">
              <Link href="/" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-400 rounded-lg hover:bg-neutral-50 hover:text-neutral-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Situs
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-8 max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  )
}
