import Link from 'next/link'
import { Check } from 'lucide-react'
import { SERVICIOS_ESTATICOS } from '@/lib/static-data'

export default function ServiciosPage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-r from-primary to-primary-light py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Nuestros Servicios</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Soluciones integrales desde el suministro de materiales hasta la instalación y post-venta.
                    </p>
                </div>
            </section>

            {/* Services */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {SERVICIOS_ESTATICOS.map((service) => (
                            <div
                                key={service.numero}
                                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                            >
                                <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6">
                                    <span className="text-primary font-bold text-xl">{service.numero}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-primary mb-3">{service.titulo}</h3>
                                <p className="text-text-muted mb-6 leading-relaxed">{service.descripcion}</p>
                                <ul className="space-y-3 mb-8">
                                    {service.items.map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-sm text-text-muted">
                                            <Check size={18} className="text-accent shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={`/contacto?servicio=${encodeURIComponent(service.titulo)}`}
                                    className="inline-flex items-center px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-all"
                                >
                                    Consultar
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
