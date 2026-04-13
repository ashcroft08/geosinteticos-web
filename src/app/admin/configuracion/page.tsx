'use client'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useAdminUI } from '@/contexts/AdminUIContext'
import { Save, AlertCircle, Loader2, CheckCircle, X } from 'lucide-react'
import ConfigImageUploader from '@/components/admin/ConfigImageUploader'
import ConfigPdfUploader from '@/components/admin/ConfigPdfUploader'

interface ConfigItem {
    clave: string
    valor: string
    descripcion: string | null
}

export default function AdminConfiguracionPage() {
    const [configs, setConfigs] = useState<ConfigItem[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editedValues, setEditedValues] = useState<Record<string, string>>({})
    const { showToast } = useAdminUI()

    const loadData = useCallback(async () => {
        try {
            const supabase = createSupabaseClient()
            const { data } = await (supabase.from('configuracion_sitio') as any).select('*').order('clave')
            const loadedConfigs: ConfigItem[] = (data || []).map((d: Record<string, unknown>) => ({
                clave: String(d.clave || ''),
                valor: typeof d.valor === 'string' ? d.valor : JSON.stringify(d.valor, null, 2),
                descripcion: d.descripcion ? String(d.descripcion) : null,
            }))

            // Asegurar que url_catalogo_general exista
            if (!loadedConfigs.find(c => c.clave === 'url_catalogo_general')) {
                loadedConfigs.push({
                    clave: 'url_catalogo_general',
                    valor: '',
                    descripcion: 'Enlace al archivo PDF del Catálogo General'
                })
            }

            if (!loadedConfigs.find(c => c.clave === 'email_notificaciones')) {
                loadedConfigs.push({
                    clave: 'email_notificaciones',
                    valor: 'alexis298930@gmail.com',
                    descripcion: 'Correos que recibirán alertas de nuevos leads'
                })
            }

            if (!loadedConfigs.find(c => c.clave === 'imagen_banner_inicio')) {
                loadedConfigs.push({
                    clave: 'imagen_banner_inicio',
                    valor: '',
                    descripcion: 'Imagen de fondo principal del inicio'
                })
            }

            setConfigs(loadedConfigs)
        } catch {
            showToast('Error al cargar la configuración', 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadData() }, [loadData])

    const handleChange = (clave: string, value: string) => {
        setEditedValues((prev) => ({ ...prev, [clave]: value }))
    }

    const handleSave = async (clave: string) => {
        const newValue = editedValues[clave]
        if (newValue === undefined) return

        setSaving(true)

        try {
            let parsedValue
            try {
                parsedValue = JSON.parse(newValue)
            } catch {
                parsedValue = newValue
            }

            const res = await fetch('/api/configuracion', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clave, valor: parsedValue }),
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.error || 'Error al guardar')
            }

            setEditedValues((prev) => {
                const next = { ...prev }
                delete next[clave]
                return next
            })
            await loadData()
            showToast(`Registro guardado con éxito`, 'success')

        } catch (err: unknown) {
            showToast('Error al conectar con el servidor', 'error')
        } finally {
            setSaving(false)
        }
    }

    const labelForKey = (key: string): string => {
        const labels: Record<string, string> = {
            empresa_nombre: 'Nombre de la Empresa',
            empresa_descripcion: 'Descripción',
            empresa_mision: 'Misión',
            empresa_vision: 'Visión',
            empresa_valores: 'Valores (JSON array)',
            contacto_telefono: 'Teléfono',
            contacto_email: 'Email de contacto',
            contacto_direccion: 'Dirección',
            contacto_horario: 'Horario de atención',
            contacto_whatsapp: 'Número WhatsApp',
            email_notificaciones: 'Emails de Notificación (separados por coma)',
            url_catalogo_general: 'URL del Catálogo General (PDF)',
            redes_sociales: 'Redes Sociales (JSON)',
            estadisticas: 'Estadísticas del Home (JSON)',
        }
        return labels[key] || key
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" /></div>
    }

    const empresaConfigs = configs.filter((c) => c.clave.startsWith('empresa_'))
    const contactoConfigs = configs.filter((c) => c.clave.startsWith('contacto_'))
    const imageConfigs = configs.filter((c) => c.clave.startsWith('imagen_'))
    const pdfConfigs = configs.filter((c) => c.clave === 'url_catalogo_general')
    const otherConfigs = configs.filter((c) =>
        !c.clave.startsWith('empresa_') &&
        !c.clave.startsWith('contacto_') &&
        !c.clave.startsWith('imagen_') &&
        c.clave !== 'url_catalogo_general'
    )

    const renderConfigGroup = (title: string, items: ConfigItem[]) => (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-primary">{title}</h3>
            </div>
            <div className="divide-y divide-gray-100">
                {items.map((config) => {
                    const currentValue = editedValues[config.clave] ?? config.valor
                    const isEdited = editedValues[config.clave] !== undefined
                    const isJsonBlock = currentValue.length > 80 || currentValue.includes('\n')

                    return (
                        <div key={config.clave} className="px-6 py-4">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                    <label className="text-sm font-semibold text-primary">{labelForKey(config.clave)}</label>
                                    {config.descripcion && (
                                        <p className="text-xs text-text-muted">{config.descripcion}</p>
                                    )}
                                </div>
                                {isEdited && (
                                    <button
                                        onClick={() => handleSave(config.clave)}
                                        disabled={saving}
                                        className="flex items-center gap-1.5 px-4 py-1.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-all text-xs shrink-0"
                                    >
                                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        Guardar
                                    </button>
                                )}
                            </div>
                            {isJsonBlock ? (
                                <textarea
                                    rows={4}
                                    value={currentValue}
                                    onChange={(e) => handleChange(config.clave, e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm font-mono resize-none ${isEdited ? 'border-accent bg-accent/5' : 'border-gray-200'
                                        }`}
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={currentValue.replace(/^"|"$/g, '')}
                                    onChange={(e) => handleChange(config.clave, `"${e.target.value}"`)}
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm ${isEdited ? 'border-accent bg-accent/5' : 'border-gray-200'
                                        }`}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Ajustes Visuales y Archivos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {imageConfigs.map(config => (
                    <ConfigImageUploader
                        key={config.clave}
                        clave={config.clave}
                        label={labelForKey(config.clave)}
                        currentUrl={config.valor}
                        onUploadComplete={loadData}
                    />
                ))}
                {pdfConfigs.map(config => (
                    <ConfigPdfUploader
                        key={config.clave}
                        clave={config.clave}
                        label={labelForKey(config.clave)}
                        currentUrl={config.valor}
                        onUploadComplete={loadData}
                    />
                ))}
            </div>

            <h2 className="text-2xl font-bold text-primary">Configuraciones Generales</h2>
            {renderConfigGroup('Información de la Empresa', empresaConfigs)}
            {renderConfigGroup('Información de Contacto', contactoConfigs)}
            {otherConfigs.length > 0 && renderConfigGroup('Otras Configuraciones', otherConfigs)}
        </div>
    )
}
