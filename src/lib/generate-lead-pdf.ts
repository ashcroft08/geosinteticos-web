/**
 * Genera una "Ficha de Cotización" en PDF para un lead.
 *
 * Usa jsPDF para generación 100% en el cliente — sin viaje al servidor.
 * Incluye el logo de la empresa, datos del cliente y un footer corporativo.
 */

import { jsPDF } from 'jspdf'

interface LeadData {
    id: string
    nombre: string
    empresa: string | null
    email: string
    telefono: string
    tipo_proyecto: string | null
    producto_nombre: string | null
    mensaje: string | null
    canal: string
    estado: string
    notas_internas: string | null
    created_at: string
}

/** Colores corporativos */
const COLORS = {
    primary: [15, 23, 42] as [number, number, number],        // #0F172A — slate-900
    accent: [20, 184, 166] as [number, number, number],       // #14B8A6 — teal-500
    text: [51, 65, 85] as [number, number, number],           // #334155 — slate-700
    muted: [148, 163, 184] as [number, number, number],       // #94A3B8 — slate-400
    border: [226, 232, 240] as [number, number, number],      // #E2E8F0 — slate-200
    bgLight: [248, 250, 252] as [number, number, number],     // #F8FAFC — slate-50
    white: [255, 255, 255] as [number, number, number],
}

/**
 * Convierte la imagen del logo en una Data URL base64 para incrustarla en el PDF.
 * Usa un canvas temporal para renderizar la imagen.
 */
async function loadLogoAsBase64(): Promise<string | null> {
    try {
        const response = await fetch('/Logo.png')
        const blob = await response.blob()

        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = () => resolve(null)
            reader.readAsDataURL(blob)
        })
    } catch {
        return null
    }
}

/**
 * Genera y descarga el PDF de la Ficha de Cotización para un lead.
 */
