import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { optimizeImage } from '@/lib/image-optimizer'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const clave = formData.get('clave') as string // ej: 'imagen_banner_inicio'

        if (!file || !clave) {
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
        }

        const supabase = createSupabaseAdmin()

        const isPdf = file.type === 'application/pdf'

        // Determinar bucket y carpeta según el tipo
        let bucketName = 'proyectos-imagenes'
        let folderPath: string
        let uploadContent: Buffer | File

        if (isPdf) {
            // Los PDFs no se optimizan — se suben tal cual
            bucketName = 'productos-pdfs'
            folderPath = `catalogos/${clave}_${Date.now()}.pdf`
            uploadContent = file
        } else {
            // Optimizar imagen: redimensionar a max 1920px y convertir a WebP 80%
            uploadContent = await optimizeImage(file)
            folderPath = `configuracion/${clave}_${uuidv4()}.webp`
        }

        // 1. Subir archivo a Storage
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(folderPath, uploadContent, {
                contentType: isPdf ? 'application/pdf' : 'image/webp',
                upsert: true,
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({ error: `Error al subir el archivo al storage: ${uploadError.message}` }, { status: 500 })
        }

        // 2. Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(folderPath)

        // 3. Upsert en configuracion_sitio
        const { error: dbError } = await (supabase.from('configuracion_sitio') as any)
            .upsert({
                clave,
                valor: publicUrl,
                descripcion: 'URL de imagen de configuración'
            }, { onConflict: 'clave' })

        if (dbError) {
            console.error('DB error:', dbError)
            return NextResponse.json({ error: 'Error al guardar en base de datos' }, { status: 500 })
        }

        return NextResponse.json({ success: true, url: publicUrl })

    } catch (error) {
        console.error('Server error upload-config:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
