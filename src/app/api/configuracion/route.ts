import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'

/**
 * PUT /api/configuracion
 * Actualiza un valor de configuracion_sitio usando service_role (bypasea RLS).
 */
export async function PUT(request: NextRequest) {
    try {
        const { clave, valor } = await request.json()

        if (!clave) {
            return NextResponse.json({ error: 'Falta la clave' }, { status: 400 })
        }

        const supabase = createSupabaseAdmin()

        const { error } = await (supabase.from('configuracion_sitio') as any)
            .update({ valor, updated_at: new Date().toISOString() })
            .eq('clave', clave)

        if (error) {
            console.error('Error al actualizar configuración:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Error en API /configuracion:', err)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
