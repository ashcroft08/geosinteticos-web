'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Loader2 } from 'lucide-react'
import { useAdminUI } from '@/contexts/AdminUIContext'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { showToast } = useAdminUI()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const supabase = createSupabaseClient()
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) {
                showToast(
                    authError.message === 'Invalid login credentials'
                        ? 'Credenciales inválidas. Verifica tu email y contraseña.'
                        : authError.message,
                    'error'
                )
                return
            }

            router.push('/admin')
            router.refresh()
        } catch {
            showToast('Error inesperado. Intenta de nuevo.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <Image
                            src="/Logo.png"
                            alt="Geomembrana & Geosintéticos"
                            width={48}
                            height={48}
                            className="rounded-xl transition-transform group-hover:scale-110"
                        />
                        <div className="leading-tight text-left">
                            <span className="font-bold text-white text-xl tracking-wide">GEOMEMBRANA</span>
                            <span className="block text-xs text-accent font-semibold tracking-[0.2em]">Panel Administrativo</span>
                        </div>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock size={28} className="text-accent" />
                        </div>
                        <h1 className="text-2xl font-bold text-primary">Iniciar Sesión</h1>
                        <p className="text-text-muted text-sm mt-1">Ingresa tus credenciales de administrador</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-primary mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@geosinteticos.com"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-primary mb-1.5">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm"
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <Link
                                    href="/login/recuperar"
                                    className="text-xs font-semibold text-accent hover:text-accent-dark transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Ingresando...
                                </>
                            ) : (
                                'Ingresar'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-400 text-sm mt-6">
                    <Link href="/" className="hover:text-accent transition-colors">← Volver al sitio</Link>
                </p>
            </div>
        </div>
    )
}
