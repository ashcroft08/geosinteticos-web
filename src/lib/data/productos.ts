import { createSupabaseServer } from '@/lib/supabase/server'
import { PRODUCTOS_ESTATICOS } from '@/lib/static-data'
import type { Especificacion, Categoria } from '@/lib/supabase/types'

export interface ProductoPublico {
    id: string
    nombre: string
    slug: string
    categoria_nombre: string
    subcategoria_nombre: string
    descripcion_corta: string
    descripcion_detallada: string
    imagenes: { url_publica: string; alt: string | null; es_principal: boolean }[]
    especificaciones: Especificacion[]
    aplicaciones: string[]
    certificaciones: string[]
    disponible: boolean
    destacado: boolean
}

/** Obtiene todos los productos disponibles desde Supabase, con fallback estático */
export async function fetchProductos(): Promise<ProductoPublico[]> {
    try {
        const supabase = createSupabaseServer()
        const { data, error } = await (supabase.from('productos') as any)
            .select('*, producto_imagenes(url_publica, alt, es_principal), categorias(nombre), subcategorias(nombre)')
            .eq('disponible', true)
            .order('orden')

        if (error || !data || data.length === 0) throw new Error(error?.message || 'Sin datos')

        return (data as any[]).map((p: Record<string, unknown>) => ({
            id: String(p.id),
            nombre: String(p.nombre),
            slug: String(p.slug),
            categoria_nombre: (p.categorias as { nombre: string } | null)?.nombre || '',
            subcategoria_nombre: (p.subcategorias as { nombre: string } | null)?.nombre || '',
            descripcion_corta: String(p.descripcion_corta || ''),
            descripcion_detallada: String(p.descripcion_detallada || ''),
            imagenes: Array.isArray(p.producto_imagenes) ? p.producto_imagenes : [],
            especificaciones: Array.isArray(p.especificaciones) ? p.especificaciones : [],
            aplicaciones: Array.isArray(p.aplicaciones) ? p.aplicaciones : [],
            certificaciones: Array.isArray(p.certificaciones) ? p.certificaciones : [],
            disponible: Boolean(p.disponible),
            destacado: Boolean(p.destacado),
        }))
    } catch {
        // Fallback a datos estáticos
        return PRODUCTOS_ESTATICOS.map(p => ({
            ...p,
            imagenes: p.imagenes.map(img => ({ ...img, alt: img.alt as string | null })),
            destacado: false,
        }))
    }
}

/** Obtiene un producto por slug desde Supabase, con fallback estático */
export async function fetchProductoBySlug(slug: string): Promise<ProductoPublico | null> {
    try {
        const supabase = createSupabaseServer()
        const { data, error } = await (supabase.from('productos') as any)
            .select('*, producto_imagenes(url_publica, alt, es_principal, orden), categorias(nombre), subcategorias(nombre)')
            .eq('slug', slug)
            .single()

        if (error || !data) throw new Error(error?.message || 'No encontrado')

        const p = data as unknown as Record<string, unknown>
        return {
            id: String(p.id),
            nombre: String(p.nombre),
            slug: String(p.slug),
            categoria_nombre: (p.categorias as { nombre: string } | null)?.nombre || '',
            subcategoria_nombre: (p.subcategorias as { nombre: string } | null)?.nombre || '',
            descripcion_corta: String(p.descripcion_corta || ''),
            descripcion_detallada: String(p.descripcion_detallada || ''),
            imagenes: Array.isArray(p.producto_imagenes) ? p.producto_imagenes : [],
            especificaciones: Array.isArray(p.especificaciones) ? p.especificaciones : [],
            aplicaciones: Array.isArray(p.aplicaciones) ? p.aplicaciones : [],
            certificaciones: Array.isArray(p.certificaciones) ? p.certificaciones : [],
            disponible: Boolean(p.disponible),
            destacado: Boolean(p.destacado),
        }
    } catch {
        const staticProduct = PRODUCTOS_ESTATICOS.find(p => p.slug === slug)
        if (!staticProduct) return null
        return {
            ...staticProduct,
            imagenes: staticProduct.imagenes.map(img => ({ ...img, alt: img.alt as string | null })),
            destacado: false,
        }
    }
}
/** Obtiene una categoría por slug */
export async function fetchCategoryBySlug(slug: string): Promise<Categoria | null> {
    try {
        const supabase = createSupabaseServer()
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .eq('slug', slug)
            .single()

        if (error || !data) return null
        return data as Categoria
    } catch {
        return null
    }
}

/** Obtiene productos por slug de categoría */
export async function fetchProductosPorCategoriaSlug(slug: string): Promise<ProductoPublico[]> {
    try {
        const supabase = createSupabaseServer()
        // Primero obtenemos el ID de la categoría por slug
        const categoria = await fetchCategoryBySlug(slug)
        if (!categoria) return []

        const { data, error } = await (supabase.from('productos') as any)
            .select('*, producto_imagenes(url_publica, alt, es_principal), categorias(nombre), subcategorias(nombre)')
            .eq('categoria_id', categoria.id)
            .eq('disponible', true)
            .order('orden')

        if (error || !data) return []

        return (data as any[]).map((p: Record<string, unknown>) => ({
            id: String(p.id),
            nombre: String(p.nombre),
            slug: String(p.slug),
            categoria_nombre: (p.categorias as { nombre: string } | null)?.nombre || '',
            subcategoria_nombre: (p.subcategorias as { nombre: string } | null)?.nombre || '',
            descripcion_corta: String(p.descripcion_corta || ''),
            descripcion_detallada: String(p.descripcion_detallada || ''),
            imagenes: Array.isArray(p.producto_imagenes) ? p.producto_imagenes : [],
            especificaciones: Array.isArray(p.especificaciones) ? p.especificaciones : [],
            aplicaciones: Array.isArray(p.aplicaciones) ? p.aplicaciones : [],
            certificaciones: Array.isArray(p.certificaciones) ? p.certificaciones : [],
            disponible: Boolean(p.disponible),
            destacado: Boolean(p.destacado),
        }))
    } catch {
        return []
    }
}

/** Obtiene todas las categorías activas */
export async function fetchCategorias(): Promise<Categoria[]> {
    try {
        const supabase = createSupabaseServer()
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .eq('activa', true)
            .order('orden')

        if (error || !data) return []
        return data as Categoria[]
    } catch {
        return []
    }
}
