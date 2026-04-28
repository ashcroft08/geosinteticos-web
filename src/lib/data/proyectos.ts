import { createSupabaseServer } from '@/lib/supabase/server'
import { PROYECTOS_ESTATICOS } from '@/lib/static-data'
import type { Metrica } from '@/lib/supabase/types'

export interface ProyectoPublico {
    id: string
    titulo: string
    slug: string
    cliente: string
    ciudad: string
    region: string
    tipo_obra: string
    fecha: string
    reto: string
    solucion: string
    metricas: Metrica[]
    imagenes_estructuradas: Record<string, string | null>
    destacado: boolean
    publicado: boolean
}

/** Obtiene todos los proyectos publicados desde Supabase, con fallback estático */
export async function fetchProyectos(): Promise<ProyectoPublico[]> {
    try {
        const supabase = createSupabaseServer()
        const { data, error } = await (supabase.from('proyectos') as any)
            .select('*')
            .eq('publicado', true)
            .order('orden')

        if (error || !data || data.length === 0) throw new Error(error?.message || 'Sin datos')

        return (data as any[]).map((p: Record<string, unknown>) => ({
            id: String(p.id),
            titulo: String(p.titulo),
            slug: String(p.slug),
            cliente: String(p.cliente || ''),
            ciudad: String(p.ciudad || ''),
            region: String(p.region || ''),
            tipo_obra: String(p.tipo_obra || ''),
            fecha: String(p.fecha || ''),
            reto: String(p.reto || ''),
            solucion: String(p.solucion || ''),
            metricas: Array.isArray(p.metricas) ? p.metricas : [],
            imagenes_estructuradas: (p.imagenes_estructuradas as Record<string, string | null>) || {
                general: null, antes: null, durante: null, despues: null
            },
            destacado: Boolean(p.destacado),
            publicado: Boolean(p.publicado),
        }))
    } catch {
        return PROYECTOS_ESTATICOS.map(p => ({
            ...p,
            imagenes_estructuradas: {
                general: p.imagenes[0]?.url_publica || null,
                antes: null, durante: null, despues: null
            },
            publicado: true,
        }))
    }
}

/** Obtiene un proyecto por slug, con fallback estático */
export async function fetchProyectoBySlug(slug: string): Promise<ProyectoPublico | null> {
    try {
        const supabase = createSupabaseServer()
        const { data, error } = await (supabase.from('proyectos') as any)
            .select('*')
            .eq('slug', slug)
            .single()

        if (error || !data) throw new Error(error?.message || 'No encontrado')

        const p = data as unknown as Record<string, unknown>
        return {
            id: String(p.id),
            titulo: String(p.titulo),
            slug: String(p.slug),
            cliente: String(p.cliente || ''),
            ciudad: String(p.ciudad || ''),
            region: String(p.region || ''),
            tipo_obra: String(p.tipo_obra || ''),
            fecha: String(p.fecha || ''),
            reto: String(p.reto || ''),
            solucion: String(p.solucion || ''),
            metricas: Array.isArray(p.metricas) ? p.metricas : [],
            imagenes_estructuradas: (p.imagenes_estructuradas as Record<string, string | null>) || {
                general: null, antes: null, durante: null, despues: null
            },
            destacado: Boolean(p.destacado),
            publicado: Boolean(p.publicado),
        }
    } catch {
        const staticProject = PROYECTOS_ESTATICOS.find(p => p.slug === slug)
        if (!staticProject) return null
        return {
            ...staticProject,
            imagenes_estructuradas: {
                general: staticProject.imagenes[0]?.url_publica || null,
                antes: null, durante: null, despues: null
            },
            publicado: true,
        }
    }
}
