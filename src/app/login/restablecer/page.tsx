'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, KeyRound } from 'lucide-react'
import { useAdminUI } from '@/contexts/AdminUIContext'
import Link from 'next/link'
import Image from 'next/image'

export default function RestablecerPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { showToast } = useAdminUI()

    useEffect(() => {
        // Verificar que haya un hash de recuperación en la URL o una sesión válida
        const checkSession = async () => {
            const supabase = createSupabaseClient()
            const { data: { session } } = await supabase.auth.getSession()

            // Si no hay hash en la URL (al momento de montar) y no hay sesión, 
            // el link es inválido o expiró
            if (!session && !window.location.hash.includes('type=recovery')) {
                showToast('Enlace inválido o expirado. Por favor solicita uno nuevo.', 'warning')
                router.push('/login/recuperar')
            }
        }

        checkSession()
    }, [router, showToast])

    const handleRestablecer = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            showToast('Las contraseñas no coinciden.', 'warning')
            return
        }

        if (password.length < 6) {
            showToast('La contraseña debe tener al menos 6 caracteres.', 'warning')
            return
        }

        setLoading(true)

        try {
            const supabase = createSupabaseClient()
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) {
                showToast(error.message, 'error')
                return
            }

            showToast('Contraseña actualizada exitosamente.', 'success')
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
                            <KeyRound size={28} className="text-accent" />
                        </div>
                        <h1 className="text-2xl font-bold text-primary">Nueva Contraseña</h1>
                        <p className="text-text-muted text-sm mt-1">Ingresa tu nueva contraseña para acceder al panel.</p>
                    </div>

                    <form onSubmit={handleRestablecer} className="space-y-5">
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-primary mb-1.5">
                                Nueva Contraseña
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
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-primary mb-1.5">
                                Repetir Contraseña
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Guardando...
                                </>
                            ) : (
                                'Guardar y Entrar'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-400 text-sm mt-6">
                    <Link href="/login" className="hover:text-accent transition-colors">← Volver al login</Link>
                </p>
            </div>
        </div>
    )
}
