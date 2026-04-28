/**
 * Utilidad para enviar notificaciones al WhatsApp del administrador
 * cuando se recibe un nuevo lead desde el formulario de contacto.
 *
 * Usa la API de WhatsApp Business (wa.me) mediante la API de CallMeBot
 * o simplemente construye la URL para envío directo.
 *
 * Estrategia: Se usa la API gratuita de CallMeBot para envío automático.
 * Si no está configurada (sin CALLMEBOT_API_KEY), se loguea el mensaje.
 *
 * Alternativa: Si prefieres usar Twilio u otro servicio, reemplaza
 * el cuerpo de `sendWhatsAppNotification` sin cambiar la interfaz.
 */

interface LeadNotification {
    nombre: string
    empresa: string | null
    email: string
    telefono: string
    tipo_proyecto: string | null
    producto_nombre: string | null
    mensaje: string | null
}

/**
 * Construye el texto del mensaje de WhatsApp con los datos del lead.
 */
function buildWhatsAppMessage(lead: LeadNotification): string {
    const lines = [
        '🔔 *NUEVO LEAD RECIBIDO*',
        '━━━━━━━━━━━━━━━━',
        '',
        `👤 *Nombre:* ${lead.nombre}`,
        `🏢 *Empresa:* ${lead.empresa || '—'}`,
        `📧 *Email:* ${lead.email}`,
        `📱 *Teléfono:* ${lead.telefono}`,
        '',
    ]

    if (lead.tipo_proyecto) {
        lines.push(`🏗️ *Tipo de Proyecto:* ${lead.tipo_proyecto}`)
    }
    if (lead.producto_nombre) {
        lines.push(`📦 *Producto:* ${lead.producto_nombre}`)
    }
    if (lead.mensaje) {
        lines.push('', `💬 *Mensaje:*`, lead.mensaje)
    }

    lines.push('', '━━━━━━━━━━━━━━━━', '📋 _Ficha generada desde geosinteticos.com.ec_')

    return lines.join('\n')
}

/**
 * Envía una notificación de WhatsApp al administrador con los datos del lead.
 *
 * Usa la API de CallMeBot si está configurada, sino loguea el mensaje.
 * Para configurar CallMeBot:
 * 1. Envía "I allow callmebot to send me messages" al +34 644 31 89 60 por WhatsApp
 * 2. Recibirás una API key
 * 3. Configura WHATSAPP_ADMIN_NUMBER y CALLMEBOT_API_KEY en .env.local
 */
export async function sendWhatsAppNotification(lead: LeadNotification): Promise<void> {
    const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER
    const apiKey = process.env.CALLMEBOT_API_KEY

    const message = buildWhatsAppMessage(lead)

    if (!adminNumber) {
        console.warn('⚠️ WHATSAPP_ADMIN_NUMBER no configurado — Notificación WhatsApp omitida')
        console.log('📱 [SIMULACIÓN] Mensaje que se enviaría:', message)
        return
    }

    if (!apiKey) {
        console.warn('⚠️ CALLMEBOT_API_KEY no configurado — Notificación WhatsApp omitida')
        console.log('📱 [SIMULACIÓN] Mensaje para', adminNumber, ':', message)
        return
    }

    try {
        // Llamada a la API de CallMeBot (gratuita, sin necesidad de WhatsApp Business API)
        const encodedMessage = encodeURIComponent(message)
        const url = `https://api.callmebot.com/whatsapp.php?phone=${adminNumber}&text=${encodedMessage}&apikey=${apiKey}`

        const response = await fetch(url)

        if (response.ok) {
            console.log('✅ Notificación WhatsApp enviada al admin:', adminNumber)
        } else {
            const text = await response.text()
            console.error('❌ Error en CallMeBot:', response.status, text)
        }
    } catch (error) {
        console.error('❌ Error enviando notificación WhatsApp:', error)
        // No propagar — la notificación es secondary, no debe romper el flujo
    }
}
