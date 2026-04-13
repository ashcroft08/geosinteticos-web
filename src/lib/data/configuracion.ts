import { createSupabaseServer } from '@/lib/supabase/server'
import { ESTADISTICAS, CERTIFICACIONES_ESTATICAS } from '@/lib/static-data'

export interface Estadistica {
    numero: string
    label: string
}

export interface CertificacionPublica {
    nombre: string
    emisor: string | null
    vigencia: string | null
    descripcion: string | null
}

export interface EmpresaInfo {
    nombre: string
    descripcion: string
    mision: string
    vision: string
    valores: string[]
}

/** Lee un valor de configuracion_sitio por clave, con fallback */
export async function fetchConfigValue(clave: string, fallback: string): Promise<string> {
    try {
        const supabase = createSupabaseServer()
        const { data, error } = await (supabase.from('configuracion_sitio') as any)
            .select('valor')
            .eq('clave', clave)
            .single()

        if (error || !data) return fallback

        const val = data.valor
        if (typeof val === 'string') return val
        return JSON.stringify(val)
    } catch {
        return fallback
    }
}

/** Obtiene la URL del catálogo general */
export async function fetchCatalogoUrl(): Promise<string> {
    return fetchConfigValue('url_catalogo_general', '')
}

/** Obtiene la URL del banner principal de inicio */
export async function fetchBannerInicio(): Promise<string> {
    return fetchConfigValue('imagen_banner_inicio', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920')
}
/** Obtiene toda la información de la empresa desde configuracion_sitio */
export async function fetchEmpresaInfo(): Promise<EmpresaInfo> {
    const [nombre, descripcion, mision, vision, valoresRaw] = await Promise.all([
        fetchConfigValue('empresa_nombre', 'GeoSintéticos Industrial'),
        fetchConfigValue('empresa_descripcion', 'Empresa líder en soluciones con geosintéticos para proyectos de ingeniería civil, minería y medio ambiente.'),
        fetchConfigValue('empresa_mision', 'Proveer soluciones innovadoras y sostenibles en ingeniería de geosintéticos, superando las expectativas de calidad y seguridad de nuestros clientes.'),
        fetchConfigValue('empresa_vision', 'Ser reconocidos a nivel latinoamericano como la empresa referente en soluciones de impermeabilización y contención de fluidos.'),
        fetchConfigValue('empresa_valores', '["Seguridad ante todo","Excelencia técnica","Integridad y honestidad","Compromiso ambiental"]'),
    ])

    let valores: string[]
    try {
        const parsed = JSON.parse(valoresRaw)
        valores = Array.isArray(parsed) ? parsed : ['Seguridad ante todo', 'Excelencia técnica', 'Integridad y honestidad', 'Compromiso ambiental']
    } catch {
        valores = ['Seguridad ante todo', 'Excelencia técnica', 'Integridad y honestidad', 'Compromiso ambiental']
    }

    return { nombre, descripcion, mision, vision, valores }
}

export interface ContactoInfo {
    telefono: string
    email: string
    direccion: string
    horario: string
    whatsapp: string
}

/** Obtiene la información de contacto desde configuracion_sitio */
export async function fetchContactoInfo(): Promise<ContactoInfo> {
    const [telefono, email, direccion, horario, whatsapp] = await Promise.all([
        fetchConfigValue('contacto_telefono', '+51 1 234 5678'),
        fetchConfigValue('contacto_email', 'info@geosinteticos.pe'),
        fetchConfigValue('contacto_direccion', 'Lima, Perú'),
        fetchConfigValue('contacto_horario', 'Lunes a Viernes: 8:00 - 18:00'),
        fetchConfigValue('contacto_whatsapp', '+51999999999'),
    ])

    return { telefono, email, direccion, horario, whatsapp }
}

/** Obtiene estadísticas desde configuracion_sitio, con fallback estático */
export async function fetchEstadisticas(): Promise<Estadistica[]> {
    try {
        const supabase = createSupabaseServer()
        const { data, error } = await (supabase.from('configuracion_sitio') as any)
            .select('valor')
            .eq('clave', 'estadisticas')
            .single()

        if (error || !data) throw new Error(error?.message || 'Sin datos')

        const parsed = data.valor
        if (Array.isArray(parsed)) {
            return parsed as Estadistica[]
        }
        throw new Error('Formato inválido')
    } catch {
        return ESTADISTICAS
    }
}

/** Obtiene certificaciones activas desde Supabase, con fallback estático */
export async function fetchCertificaciones(): Promise<CertificacionPublica[]> {
    try {
        const supabase = createSupabaseServer()
        const { data, error } = await (supabase.from('certificaciones') as any)
            .select('nombre, emisor, vigencia, descripcion')
            .eq('activa', true)
            .order('orden')

        if (error || !data || data.length === 0) throw new Error(error?.message || 'Sin datos')

        return data as unknown as CertificacionPublica[]
    } catch {
        return CERTIFICACIONES_ESTATICAS
    }
}

