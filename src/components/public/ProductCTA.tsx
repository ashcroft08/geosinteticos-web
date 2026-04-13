'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import QuoteModal from './QuoteModal'

interface ProductCTAProps {
    productoNombre: string
    catalogoUrl: string | null
}

export default function ProductCTA({ productoNombre, catalogoUrl }: ProductCTAProps) {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex-1 bg-accent hover:bg-accent-dark text-primary font-bold py-4 px-6 rounded-xl text-center transition-colors shadow-lg cursor-pointer"
                >
                    Solicitar Cotización
                </button>
                <a
                    href={catalogoUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-colors ${!catalogoUrl ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                    <Download size={20} /> Descargar Catálogo
                </a>
            </div>

            <QuoteModal
                productoNombre={productoNombre}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    )
}
