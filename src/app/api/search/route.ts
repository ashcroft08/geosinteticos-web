import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'

/**
 * GET /api/search?q=geomembrana
 *
 * Busca productos y proyectos por palabras clave.
 * Retorna un máximo de 5 resultados por tipo.
 */
export async function GET(request: NextRequest) {
    try {
        const query = request.nextUrl.searchParams.get('q')?.trim()

        if (!query || query.length < 2) {
            return NextResponse.json({ productos: [], proyectos: [] })
        }

        const supabase = createSupabaseAdmin()
        const searchPattern = `%${query}%`

        // Buscar productos y proyectos en paralelo
        const [productosRes, proyectosRes] = await Promise.all([
            (supabase.from('productos') as any)
                .select('slug, nombre, descripcion_corta, producto_imagenes(url_publica, es_principal)')
                .eq('disponible', true)
                .or(`nombre.ilike.${searchPattern},descripcion_corta.ilike.${searchPattern}`)
                .order('orden')
                .limit(5),

            (supabase.from('proyectos') as any)
                .select('slug, titulo, tipo_obra, ciudad, region, imagenes_estructuradas')
                .eq('publicado', true)
                .or(`titulo.ilike.${searchPattern},tipo_obra.ilike.${searchPattern},ciudad.ilike.${searchPattern}`)
                .order('orden')
                .limit(5),
        ])

        const productos = ((productosRes.data || []) as any[]).map((p: any) => {
            const imagenes = Array.isArray(p.producto_imagenes) ? p.producto_imagenes : []
            const principal = imagenes.find((i: any) => i.es_principal)
            return {
                slug: p.slug,
                nombre: p.nombre,
                descripcion: p.descripcion_corta || '',
                imagen: principal?.url_publica || imagenes[0]?.url_publica || null,
            }
        })

        const proyectos = ((proyectosRes.data || []) as any[]).map((p: any) => ({
            slug: p.slug,
            titulo: p.titulo,
            tipo_obra: p.tipo_obra || '',
            ubicacion: [p.ciudad, p.region].filter(Boolean).join(', '),
            imagen: p.imagenes_estructuradas?.general || null,
        }))

        return NextResponse.json({ productos, proyectos })
    } catch (error) {
        console.error('Error en búsqueda:', error)
        return NextResponse.json({ productos: [], proyectos: [] })
    }
}
