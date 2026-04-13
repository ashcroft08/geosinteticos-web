import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const tipo = formData.get('tipo') as string // 'producto' | 'proyecto'
        const id = formData.get('id') as string

        if (!file || !tipo || !id) {
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
        }

        const supabase = createSupabaseAdmin()
        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`

        // Determinar bucket y carpeta según tipo
        let bucketName = ''
        let folderPath = ''
        let tableName = ''
        let foreignKey = ''

        if (tipo === 'producto') {
            bucketName = 'productos-imagenes'
            folderPath = `${id}/${fileName}`
            tableName = 'producto_imagenes'
            foreignKey = 'producto_id'
        } else if (tipo === 'proyecto') {
            bucketName = 'proyectos-imagenes'
            folderPath = `${id}/${fileName}`
            tableName = 'proyecto_imagenes'
            foreignKey = 'proyecto_id'
        } else {
            return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
        }

        // 1. Subir archivo a Storage
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(folderPath, file)

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({ error: uploadError.message }, { status: 500 })
        }

        // 2. Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(folderPath)

        // 3. Insertar referencia en base de datos
        // producto_imagenes tiene es_principal; proyecto_imagenes tiene tipo
        const insertData: Record<string, unknown> = {
            [foreignKey]: id,
            storage_path: folderPath,
            url_publica: publicUrl,
            orden: 0,
        }

        if (tipo === 'producto') {
            insertData.es_principal = false
        } else {
            insertData.tipo = 'general'
        }

        const { error: dbError } = await supabase
            .from(tableName as any)
            .insert(insertData as any)

        if (dbError) {
            console.error('DB error:', dbError)
            // Intentar borrar la imagen subida si falla la DB (limpieza)
            await supabase.storage.from(bucketName).remove([folderPath])
            return NextResponse.json({ error: dbError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, url: publicUrl })

    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
