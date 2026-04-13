'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import { useAdminUI } from '@/contexts/AdminUIContext'

interface ConfigImageUploaderProps {
    clave: string
    label: string
    currentUrl?: string
    onUploadComplete: () => void
}

export default function ConfigImageUploader({ clave, label, currentUrl, onUploadComplete }: ConfigImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
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
        if (!file.type.startsWith('image/')) {
            showToast('Solo se permiten imágenes', 'error')
            return
        }

        // Preview local
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)

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
                throw new Error(data.error || 'Error al subir')
            }

            showToast(`${label} actualizada con éxito`, 'success')
            setPreview(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            onUploadComplete()
        } catch (error: any) {
            console.error(error)
            showToast(error.message || 'Error al subir la imagen', 'error')
            setPreview(null)
        } finally {
            setUploading(false)
        }
    }

    const displayImage = preview || currentUrl

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-surface border-b border-gray-100 py-3 px-6 shrink-0">
                <h3 className="font-bold text-primary">{label}</h3>
                <p className="text-xs text-text-muted mt-1">Sube una imagen de alta calidad para cambiar este elemento visual.</p>
            </div>

            <div
                className={`flex-1 relative cursor-pointer flex flex-col items-center justify-center p-6 h-[250px] transition-colors ${isDragging ? 'bg-accent/5' : 'hover:bg-gray-50'
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
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                />

                {uploading ? (
                    <div className="flex flex-col items-center justify-center text-accent">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        <span className="text-sm font-semibold">Subiendo imagen...</span>
                    </div>
                ) : displayImage ? (
                    <div className="w-full h-full relative rounded-xl overflow-hidden group shadow-sm">
                        <Image src={displayImage} alt={label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                            <span className="bg-white text-primary text-sm font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                Reemplazar Imagen
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                            <Upload size={28} />
                        </div>
                        <span className="text-sm font-medium text-center">Haz clic o arrastra aquí para <br />subir una imagen</span>
                    </div>
                )}
            </div>
        </div>
    )
}
