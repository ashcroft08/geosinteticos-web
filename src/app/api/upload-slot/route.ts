import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { optimizeImage } from '@/lib/image-optimizer'

/** Slots válidos para imágenes de proyecto — máximo 4 fotos */
const VALID_SLOTS = ['general', 'antes', 'durante', 'despues'] as const

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const slot = formData.get('slot') as string
        const proyectoId = formData.get('proyectoId') as string

        if (!file || !slot || !proyectoId || !VALID_SLOTS.includes(slot as any)) {
            return NextResponse.json(
                { error: `Faltan datos o slot inválido. Slots permitidos: ${VALID_SLOTS.join(', ')}` },
                { status: 400 }
            )
        }

        const supabase = createSupabaseAdmin()

        // Optimizar imagen: redimensionar a max 1920px y convertir a WebP 80%
        const optimizedBuffer = await optimizeImage(file)
        const fileName = `${slot}_${uuidv4()}.webp`
        const folderPath = `${proyectoId}/${fileName}`
        const bucketName = 'proyectos-imagenes'

        // 1. Subir a Storage
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(folderPath, optimizedBuffer, {
                contentType: 'image/webp',
                upsert: true,
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({ error: 'Error subiendo archivo' }, { status: 500 })
        }

        // 2. Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(folderPath)

        // 3. Obtener el proyecto actual para no sobrescribir el resto del JSON
        const { data: proyecto, error: fetchError } = await (supabase.from('proyectos') as any)
            .select('imagenes_estructuradas')
            .eq('id', proyectoId)
            .single()

        if (fetchError) {
            console.error('Fetch error:', fetchError)
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
        }

        // 4. Actualizar el JSON
        const imagenesActuales = proyecto.imagenes_estructuradas || {}
        const nuevasImagenes = {
            ...imagenesActuales,
            [slot]: publicUrl
        }

        const { error: updateError } = await (supabase.from('proyectos') as any)
            .update({ imagenes_estructuradas: nuevasImagenes })
            .eq('id', proyectoId)

        if (updateError) {
            console.error('Update error:', updateError)
            return NextResponse.json({ error: 'Error actualizando registro principal' }, { status: 500 })
        }

        return NextResponse.json({ success: true, url: publicUrl, slot })

    } catch (error) {
        console.error('Server error upload-slot:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
