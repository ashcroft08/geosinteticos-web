'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface QuoteModalProps {
    productoNombre: string
    isOpen: boolean
    onClose: () => void
}

export default function QuoteModal({ productoNombre, isOpen, onClose }: QuoteModalProps) {
    const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [formData, setFormData] = useState({
        nombre: '',
        empresa: '',
        email: '',
        telefono: '',
        metrosCuadrados: '',
        mensaje: '',
    })

    // Cerrar con Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormState('loading')

        try {
            const mensajeCompleto = [
                formData.metrosCuadrados ? `Metros cuadrados proyectados: ${formData.metrosCuadrados}` : '',
                formData.mensaje,
            ].filter(Boolean).join('\n\n')

            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    empresa: formData.empresa,
                    email: formData.email,
                    telefono: formData.telefono,
                    tipo_proyecto: '',
                    producto_nombre: productoNombre,
                    mensaje: mensajeCompleto,
                    acepto_politica: true,
                    canal: 'cotizacion',
                }),
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.error || 'Error al enviar')
            }

            setFormState('success')
        } catch {
            setFormState('error')
        }
    }

    const resetAndClose = () => {
        setFormState('idle')
        setFormData({ nombre: '', empresa: '', email: '', telefono: '', metrosCuadrados: '', mensaje: '' })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={resetAndClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="sticky top-0 bg-primary text-white px-6 py-5 rounded-t-2xl z-10">
                    <button
                        onClick={resetAndClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label="Cerrar"
                    >
                        <X size={18} />
                    </button>
                    <h3 className="text-xl font-bold">Cotización Rápida</h3>
                    <p className="text-gray-300 text-sm mt-1">
                        Producto: <span className="text-accent font-semibold">{productoNombre}</span>
                    </p>
                </div>

                {/* Body */}
                <div className="p-6">
                    {formState === 'success' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} className="text-green-500" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">¡Cotización Enviada!</h4>
                            <p className="text-gray-500 mb-6">Nuestro equipo te contactará a la brevedad con la información solicitada.</p>
                            <button
                                onClick={resetAndClose}
                                className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {formState === 'error' && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                                    <AlertCircle size={18} className="text-red-500 shrink-0" />
                                    <p className="text-red-700 text-sm">Error al enviar. Intenta de nuevo.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="qm-nombre" className="block text-sm font-semibold text-primary mb-1">Nombre *</label>
                                    <input
                                        type="text" id="qm-nombre" name="nombre" required
                                        value={formData.nombre} onChange={handleChange}
                                        placeholder="Tu nombre"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="qm-empresa" className="block text-sm font-semibold text-primary mb-1">Empresa</label>
                                    <input
                                        type="text" id="qm-empresa" name="empresa"
                                        value={formData.empresa} onChange={handleChange}
                                        placeholder="Tu empresa"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="qm-email" className="block text-sm font-semibold text-primary mb-1">Email *</label>
                                    <input
                                        type="email" id="qm-email" name="email" required
                                        value={formData.email} onChange={handleChange}
                                        placeholder="tu@email.com"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="qm-telefono" className="block text-sm font-semibold text-primary mb-1">Teléfono *</label>
                                    <input
                                        type="tel" id="qm-telefono" name="telefono" required
                                        value={formData.telefono} onChange={handleChange}
                                        placeholder="+51 999 999 999"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="qm-metros" className="block text-sm font-semibold text-primary mb-1">Metros cuadrados proyectados</label>
                                <input
                                    type="text" id="qm-metros" name="metrosCuadrados"
                                    value={formData.metrosCuadrados} onChange={handleChange}
                                    placeholder="Ej: 5,000 m²"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="qm-mensaje" className="block text-sm font-semibold text-primary mb-1">Mensaje</label>
                                <textarea
                                    id="qm-mensaje" name="mensaje" rows={3}
                                    value={formData.mensaje} onChange={handleChange}
                                    placeholder="Detalles adicionales sobre tu proyecto..."
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-none"
                                />
                            </div>

                            <p className="text-xs text-gray-400">
                                Al enviar aceptas nuestra <a href="#" className="text-accent hover:underline">política de privacidad</a>.
                            </p>

                            <button
                                type="submit"
                                disabled={formState === 'loading'}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {formState === 'loading' ? (
                                    <><Loader2 size={18} className="animate-spin" /> Enviando...</>
                                ) : (
                                    'Solicitar Cotización'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
