'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, FileText, CheckCircle } from 'lucide-react'
import { useAdminUI } from '@/contexts/AdminUIContext'

interface ConfigPdfUploaderProps {
    clave: string
    label: string
    currentUrl?: string
    onUploadComplete: () => void
}

export default function ConfigPdfUploader({ clave, label, currentUrl, onUploadComplete }: ConfigPdfUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { showToast } = useAdminUI()

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    const handleFile = async (file: File) => {
        if (file.type !== 'application/pdf') {
            showToast('Solo se permiten archivos PDF', 'error')
            return
        }
        await upload(file)
    }

    const upload = async (file: File) => {
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('clave', clave)

            const res = await fetch('/api/upload-config', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al subir documento')
            }

            showToast(`${label} actualizado con éxito`, 'success')
            if (fileInputRef.current) fileInputRef.current.value = ''
            onUploadComplete()
        } catch (error: any) {
            console.error(error)
            showToast(error.message || 'Error al subir el archivo', 'error')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-surface border-b border-gray-100 py-3 px-6 shrink-0 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-primary">{label}</h3>
                    <p className="text-xs text-text-muted mt-1">Sube el documento PDF (max 10MB idealmente).</p>
                </div>
                {currentUrl && !uploading && (
                    <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
                        <CheckCircle size={14} /> Ver Actual
                    </a>
                )}
            </div>

            <div
                className={`flex-1 relative cursor-pointer flex flex-col items-center justify-center p-6 h-[200px] transition-colors ${isDragging ? 'bg-accent/5' : 'hover:bg-gray-50'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    disabled={uploading}
                />

                {uploading ? (
                    <div className="flex flex-col items-center justify-center text-accent">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        <span className="text-sm font-semibold">Subiendo PDF...</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${currentUrl ? 'bg-green-50 text-green-500' : 'bg-gray-100 group-hover:bg-accent/10 group-hover:text-accent'
                            }`}>
                            {currentUrl ? <FileText size={28} /> : <Upload size={28} />}
                        </div>
                        <span className="text-sm font-medium text-center">
                            {currentUrl ? 'Haz clic para reemplazar' : 'Haz clic o arrastra un PDF aquí'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
