import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { leadSchema } from '@/lib/validations/lead.schema'

/**
 * POST /api/leads
 * Recibe datos del formulario de contacto/cotización,
 * los valida con Zod y los guarda en Supabase.
 *
 * Cuando Supabase no esté configurado, retorna éxito simulado.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validar con Zod
        const parsed = leadSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        // Si Supabase está configurado, guardar en la DB
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (
            supabaseUrl &&
            serviceKey &&
            !supabaseUrl.includes('placeholder') &&
            !serviceKey.includes('placeholder')
        ) {
            const supabase = createClient(supabaseUrl, serviceKey)

            const { error } = await supabase.from('leads').insert({
                nombre: parsed.data.nombre,
                empresa: parsed.data.empresa || null,
                email: parsed.data.email,
                telefono: parsed.data.telefono,
                tipo_proyecto: parsed.data.tipo_proyecto || null,
                producto_nombre: parsed.data.producto_nombre || null,
                mensaje: parsed.data.mensaje || null,
                acepto_politica: parsed.data.acepto_politica,
                canal: parsed.data.canal,
                estado: 'nuevo',
            })

            if (error) {
                console.error('Error Supabase:', error)
                return NextResponse.json({ error: 'Error al guardar el lead' }, { status: 500 })
            }

            // Enviar notificación por correo
            try {
                // Importación dinámica para evitar ciclos si fuera el caso, o simple import arriba
                const { sendEmail, fetchNotificationEmails } = await import('@/lib/email')
                const emails = await fetchNotificationEmails()

                await sendEmail({
                    to: emails,
                    subject: `Nuevo Lead: ${parsed.data.nombre} - ${parsed.data.empresa || 'Particular'}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                            <div style="background-color: #0f766e; padding: 20px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 24px;">Nuevo Lead Recibido</h1>
                            </div>
                            <div style="padding: 20px;">
                                <p style="margin-bottom: 20px; font-size: 16px;">Has recibido una nueva solicitud desde el formulario web de GeoSintéticos:</p>
                                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Nombre:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #0f766e; font-weight: bold;">${parsed.data.nombre}</td></tr>
                                    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Teléfono:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #0f766e; font-weight: bold;">${parsed.data.telefono}</td></tr>
                                    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${parsed.data.email}</td></tr>
                                    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Empresa:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${parsed.data.empresa || '-'}</td></tr>
                                    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Interés:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${parsed.data.tipo_proyecto || parsed.data.producto_nombre || '-'}</td></tr>
                                </table>
                                <div style="margin-top: 25px; background-color: #f3f4f6; padding: 15px; border-left: 4px solid #0f766e; border-radius: 4px;">
                                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Mensaje del cliente:</p>
                                    <p style="margin: 0; font-size: 16px; line-height: 1.5;">${parsed.data.mensaje || '<em>Sin mensaje adjunto</em>'}</p>
                                </div>
                            </div>
                        </div>
                    `
                })
            } catch (mailError) {
                console.error('Error enviando notificación:', mailError)
                // No fallar el request si falla el correo, pero loguearlo
            }

        } else {
            // Modo demo — sin Supabase
            console.log('📩 [DEMO] Lead recibido:', parsed.data)
        }

        return NextResponse.json({ success: true, message: 'Lead recibido correctamente' })
    } catch (err) {
        console.error('Error en API /leads:', err)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
