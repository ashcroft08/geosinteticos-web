import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'

/**
 * POST /api/page-views
 * Registra una vista de página. Llamado desde el componente PageViewTracker.
 *
 * Body esperado:
 * - slug_pagina: string — slug de la página visitada
 * - tipo_pagina: 'producto' | 'proyecto' | 'pagina'
 * - dispositivo: 'desktop' | 'mobile' | 'tablet'
 * - referrer?: string
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const { slug_pagina, tipo_pagina, dispositivo, referrer } = body

        if (!slug_pagina || !tipo_pagina) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
        }

        const validTipos = ['producto', 'proyecto', 'pagina']
        const validDispositivos = ['desktop', 'mobile', 'tablet']

        const supabase = createSupabaseAdmin()

        const { error } = await (supabase.from('page_views') as any).insert({
            slug_pagina,
            tipo_pagina: validTipos.includes(tipo_pagina) ? tipo_pagina : 'pagina',
            dispositivo: validDispositivos.includes(dispositivo) ? dispositivo : 'desktop',
            referrer: referrer || null,
        })

        if (error) {
            console.error('Error registrando page view:', error)
            return NextResponse.json({ error: 'Error al registrar vista' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

/**
 * GET /api/page-views?periodo=semana
 * Devuelve métricas de visitas para el dashboard admin.
 *
 * Respuesta:
 * - totalSemana: número total de visitas en los últimos 7 días
 * - totalHoy: visitas de hoy
 * - topProductos: los 3 productos más vistos de la semana
 * - visitasPorDia: array con visitas agrupadas por día (últimos 7 días)
 */
export async function GET() {
    try {
        const supabase = createSupabaseAdmin()

        const ahora = new Date()
        const haceUnaSemana = new Date(ahora)
        haceUnaSemana.setDate(haceUnaSemana.getDate() - 7)

        const inicioHoy = new Date(ahora)
        inicioHoy.setHours(0, 0, 0, 0)

        // 1. Total visitas de la semana
        const { count: totalSemana } = await (supabase.from('page_views') as any)
            .select('id', { count: 'exact', head: true })
            .gte('created_at', haceUnaSemana.toISOString())

        // 2. Total visitas de hoy
        const { count: totalHoy } = await (supabase.from('page_views') as any)
            .select('id', { count: 'exact', head: true })
            .gte('created_at', inicioHoy.toISOString())

        // 3. Top 3 productos más vistos de la semana
        const { data: productViews } = await (supabase.from('page_views') as any)
            .select('slug_pagina')
            .eq('tipo_pagina', 'producto')
            .gte('created_at', haceUnaSemana.toISOString())

        const productCounts: Record<string, number> = {}
        for (const row of (productViews || [])) {
            const slug = row.slug_pagina
            productCounts[slug] = (productCounts[slug] || 0) + 1
        }

        // Buscar nombres de los productos por slug
        const topSlugs = Object.entries(productCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)

        const topProductos: Array<{ slug: string; nombre: string; vistas: number }> = []

        for (const [slug, vistas] of topSlugs) {
            const { data: producto } = await (supabase.from('productos') as any)
                .select('nombre')
                .eq('slug', slug)
                .single()

            topProductos.push({
                slug,
                nombre: producto?.nombre || slug,
                vistas,
            })
        }

        // 4. Visitas por día (últimos 7 días)
        const { data: weekViews } = await (supabase.from('page_views') as any)
            .select('created_at')
            .gte('created_at', haceUnaSemana.toISOString())
            .order('created_at', { ascending: true })

        const visitasPorDia: Record<string, number> = {}
        for (let i = 6; i >= 0; i--) {
            const fecha = new Date(ahora)
            fecha.setDate(fecha.getDate() - i)
            const key = fecha.toISOString().split('T')[0]
            visitasPorDia[key] = 0
        }
        for (const row of (weekViews || [])) {
            const key = new Date(row.created_at).toISOString().split('T')[0]
            if (visitasPorDia[key] !== undefined) {
                visitasPorDia[key]++
            }
        }

        return NextResponse.json({
            totalSemana: totalSemana || 0,
            totalHoy: totalHoy || 0,
            topProductos,
            visitasPorDia: Object.entries(visitasPorDia).map(([fecha, count]) => ({
                fecha,
                visitas: count,
            })),
        })
    } catch (error) {
        console.error('Error en GET /api/page-views:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
