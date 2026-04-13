'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Mail, Loader2, Key } from 'lucide-react'
import { useAdminUI } from '@/contexts/AdminUIContext'
import Link from 'next/link'
import Image from 'next/image'

export default function RecuperarPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const { showToast } = useAdminUI()
    const [sent, setSent] = useState(false)

    const handleRecuperar = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const supabase = createSupabaseClient()
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login/restablecer`,
            })

            if (error) {
                showToast(error.message, 'error')
                return
            }

            setSent(true)
            showToast('Correo de recuperación enviado exitosamente.', 'success')

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
                            <Key size={28} className="text-accent" />
                        </div>
                        <h1 className="text-2xl font-bold text-primary">Recuperar Contraseña</h1>
                        <p className="text-text-muted text-sm mt-1">Ingresa tu correo para recibir un enlace de recuperación.</p>
                    </div>

                    {sent ? (
                        <div className="space-y-6 text-center">
                            <div className="bg-accent/10 p-4 rounded-xl">
                                <p className="text-primary text-sm font-medium">
                                    Hemos enviado un correo a <strong>{email}</strong> con instrucciones para restablecer tu contraseña.
                                </p>
                                <p className="text-text-muted text-xs mt-2">
                                    Por favor revisa tu bandeja de entrada o la carpeta de spam.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full flex items-center justify-center px-6 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all shadow-sm"
                            >
                                Volver al inicio de sesión
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleRecuperar} className="space-y-5">
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
                                        placeholder="tucorreo@ejemplo.com"
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" /> Enviando...
                                    </>
                                ) : (
                                    'Enviar Enlace'
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-gray-400 text-sm mt-6">
                    <Link href="/login" className="hover:text-accent transition-colors">← Volver al login</Link>
                </p>
            </div>
        </div>
    )
}
