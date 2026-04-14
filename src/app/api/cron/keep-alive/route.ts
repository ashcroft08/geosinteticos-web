import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'

/**
 * GET /api/cron/keep-alive
 * Realiza una consulta mínima a Supabase para evitar la suspensión automática.
 * Requiere el header Authorization con el CRON_SECRET.
 */
export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    
    // Evitar ejecución si no hay secreto configurado (seguridad inicial)
    if (!process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'CRON_SECRET no configurado' }, { status: 500 })
    }

    // Validar token de seguridad
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('No autorizado', { status: 401 })
    }

    try {
        const supabase = createSupabaseAdmin()
        
        // Operación mínima para mantener activa la DB: leer una categoría
        const { error } = await supabase
            .from('categorias')
            .select('id')
            .limit(1)

        if (error) throw error

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            message: 'Keep-alive ejecutado correctamente — Supabase está activa'
        })
    } catch (error: any) {
        console.error('❌ Error en keep-alive:', error)
        return NextResponse.json({ 
            error: 'Fallo al contactar con la base de datos',
            details: error.message 
        }, { status: 500 })
    }
}
