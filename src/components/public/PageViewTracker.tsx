'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Detecta el tipo de dispositivo basándose en el ancho del viewport.
 * No depende de user-agent (más fiable y respeta privacidad).
 */
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop'
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
}

/**
 * Determina el tipo de página basándose en la ruta.
 */
function getPageType(pathname: string): 'producto' | 'proyecto' | 'pagina' {
    if (pathname.startsWith('/productos/')) return 'producto'
    if (pathname.startsWith('/proyectos/')) return 'proyecto'
    return 'pagina'
}

/**
 * Extrae el slug de la ruta, o usa la ruta completa como slug para páginas estáticas.
 */
function getSlug(pathname: string): string {
    const segments = pathname.split('/').filter(Boolean)

    // Para /productos/geomembrana-hdpe -> 'geomembrana-hdpe'
    // Para /proyectos/reservorio-minero -> 'reservorio-minero'
    if (segments.length >= 2 && (segments[0] === 'productos' || segments[0] === 'proyectos')) {
        return segments[1]
    }

    // Para páginas como /nosotros, /servicios, / -> usar la ruta completa
    return pathname === '/' ? 'inicio' : segments.join('/')
}

/**
 * Componente invisible que registra una vista de página cada vez que la ruta cambia.
 * Se coloca una vez en el layout público — NO renderiza nada visual.
 *
 * Usa un ref para evitar enviar vistas duplicadas en la misma ruta por StrictMode de React.
 */
export default function PageViewTracker() {
    const pathname = usePathname()
    const lastTrackedPath = useRef<string | null>(null)

    useEffect(() => {
        // Evitar tracking duplicado para la misma ruta
        if (pathname === lastTrackedPath.current) return
        lastTrackedPath.current = pathname

        // No trackear rutas de admin, login, ni API
        if (
            pathname.startsWith('/admin') ||
            pathname.startsWith('/login') ||
            pathname.startsWith('/api')
        ) {
            return
        }

        const slug = getSlug(pathname)
        const tipo = getPageType(pathname)
        const dispositivo = getDeviceType()

        // Enviar la vista al servidor de forma no-bloqueante
        // Usar sendBeacon si está disponible, sino fetch con keepalive
        const payload = JSON.stringify({
            slug_pagina: slug,
            tipo_pagina: tipo,
            dispositivo,
            referrer: document.referrer || null,
        })

        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/page-views', new Blob([payload], { type: 'application/json' }))
        } else {
            fetch('/api/page-views', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true,
            }).catch(() => { /* Silencioso — no interrumpir la UX */ })
        }
    }, [pathname])

    return null
}
