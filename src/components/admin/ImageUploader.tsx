'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { createSupabaseClient } from '@/lib/supabase/client'

interface ImageUploaderProps {
    tipo: 'producto' | 'proyecto'
    entidadId: string
    onUploadComplete: () => void
}

export default function ImageUploader({ tipo, entidadId, onUploadComplete }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

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
        if (!file.type.startsWith('image/')) return alert('Solo se permiten imágenes')

        // Preview local
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)

        upload(file)
    }

    const upload = async (file: File) => {
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('tipo', tipo) // 'producto' o 'proyecto'
            formData.append('id', entidadId)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Error al subir')
            }

            setPreview(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            onUploadComplete() // Recargar lista de imágenes
        } catch (error) {
            console.error(error)
            alert('Error al subir la imagen')
            setPreview(null)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${isDragging ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-accent/50'
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
                <div className="flex flex-col items-center justify-center py-4">
                    <Loader2 className="animate-spin text-accent mb-2" size={32} />
                    <p className="text-sm text-gray-500">Subiendo imagen...</p>
                </div>
            ) : preview ? (
                <div className="relative aspect-video max-w-xs mx-auto rounded-lg overflow-hidden border border-gray-200">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white" size={32} />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-4 text-gray-500">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                        <Upload size={24} />
                    </div>
                    <p className="font-medium text-primary">Haz clic o arrastra una imagen aquí</p>
                    <p className="text-xs mt-1">Soporta JPG, PNG, WEBP</p>
                </div>
            )}
        </div>
    )
}
