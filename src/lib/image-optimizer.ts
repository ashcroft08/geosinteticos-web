/**
 * Utilidad de optimización de imágenes para los endpoints de upload.
 *
 * Responsabilidades:
 * - Redimensionar imágenes a un ancho máximo de 1920px (proporcional).
 * - Convertir a formato WebP con calidad del 80%.
 *
 * Usa `sharp`, que ya viene como dependencia transitiva de Next.js.
 */

import sharp from 'sharp'

/** Ancho máximo permitido para imágenes subidas */
const MAX_WIDTH = 1920

/** Calidad de compresión WebP (0-100) */
const WEBP_QUALITY = 80

/**
 * Optimiza un archivo de imagen: lo redimensiona y lo convierte a WebP.
 *
 * @param file - El archivo subido (File / Blob de la Web API)
 * @returns Un Buffer optimizado en formato WebP
 */
export async function optimizeImage(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)

    const optimized = await sharp(inputBuffer)
        .resize({
            width: MAX_WIDTH,
            withoutEnlargement: true, // No agranda imágenes menores a 1920px
        })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer()

    return optimized
}

/**
 * Reemplaza la extensión original del nombre de archivo por `.webp`.
 *
 * @param originalName - Nombre original del archivo (ej: `foto.jpg`)
 * @returns Nombre con extensión `.webp` (ej: `foto.webp`)
 */
export function toWebpFileName(originalName: string): string {
    const baseName = originalName.replace(/\.[^.]+$/, '')
    return `${baseName}.webp`
}