export async function generateLeadPDF(lead: LeadData): Promise<void> {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = 210
    const marginLeft = 20
    const marginRight = 20
    const contentWidth = pageWidth - marginLeft - marginRight
    let y = 20

    // ── Cargar logo ──
    const logoBase64 = await loadLogoAsBase64()

    // ══════════════════════════════════════════════════
    // HEADER — Barra con logo y título
    // ══════════════════════════════════════════════════

    // Fondo del header
    doc.setFillColor(...COLORS.primary)
    doc.roundedRect(marginLeft, y, contentWidth, 32, 3, 3, 'F')

    // Logo
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', marginLeft + 6, y + 4, 24, 24)
    }

    // Título
    doc.setTextColor(...COLORS.white)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Ficha de Cotización', logoBase64 ? marginLeft + 36 : marginLeft + 10, y + 15)

    // Subtítulo
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('G&G | Geosintéticos y Geomembranas', logoBase64 ? marginLeft + 36 : marginLeft + 10, y + 22)

    y += 40

    // ══════════════════════════════════════════════════
    // META INFO — Número de ficha y fecha
    // ══════════════════════════════════════════════════

    doc.setFillColor(...COLORS.bgLight)
    doc.roundedRect(marginLeft, y, contentWidth, 14, 2, 2, 'F')
    doc.setDrawColor(...COLORS.border)
    doc.roundedRect(marginLeft, y, contentWidth, 14, 2, 2, 'S')

    doc.setTextColor(...COLORS.muted)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(`N° de Ficha: ${lead.id.slice(0, 8).toUpperCase()}`, marginLeft + 5, y + 6)

    const fecha = new Date(lead.created_at).toLocaleDateString('es-PE', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
    doc.text(`Fecha: ${fecha}`, marginLeft + 5, y + 11)

    const estadoTexto = lead.estado.charAt(0).toUpperCase() + lead.estado.slice(1)
    doc.text(`Estado: ${estadoTexto}`, pageWidth - marginRight - 50, y + 6)
    doc.text(`Canal: ${lead.canal}`, pageWidth - marginRight - 50, y + 11)

    y += 22

    // ══════════════════════════════════════════════════
    // DATOS DEL CLIENTE
    // ══════════════════════════════════════════════════

    // Título de sección
    doc.setFillColor(...COLORS.accent)
    doc.rect(marginLeft, y, 4, 8, 'F')
    doc.setTextColor(...COLORS.primary)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Datos del Cliente', marginLeft + 8, y + 6)
    y += 14

    // Tabla de datos
    const clienteData = [
        ['Nombre', lead.nombre],
        ['Empresa', lead.empresa || '—'],
        ['Email', lead.email],
        ['Teléfono', lead.telefono],
        ['Tipo de Proyecto', lead.tipo_proyecto || '—'],
        ['Producto de Interés', lead.producto_nombre || '—'],
    ]

    clienteData.forEach(([label, value], index) => {
        const isEven = index % 2 === 0
        if (isEven) {
            doc.setFillColor(...COLORS.bgLight)
            doc.rect(marginLeft, y - 1, contentWidth, 9, 'F')
        }

        doc.setTextColor(...COLORS.muted)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(label, marginLeft + 5, y + 5)

        doc.setTextColor(...COLORS.text)
        doc.setFont('helvetica', 'bold')
        doc.text(value, marginLeft + 60, y + 5)

        y += 9
    })

    y += 8

    // ══════════════════════════════════════════════════
    // MENSAJE DEL CLIENTE
    // ══════════════════════════════════════════════════

    if (lead.mensaje) {
        doc.setFillColor(...COLORS.accent)
        doc.rect(marginLeft, y, 4, 8, 'F')
        doc.setTextColor(...COLORS.primary)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Mensaje del Cliente', marginLeft + 8, y + 6)
        y += 14

        // Caja de mensaje
        doc.setFillColor(...COLORS.bgLight)
        doc.setDrawColor(...COLORS.border)

        const mensajeLines = doc.splitTextToSize(lead.mensaje, contentWidth - 14)
        const boxHeight = Math.max(mensajeLines.length * 5 + 10, 20)
        doc.roundedRect(marginLeft, y, contentWidth, boxHeight, 2, 2, 'FD')

        doc.setTextColor(...COLORS.text)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(mensajeLines, marginLeft + 7, y + 7)

        y += boxHeight + 8
    }

    // ══════════════════════════════════════════════════
    // NOTAS INTERNAS (si las hay)
    // ══════════════════════════════════════════════════

    if (lead.notas_internas) {
        doc.setFillColor(...COLORS.accent)
        doc.rect(marginLeft, y, 4, 8, 'F')
        doc.setTextColor(...COLORS.primary)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Notas Internas', marginLeft + 8, y + 6)
        y += 14

        const notasLines = doc.splitTextToSize(lead.notas_internas, contentWidth - 14)
        const notasBoxHeight = Math.max(notasLines.length * 5 + 10, 16)

        doc.setFillColor(255, 251, 235) // amber-50
        doc.setDrawColor(253, 230, 138) // amber-200
        doc.roundedRect(marginLeft, y, contentWidth, notasBoxHeight, 2, 2, 'FD')

        doc.setTextColor(...COLORS.text)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'italic')
        doc.text(notasLines, marginLeft + 7, y + 7)

        y += notasBoxHeight + 8
    }

    // ══════════════════════════════════════════════════
    // FOOTER
    // ══════════════════════════════════════════════════

    const footerY = 275
    doc.setDrawColor(...COLORS.border)
    doc.line(marginLeft, footerY, pageWidth - marginRight, footerY)

    doc.setTextColor(...COLORS.muted)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('G&G | Geosintéticos y Geomembranas — Documento generado automáticamente', marginLeft, footerY + 5)
    doc.text(`Generado el ${new Date().toLocaleDateString('es-PE')} a las ${new Date().toLocaleTimeString('es-PE')}`, marginLeft, footerY + 9)

    // Guardar
    const fileName = `Ficha_${lead.nombre.replace(/\s+/g, '_')}_${lead.id.slice(0, 8)}.pdf`
    doc.save(fileName)
}
