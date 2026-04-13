'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageType {
    url_publica: string | null;
    descripcion: string | null;
}

interface ProjectGalleryProps {
    images: ImageType[]
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return
            if (e.key === 'Escape') closeLightbox()
            if (e.key === 'ArrowRight') nextImage(new MouseEvent('click') as any)
            if (e.key === 'ArrowLeft') prevImage(new MouseEvent('click') as any)
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [lightboxOpen])

    if (!images || images.length === 0) return null

    const openLightbox = (index: number) => {
        setCurrentIndex(index)
        setLightboxOpen(true)
        document.body.style.overflow = 'hidden'
    }

    const closeLightbox = () => {
        setLightboxOpen(false)
        document.body.style.overflow = 'auto'
    }

    const nextImage = (e: React.MouseEvent) => {
        e?.stopPropagation()
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = (e: React.MouseEvent) => {
        e?.stopPropagation()
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-primary mb-8">Galería del Proyecto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {images.map((img, i) => (
                    <div
                        key={i}
                        className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-lg cursor-pointer"
                        onClick={() => openLightbox(i)}
                    >
                        <Image
                            src={img.url_publica || '/placeholder.svg'}
                            alt={img.descripcion || `Imagen ${i + 1} del proyecto`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        {img.descripcion && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-sm">{img.descripcion}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full cursor-pointer z-10"
                        onClick={closeLightbox}
                    >
                        <X size={24} />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-white/10 p-3 rounded-full cursor-pointer z-10"
                                onClick={prevImage}
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-white/10 p-3 rounded-full cursor-pointer z-10"
                                onClick={nextImage}
                            >
                                <ChevronRight size={28} />
                            </button>
                        </>
                    )}

                    <div
                        className="relative w-full h-full max-h-[85vh] max-w-6xl mx-auto px-4 sm:px-16 flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={images[currentIndex].url_publica || '/placeholder.svg'}
                                alt={images[currentIndex].descripcion || `Imagen ${currentIndex + 1} del proyecto`}
                                fill
                                className="object-contain"
                                quality={100}
                                priority
                            />
                        </div>
                        {images[currentIndex].descripcion && (
                            <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                                <p className="text-white text-lg bg-black/50 inline-block px-4 py-2 rounded-lg backdrop-blur-sm">{images[currentIndex].descripcion}</p>
                            </div>
                        )}
                        <div className="absolute top-4 left-8 text-white/60 text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
