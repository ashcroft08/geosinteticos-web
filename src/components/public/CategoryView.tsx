'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import type { Categoria } from '@/lib/supabase/types'
import type { ProductoPublico } from '@/lib/data/productos'

interface CategoryViewProps {
    categoria: Categoria
    productos: ProductoPublico[]
}

export default function CategoryView({ categoria, productos }: CategoryViewProps) {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-primary text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <Link href="/productos" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
                        <ArrowLeft size={20} /> Volver al catálogo completo
                    </Link>
                    <span className="text-accent font-semibold text-sm tracking-wider uppercase block mb-2">Categoría</span>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{categoria.nombre}</h1>
                    {categoria.descripcion && (
                        <p className="text-gray-300 text-lg max-w-2xl">{categoria.descripcion}</p>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {productos.map((producto) => (
                        <Link
                            key={producto.slug}
                            href={`/productos/${producto.slug}`}
                            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={producto.imagenes.find(i => i.es_principal)?.url_publica || producto.imagenes[0]?.url_publica || '/placeholder.svg'}
                                    alt={producto.nombre}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                            <div className="p-8">
                                <div className="text-accent text-sm font-semibold mb-2">
                                    {producto.subcategoria_nombre}
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                                    {producto.nombre}
                                </h3>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                                    {producto.descripcion_corta}
                                </p>
                                <ul className="space-y-2 mb-6">
                                    {producto.aplicaciones.slice(0, 3).map((app, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                                            <Check size={16} className="text-accent flex-shrink-0" />
                                            <span className="truncate">{app}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                                    Ver Detalles <ArrowRight size={18} className="ml-2" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {productos.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <p className="text-text-muted text-lg">No hay productos disponibles en esta categoría por el momento.</p>
                        <Link href="/productos" className="text-accent font-bold hover:underline mt-4 inline-block">
                            Explorar otras categorías
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
