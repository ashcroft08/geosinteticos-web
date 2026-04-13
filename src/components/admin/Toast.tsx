'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning'

interface ToastProps {
    message: string
    type: ToastType
    isVisible: boolean
    onClose: () => void
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
    const [render, setRender] = useState(isVisible)

    useEffect(() => {
        if (isVisible) setRender(true)
    }, [isVisible])

    const onAnimationEnd = () => {
        if (!isVisible) setRender(false)
    }

    if (!render) return null

    const styles = {
        success: 'bg-accent text-white shadow-accent/20',     // Teal
        error: 'bg-red-500 text-white shadow-red-500/20',
        warning: 'bg-orange-500 text-white shadow-orange-500/20'
    }

    const icons = {
        success: <CheckCircle2 size={20} className="text-white" />,
        error: <AlertCircle size={20} className="text-white" />,
        warning: <AlertTriangle size={20} className="text-white" />
    }

    return (
        <div
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all duration-300 ${styles[type]
                } ${isVisible ? 'translate-y-0 opacity-100 animate-fade-in-up' : 'translate-y-4 opacity-0 pointer-events-none'
                }`}
            onAnimationEnd={onAnimationEnd}
        >
            {icons[type]}
            <p className="font-medium text-sm pr-6 leading-tight">{message}</p>
            <button
                onClick={onClose}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    )
}
