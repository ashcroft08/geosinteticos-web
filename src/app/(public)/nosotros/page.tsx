import Image from 'next/image'
import { Check, Target, Users, Shield, Award } from 'lucide-react'
import { fetchCertificaciones, fetchEmpresaInfo } from '@/lib/data/configuracion'

export const metadata = {
    title: 'Nosotros | GeoSintéticos Industrial',
    description: 'Conozca nuestra historia, misión y certificaciones que avalan nuestra calidad.',
}

export const revalidate = 60 // Revalidar cada minuto

export default async function NosotrosPage() {
    const [certificaciones, empresa] = await Promise.all([
        fetchCertificaciones(),
        fetchEmpresaInfo(),
    ])

    return (
        <>
            {/* Hero */}
            <section className="relative py-24 bg-primary overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                </div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <span className="text-accent font-semibold tracking-wider uppercase">Nuestra Historia</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
                        Más de 25 Años <br />
                        <span className="text-accent">Construyendo Confianza</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        {empresa.descripcion}
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center p-8 bg-surface rounded-3xl hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Target size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">Misión</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {empresa.mision}
                            </p>
                        </div>
                        <div className="text-center p-8 bg-surface rounded-3xl hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Users size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">Visión</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {empresa.vision}
                            </p>
                        </div>
                        <div className="text-center p-8 bg-surface rounded-3xl hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">Valores</h3>
                            <ul className="text-gray-600 space-y-2 text-left inline-block">
                                {empresa.valores.map((valor) => (
                                    <li key={valor} className="flex items-center gap-2"><Check size={16} className="text-accent" /> {valor}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Certifications */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-accent font-semibold tracking-wider uppercase">Calidad Garantizada</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mt-3">Nuestras Certificaciones</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {certificaciones.map((cert) => (
                            <div key={cert.nombre} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border-b-4 border-accent">
                                <div className="text-accent mb-4">
                                    <Award size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-primary mb-2">{cert.nombre}</h4>
                                <div className="text-sm font-semibold text-gray-500 mb-2">{cert.emisor}</div>
                                <p className="text-gray-600 text-sm mb-3">{cert.descripcion}</p>
                                <div className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                                    Vigente
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
