import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/server'
import { sendEmail, fetchNotificationEmails } from '@/lib/email'

/**
 * GET /api/cron/backup-catalogo
 *
 * Extrae toda la información del catálogo (productos, proyectos, categorías,
 * subcategorías y configuración) y lo envía como un archivo JSON adjunto por
 * correo electrónico al administrador.
 *
 * Ejecución programada vía Vercel Cron.
 * Requiere el header Authorization con el CRON_SECRET en producción.
 */
export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization')

    // Validar en producción (en local se puede saltar si no hay secreto configurado)
    if (process.env.NODE_ENV === 'production') {
        if (!process.env.CRON_SECRET) {
            return NextResponse.json({ error: 'CRON_SECRET no configurado' }, { status: 500 })
        }
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('No autorizado', { status: 401 })
        }
    }

    try {
        const supabase = createSupabaseAdmin()

        // Obtener todos los datos en paralelo
        const [
            { data: productos },
            { data: categorias },
            { data: subcategorias },
            { data: proyectos },
            { data: configuracion }
        ] = await Promise.all([
            supabase.from('productos').select('*'),
            supabase.from('categorias').select('*'),
            supabase.from('subcategorias').select('*'),
            supabase.from('proyectos').select('*'),
            supabase.from('configuracion_sitio').select('*')
        ])

        const backupData = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            data: {
                productos: productos || [],
                categorias: categorias || [],
                subcategorias: subcategorias || [],
                proyectos: proyectos || [],
                configuracion_sitio: configuracion || []
            }
        }

        const jsonString = JSON.stringify(backupData, null, 2)
        const dateStr = new Date().toISOString().split('T')[0]
        const filename = `backup_geosinteticos_${dateStr}.json`

        // Obtener correos de notificación
        const emails = await fetchNotificationEmails()

        // Enviar por correo con adjunto
        await sendEmail({
            to: emails,
            subject: `📦 Respaldo de Catálogo GeoSintéticos - ${dateStr}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Respaldo Semanal Automático</h2>
                    <p>Adjunto encontrarás el respaldo de la base de datos generado el <strong>${new Date().toLocaleString('es-EC')}</strong>.</p>
                    <ul>
                        <li>Productos: ${backupData.data.productos.length}</li>
                        <li>Proyectos: ${backupData.data.proyectos.length}</li>
                        <li>Categorías: ${backupData.data.categorias.length}</li>
                        <li>Subcategorías: ${backupData.data.subcategorias.length}</li>
                    </ul>
                    <p style="color: #666; font-size: 12px; mt-4">Este mensaje es generado automáticamente por el sistema.</p>
                </div>
            `,
            attachments: [
                {
                    filename,
                    content: jsonString,
                    contentType: 'application/json'
                }
            ]
        })

        return NextResponse.json({
            success: true,
            message: 'Respaldo generado y enviado por correo exitosamente',
            timestamp: backupData.timestamp,
            stats: {
                productos: backupData.data.productos.length,
                proyectos: backupData.data.proyectos.length,
            }
        })
    } catch (error: any) {
        console.error('❌ Error generando respaldo:', error)
        return NextResponse.json({
            error: 'Fallo al generar el respaldo',
            details: error.message
        }, { status: 500 })
    }
}
