'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import Toast, { ToastType } from '@/components/admin/Toast'

interface ContactoData {
    telefono: string
    email: string
    direccion: string
    horario: string
}

function ContactFormContent({ contacto }: { contacto: ContactoData }) {
    const searchParams = useSearchParams()
    const productoParam = searchParams.get('producto') || ''
    const servicioParam = searchParams.get('servicio') || ''

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast, setToast] = useState({ message: '', type: 'success' as ToastType, isVisible: false })

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type, isVisible: true })
        setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 5000)
    }
    const [formData, setFormData] = useState({
        nombre: '',
        empresa: '',
        email: '',
        telefono: '',
        tipoProyecto: '',
        mensaje: productoParam
            ? `Me interesa el producto: ${productoParam}`
            : servicioParam
                ? `Me interesa el servicio: ${servicioParam}`
                : '',
        politica: false,
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = e.target
        const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value
        setFormData((prev) => ({ ...prev, [target.name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    empresa: formData.empresa,
                    email: formData.email,
                    telefono: formData.telefono,
                    tipo_proyecto: formData.tipoProyecto,
                    producto_nombre: productoParam,
                    mensaje: formData.mensaje,
                    acepto_politica: formData.politica,
                    canal: productoParam ? 'cotizacion' : 'formulario',
                }),
            })

            if (!res.ok) throw new Error('Error al enviar')

            showToast('¡Mensaje enviado con éxito! Nos comunicaremos a la brevedad.', 'success')
            setFormData({ nombre: '', empresa: '', email: '', telefono: '', tipoProyecto: '', mensaje: '', politica: false })
        } catch {
            showToast('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 bg-primary rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2">Información de Contacto</h3>
                <p className="text-gray-400 mb-8">Estamos listos para atender tus consultas.</p>
                <div className="space-y-6">
                    {[
                        { icon: <Phone size={22} />, label: 'Teléfono', value: contacto.telefono },
                        { icon: <Mail size={22} />, label: 'Email', value: contacto.email },
                        { icon: <MapPin size={22} />, label: 'Dirección', value: contacto.direccion },
                        { icon: <Clock size={22} />, label: 'Horario', value: contacto.horario },
                    ].map((item) => (
                        <div key={item.label} className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{item.label}</p>
                                <p className="font-medium">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
                <h3 className="text-xl font-bold text-primary mb-2">Envíanos un mensaje</h3>
                <p className="text-text-muted text-sm mb-6">Todos los campos marcados con * son obligatorios</p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-semibold text-primary mb-1.5">Nombre completo *</label>
                            <input
                                type="text" id="nombre" name="nombre" required
                                value={formData.nombre} onChange={handleChange}
                                placeholder="Tu nombre"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="empresa" className="block text-sm font-semibold text-primary mb-1.5">Empresa</label>
                            <input
                                type="text" id="empresa" name="empresa"
                                value={formData.empresa} onChange={handleChange}
                                placeholder="Tu empresa"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-primary mb-1.5">Email *</label>
                            <input
                                type="email" id="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                placeholder="tu@email.com"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="telefono" className="block text-sm font-semibold text-primary mb-1.5">Teléfono *</label>
                            <input
                                type="tel" id="telefono" name="telefono" required
                                value={formData.telefono} onChange={handleChange}
                                placeholder="+51 999 999 999"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="tipoProyecto" className="block text-sm font-semibold text-primary mb-1.5">Tipo de proyecto *</label>
                        <select
                            id="tipoProyecto" name="tipoProyecto" required
                            value={formData.tipoProyecto} onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm bg-white"
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="mineria">Minería</option>
                            <option value="agricultura">Agricultura</option>
                            <option value="piscina-residencial">Piscina Residencial</option>
                            <option value="piscina-comercial">Piscina Comercial</option>
                            <option value="reservorio">Reservorio de Agua</option>
                            <option value="relleno-sanitario">Relleno Sanitario</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="mensaje" className="block text-sm font-semibold text-primary mb-1.5">Mensaje</label>
                        <textarea
                            id="mensaje" name="mensaje" rows={4}
                            value={formData.mensaje} onChange={handleChange}
                            placeholder="Cuéntanos más sobre tu proyecto..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm resize-none"
                        />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox" name="politica" required
                            checked={formData.politica}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 accent-accent"
                        />
                        <span className="text-sm text-text-muted">
                            Acepto la <a href="#" className="text-accent hover:underline font-medium">política de privacidad</a> *
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-lg"
                    >
                        {isSubmitting ? (
                            <><Loader2 size={20} className="animate-spin" /> Enviando...</>
                        ) : (
                            'Enviar Consulta'
                        )}
                    </button>
                </form>
            </div>
            {/* Global Toast Message */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    )
}

export default function ContactFormClient({ contacto }: { contacto: ContactoData }) {
    return (
        <Suspense fallback={<div className="text-center py-8">Cargando formulario...</div>}>
            <ContactFormContent contacto={contacto} />
        </Suspense>
    )
}
