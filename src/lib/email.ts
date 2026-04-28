
import nodemailer from 'nodemailer'
import { fetchConfigValue } from './data/configuracion'

interface EmailData {
    to: string[]
    subject: string
    html: string
    attachments?: { filename: string; content: string | Buffer; contentType?: string }[]
}

export async function sendEmail({ to, subject, html, attachments }: EmailData) {
    // Si no hay destinatarios, no enviar
    if (!to || to.length === 0) {
        console.warn('⚠️ No hay destinatarios para el correo')
        return
    }

    // Configurar transporte SMTP
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    // Si no hay credenciales, solo loguear (modo dev/demo sin configuración)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ SMTP_USER o SMTP_PASS no configurados. Simulación de envío:', { to, subject })
        return
    }

    try {
        const info = await transporter.sendMail({
            from: `"GeoSintéticos Web" <${process.env.SMTP_USER}>`,
            to: to.join(', '),
            subject,
            html,
            attachments,
        })
        console.log('✅ Correo enviado:', info.messageId)
        return info
    } catch (error) {
        console.error('❌ Error enviando correo:', error)
        throw error
    }
}

/** Obtiene los emails de notificación desde la configuración del sitio */
export async function fetchNotificationEmails(): Promise<string[]> {
    // Intentar obtener de configuración
    const raw = await fetchConfigValue('email_notificaciones', '')

    if (raw) {
        // Separar por comas o punto y coma
        return raw.split(/[,;]/).map(e => e.trim()).filter(e => e.includes('@'))
    }

    // Fallback inicial a los correos solicitados por el usuario
    return ['alexis298930@gmail.com', 'daniela92medina@hotmail.com']
}
