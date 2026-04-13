'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { AdminUIProvider } from '@/contexts/AdminUIContext'
import {
    LayoutDashboard,
    Package,
    FolderKanban,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    ChevronRight,
    Layers,
} from 'lucide-react'

const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/categorias', label: 'Categorías', icon: Layers },
    { href: '/admin/productos', label: 'Productos', icon: Package },
    { href: '/admin/proyectos', label: 'Proyectos', icon: FolderKanban },
    { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
    { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userEmail, setUserEmail] = useState('')

    // Configuración de inactividad (15 minutos)
    const INACTIVITY_TIME = 15 * 60 * 1000
    let inactivityTimer: NodeJS.Timeout

    const handleLogout = async () => {
        try {
            const supabase = createSupabaseClient()
            await supabase.auth.signOut()
            localStorage.clear() // Limpieza extra
            sessionStorage.clear()
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            window.location.href = '/login' // Recarga completa para limpiar estado de memoria
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            window.location.href = '/login'
        }
    }

    const resetInactivityTimer = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer)
        inactivityTimer = setTimeout(() => {
            console.log('Cerrando sesión por inactividad...')
            handleLogout()
        }, INACTIVITY_TIME)
    }

    useEffect(() => {
        const supabase = createSupabaseClient()
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) {
                router.push('/login')
            } else {
                setUserEmail(data.user.email || '')
            }
        })

        // Listeners para actividad
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
        const handleActivity = () => resetInactivityTimer()

        events.forEach(event => window.addEventListener(event, handleActivity))
        resetInactivityTimer() // Iniciar timer

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity))
            if (inactivityTimer) clearTimeout(inactivityTimer)
        }
    }, [])

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin'
        return pathname.startsWith(href)
    }

    const renderSidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-5 border-b border-white/10">
                <Link href="/admin" className="flex items-center gap-3">
                    <Image
                        src="/Logo.png"
                        alt="Geomembrana & Geosintéticos"
                        width={36}
                        height={36}
                        className="rounded-lg"
                    />
                    <div className="leading-tight">
                        <span className="font-bold text-white text-sm tracking-wide">ADMIN</span>
                        <span className="block text-[10px] text-accent font-semibold tracking-[0.15em]">G&G</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item.href)
                                ? 'bg-accent text-white shadow-sm'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                            {isActive(item.href) && <ChevronRight size={16} className="ml-auto" />}
                        </Link>
                    )
                })}
            </nav>

            {/* User + Logout */}
            <div className="p-4 border-t border-white/10">
                {userEmail && (
                    <p className="text-gray-400 text-xs truncate mb-3 px-2">{userEmail}</p>
                )}
                <div className="flex gap-2">
                    <Link
                        href="/"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all text-xs font-medium"
                    >
                        <Home size={14} /> Sitio
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-xs font-medium"
                    >
                        <LogOut size={14} /> Salir
                    </button>
                </div>
            </div>
        </>
    )

    return (
        <AdminUIProvider>
            <div className="flex h-screen bg-surface">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex flex-col w-64 bg-primary shrink-0">
                    {renderSidebarContent()}
                </aside>

                {/* Mobile Sidebar */}
                {sidebarOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                        <aside className="fixed top-0 left-0 w-72 h-full bg-primary z-50 flex flex-col lg:hidden shadow-2xl">
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                            {renderSidebarContent()}
                        </aside>
                    </>
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Menu size={22} />
                            </button>
                            <h1 className="font-semibold text-primary text-lg capitalize">
                                {NAV_ITEMS.find((item) => isActive(item.href))?.label || 'Admin'}
                            </h1>
                        </div>
                        <div className="text-sm text-text-muted hidden sm:block">
                            {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
                </div>
            </div>
        </AdminUIProvider>
    )
}
