'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, FileText, Shield } from 'lucide-react'
import ProductCTA from '@/components/public/ProductCTA'
import type { ProductoPublico } from '@/lib/data/productos'

interface ProductViewProps {
    producto: ProductoPublico
    catalogoUrl: string | null
}

export default function ProductView({ producto, catalogoUrl }: ProductViewProps) {
    const [imagenPrincipal, setImagenPrincipal] = useState(
        producto.imagenes.find(i => i.es_principal) || producto.imagenes[0]
    )

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-primary text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <Link href="/productos" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
                        <ArrowLeft size={20} /> Volver al catálogo
                    </Link>
                    <div className="flex items-center gap-3 text-sm text-accent mb-2 font-semibold">
                        <span>{producto.categoria_nombre}</span>
                        <span>/</span>
                        <span>{producto.subcategoria_nombre}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold">{producto.nombre}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-8 shadow-xl">
                    {/* Galería de Imágenes */}
                    <div className="space-y-4">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group">
                            <Image
                                src={imagenPrincipal?.url_publica || '/placeholder.svg'}
                                alt={imagenPrincipal?.alt || producto.nombre}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                priority
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {producto.imagenes.map((img, idx) => {
                                const isSelected = imagenPrincipal?.url_publica === img.url_publica
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setImagenPrincipal(img)}
                                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all ${isSelected
                                                ? 'ring-2 ring-accent ring-offset-2 opacity-100'
                                                : 'hover:opacity-100 opacity-70 hover:scale-105'
                                            } bg-gray-100`}
                                    >
                                        <Image
                                            src={img.url_publica}
                                            alt={img.alt || ''}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Información del Producto */}
                    <div>
                        <div className="prose max-w-none text-gray-600 mb-8">
                            <p className="text-lg leading-relaxed">{producto.descripcion_detallada}</p>
                        </div>

                        {/* Especificaciones Técnicas */}
                        <div className="mb-10">
                            <h3 className="flex items-center gap-2 text-xl font-bold text-primary mb-4">
                                <FileText className="text-accent" /> Especificaciones Técnicas
                            </h3>
                            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {producto.especificaciones.map((spec, idx) => (
                                            <tr key={idx} className="border-b border-gray-200 last:border-0 hover:bg-gray-100">
                                                <td className="py-3 px-4 font-semibold text-gray-700 w-1/2">{spec.propiedad}</td>
                                                <td className="py-3 px-4 text-gray-600">{spec.valor} <span className="text-gray-400 text-xs">{spec.unidad}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Aplicaciones y Certificaciones */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div>
                                <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                                    <Check className="text-accent" /> Aplicaciones
                                </h3>
                                <ul className="space-y-2">
                                    {producto.aplicaciones.map((app, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                            {app}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                                    <Shield className="text-accent" /> Certificaciones
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {producto.certificaciones.map((cert, i) => (
                                        <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                                            {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <ProductCTA productoNombre={producto.nombre} catalogoUrl={catalogoUrl} />
                    </div>
                </div>
            </div>
        </div>
    )
}
