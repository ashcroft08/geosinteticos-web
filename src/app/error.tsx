'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertOctagon, RotateCcw, Home, Headset } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Aquí se podría integrar un servicio de reporte de errores como Sentry
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center animate-fade-in-up">
            <div className="relative mb-10">
                <div className="bg-red-50 p-8 rounded-full animate-float">
                    <AlertOctagon size={80} className="text-red-500" strokeWidth={1.5} />
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
                Algo no salió como esperábamos
            </h1>

            <p className="text-lg text-text-muted max-w-lg mb-10 leading-relaxed">
                Nuestro equipo de mantenimiento ya ha sido notificado de este inconveniente técnico. Por favor, intenta de nuevo o regresa al inicio.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl">
                <button
                    onClick={() => reset()}
                    className="w-full sm:w-auto bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                    <RotateCcw size={18} />
                    Intentar Nuevamente
                </button>
                <Link
                    href="/"
                    className="w-full sm:w-auto bg-surface hover:bg-gray-100 text-primary font-semibold py-3 px-8 rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-2"
                >
                    <Home size={18} />
                    Volver al Inicio
                </Link>
                <Link
                    href="/contacto"
                    className="w-full sm:w-auto bg-surface hover:bg-gray-100 text-primary font-semibold py-3 px-8 rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-2"
                >
                    <Headset size={18} />
                    Soporte
                </Link>
            </div>
        </div>
    )
}
