import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin } from 'lucide-react'
import { fetchProyectos } from '@/lib/data/proyectos'

export const metadata = {
    title: 'Proyectos | GeoSintéticos Industrial',
    description: 'Nuestra experiencia en proyectos de minería, agricultura e infraestructura.',
}

export const revalidate = 60 // Revalidar cada minuto

export default async function ProyectosPage() {
    const proyectos = await fetchProyectos()

    return (
        <div className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-accent font-semibold text-sm tracking-wider uppercase">Nuestro Portafolio</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mt-3 mb-6">
                        Proyectos Ejecutados
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Más de 25 años brindando soluciones de ingeniería con los más altos estándares de calidad y seguridad.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {proyectos.map((proyecto) => (
                        <Link
                            key={proyecto.slug}
                            href={`/proyectos/${proyecto.slug}`}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={proyecto.imagenes_estructuradas?.general || proyecto.imagenes_estructuradas?.antes || proyecto.imagenes_estructuradas?.durante || '/placeholder.svg'}
                                    alt={proyecto.titulo}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    {proyecto.tipo_obra}
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-text-muted text-sm mb-3">
                                    <MapPin size={16} className="text-accent" />
                                    {proyecto.ciudad}, {proyecto.region}
                                </div>
                                <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                                    {proyecto.titulo}
                                </h3>
                                <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                                    {proyecto.reto}
                                </p>
                                <div className="flex items-center text-primary font-bold group-hover:translate-x-2 transition-transform mt-auto">
                                    Ver Proyecto <ArrowRight size={20} className="ml-2" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
