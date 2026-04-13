'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'

interface ConfirmDialogProps {
    message: string
    isVisible: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({ message, isVisible, onConfirm, onCancel }: ConfirmDialogProps) {
    const [render, setRender] = useState(isVisible)

    useEffect(() => {
        if (isVisible) setRender(true)
    }, [isVisible])

    const onAnimationEnd = () => {
        if (!isVisible) setRender(false)
    }

    if (!render) return null

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-200 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            onAnimationEnd={onAnimationEnd}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className={`relative bg-surface p-6 rounded-2xl shadow-xl w-full max-w-sm mx-4 flex flex-col items-center text-center border border-gray-100 transition-all duration-300 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                }`}>
                <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
                    <AlertTriangle size={32} />
                </div>

                <h3 className="text-lg font-bold text-primary mb-2">
                    Aviso Importante
                </h3>

                <p className="text-text-muted text-sm mb-6 leading-relaxed">
                    {message}
                </p>

                <div className="flex items-center gap-3 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:text-primary transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                    >
                        <Trash2 size={16} />
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}
