'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, Filter, X } from 'lucide-react'
import type { Categoria } from '@/lib/supabase/types'
import type { ProductoPublico } from '@/lib/data/productos'

interface ProductCatalogProps {
    categorias: Categoria[]
    productos: ProductoPublico[]
}

export default function ProductCatalog({ categorias, productos }: ProductCatalogProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    // Filtrar productos
    const filteredProducts = selectedCategory
        ? productos.filter(p => p.categoria_nombre === selectedCategory)
        : productos

    // Obtener título actual
    const currentTitle = selectedCategory || 'Todas las Categorías'

    return (
        <div>
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 text-primary font-semibold"
                >
                    <span className="flex items-center gap-2">
                        <Filter size={18} className="text-accent" />
                        Filtros
                    </span>
                    <span className="text-sm text-gray-500">{selectedCategory || 'Todos'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <aside className={`
                    lg:col-span-1 lg:block
                    ${mobileFiltersOpen ? 'block' : 'hidden'}
                `}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-primary flex items-center gap-2">
                                <Filter size={20} className="text-accent" />
                                Categorías
                            </h3>
                            <button
                                onClick={() => setMobileFiltersOpen(false)}
                                className="lg:hidden text-gray-400 hover:text-red-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    setSelectedCategory(null)
                                    setMobileFiltersOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${selectedCategory === null
                                        ? 'bg-accent text-white font-bold shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                    }`}
                            >
                                Todas
                                {selectedCategory === null && <Check size={16} />}
                            </button>
                            {categorias.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setSelectedCategory(cat.nombre)
                                        setMobileFiltersOpen(false)
                                    }}
                                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${selectedCategory === cat.nombre
                                            ? 'bg-accent text-white font-bold shadow-md'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                        }`}
                                >
                                    {cat.nombre}
                                    {selectedCategory === cat.nombre && <Check size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="lg:col-span-3">
                    <div className="mb-6 flex justify-between items-end">
                        <h2 className="text-2xl font-bold text-primary">{currentTitle}</h2>
                        <span className="text-sm text-gray-500 font-medium">
                            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((producto) => (
                                <Link
                                    key={producto.slug}
                                    href={`/productos/${producto.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <Image
                                            src={producto.imagenes.find(i => i.es_principal)?.url_publica || producto.imagenes[0]?.url_publica || '/placeholder.svg'}
                                            alt={producto.nombre}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-primary shadow-sm">
                                            {producto.subcategoria_nombre}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                                            {producto.nombre}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                                            {producto.descripcion_corta}
                                        </p>
                                        <div className="flex items-center text-accent text-sm font-bold group-hover:translate-x-2 transition-transform mt-auto">
                                            Ver Detalles <ArrowRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Filter size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">No se encontraron productos</h3>
                                <p className="text-gray-500 text-sm">Prueba seleccionando otra categoría.</p>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="mt-4 text-accent font-bold hover:underline"
                                >
                                    Ver todos los productos
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
