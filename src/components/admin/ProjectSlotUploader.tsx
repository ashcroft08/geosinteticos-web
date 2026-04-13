'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import { useAdminUI } from '@/contexts/AdminUIContext'

interface ProjectSlotUploaderProps {
    proyectoId: string
    currentImages: Record<string, string | null> // El JSONB de la BD
    onUploadComplete: () => void
}

const SLOTS = [
    { key: 'general', label: '📸 Foto General (Portada)' },
    { key: 'antes', label: '🏗️ Antes' },
    { key: 'durante', label: '🚧 Durante' },
    { key: 'finalizando', label: '✅ Finalizando' },
    { key: 'extra_1', label: '➕ Extra 1' },
    { key: 'extra_2', label: '➕ Extra 2' }
]

export default function ProjectSlotUploader({ proyectoId, currentImages, onUploadComplete }: ProjectSlotUploaderProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SLOTS.map((slot) => (
                <SingleSlotUploader
                    key={slot.key}
                    slotKey={slot.key}
                    label={slot.label}
                    proyectoId={proyectoId}
                    currentUrl={currentImages[slot.key]}
                    onUploadComplete={onUploadComplete}
                />
            ))}
        </div>
    )
}

function SingleSlotUploader({ slotKey, label, proyectoId, currentUrl, onUploadComplete }: { slotKey: string, label: string, proyectoId: string, currentUrl: string | null | undefined, onUploadComplete: () => void }) {
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
            formData.append('slot', slotKey)
            formData.append('proyectoId', proyectoId)

            const res = await fetch('/api/upload-slot', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al subir')
            }

            showToast(`Imagen de ${label} actualizada con éxito`, 'success')
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
        <div className="border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-[280px]">
            {/* Cabecera del Slot */}
            <div className="bg-surface border-b border-gray-100 py-3 px-4 shrink-0">
                <h4 className="font-semibold text-primary text-sm line-clamp-1">{label}</h4>
            </div>

            {/* Dropzone */}
            <div
                className={`flex-1 relative cursor-pointer flex flex-col items-center justify-center p-4 transition-colors ${isDragging ? 'bg-accent/5' : 'hover:bg-gray-50'
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
                        <Loader2 className="animate-spin mb-2" size={28} />
                        <span className="text-xs font-semibold">Subiendo...</span>
                    </div>
                ) : displayImage ? (
                    <div className="w-full h-full relative rounded-xl overflow-hidden group">
                        <Image src={displayImage} alt={label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                            <span className="bg-white/90 text-primary text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                Reemplazar Imagen
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                            <Upload size={20} />
                        </div>
                        <span className="text-xs text-center leading-relaxed px-4">Haz clic o arrastra para <br />subir imagen</span>
                    </div>
                )}
            </div>
        </div>
    )
}
