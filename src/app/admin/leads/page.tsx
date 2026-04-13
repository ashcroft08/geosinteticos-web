'use client'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useAdminUI } from '@/contexts/AdminUIContext'
import { Search, AlertCircle, X, Clock, Mail, Phone, Building2, FileText } from 'lucide-react'

interface LeadRow {
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

const ESTADOS = ['nuevo', 'contactado', 'cotizado', 'cerrado', 'descartado'] as const

const estadoColor: Record<string, string> = {
    nuevo: 'bg-blue-100 text-blue-700',
    contactado: 'bg-yellow-100 text-yellow-700',
    cotizado: 'bg-purple-100 text-purple-700',
    cerrado: 'bg-green-100 text-green-700',
    descartado: 'bg-gray-100 text-gray-600',
}

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<LeadRow[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterEstado, setFilterEstado] = useState<string>('todos')
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const { showToast, confirmAction } = useAdminUI()

    const loadData = useCallback(async () => {
        try {
            const supabase = createSupabaseClient()
            const { data } = await (supabase.from('leads') as any)
                .select('*')
                .order('created_at', { ascending: false })
            setLeads((data || []) as LeadRow[])
        } catch {
            showToast('Error al cargar los leads', 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadData() }, [loadData])

    const updateEstado = async (id: string, nuevoEstado: string) => {
        const supabase = createSupabaseClient()
        const { error } = await (supabase.from('leads') as any).update({ estado: nuevoEstado }).eq('id', id)
        if (error) {
            showToast('Error al actualizar estado', 'error')
        } else {
            setLeads(leads.map(l => l.id === id ? { ...l, estado: nuevoEstado } : l))
            showToast('Estado actualizado', 'success')
        }
    }

    const updateNotas = async (id: string, notas: string) => {
        const supabase = createSupabaseClient()
        const { error } = await (supabase.from('leads') as any).update({ notas_internas: notas }).eq('id', id)
        if (error) {
            showToast('Error al guardar notas', 'error')
        } else {
            setLeads(leads.map(l => l.id === id ? { ...l, notas_internas: notas } : l))
            showToast('Notas guardadas', 'success')
        }
    }

    const deleteLead = async (id: string) => {
        const confirmed = await confirmAction('¿Estás seguro de eliminar este lead?')
        if (!confirmed) return

        const supabase = createSupabaseClient()
        const { error } = await (supabase.from('leads') as any).delete().eq('id', id)
        if (error) {
            showToast('Error al eliminar lead', 'error')
        } else {
            setLeads(leads.filter(l => l.id !== id))
            showToast('Lead eliminado', 'success')
        }
    }

    const filtered = leads.filter(l => {
        const matchSearch = l.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchEstado = filterEstado === 'todos' || l.estado === filterEstado
        return matchSearch && matchEstado
    })

    const statsByEstado = ESTADOS.map(e => ({
        estado: e,
        count: leads.filter(l => l.estado === e).length,
    }))

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" /></div>
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {statsByEstado.map(({ estado, count }) => (
                    <button
                        key={estado}
                        onClick={() => setFilterEstado(filterEstado === estado ? 'todos' : estado)}
                        className={`p-4 rounded-xl border text-center transition-all ${filterEstado === estado ? 'border-accent bg-accent/10 shadow-sm' : 'border-gray-200 bg-white hover:bg-surface'
                            }`}
                    >
                        <p className="text-2xl font-bold text-primary">{count}</p>
                        <p className="text-xs text-text-muted capitalize">{estado}</p>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Buscar por nombre o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent text-sm" />
            </div>

            {/* Leads List */}
            <div className="space-y-3">
                {filtered.map((lead) => (
                    <div key={lead.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-sm transition-all">
                        {/* Header */}
                        <div
                            className="px-6 py-4 flex items-center gap-4 cursor-pointer"
                            onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <p className="font-semibold text-primary truncate">{lead.nombre}</p>
                                    {lead.empresa && (
                                        <span className="hidden sm:inline-flex items-center gap-1 text-text-muted text-xs">
                                            <Building2 size={12} /> {lead.empresa}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                                    <span className="flex items-center gap-1"><Mail size={12} /> {lead.email}</span>
                                    <span className="flex items-center gap-1"><Phone size={12} /> {lead.telefono}</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(lead.created_at).toLocaleString('es-PE')}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {lead.producto_nombre && (
                                    <span className="hidden lg:inline-block px-3 py-1 bg-surface text-text-muted text-xs rounded-full truncate max-w-[200px]">
                                        <FileText size={12} className="inline mr-1" />{lead.producto_nombre}
                                    </span>
                                )}
                                <select
                                    value={lead.estado}
                                    onChange={(e) => { e.stopPropagation(); updateEstado(lead.id, e.target.value) }}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer ${estadoColor[lead.estado]}`}
                                >
                                    {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Expanded */}
                        {expandedId === lead.id && (
                            <div className="px-6 py-4 bg-surface border-t border-gray-100 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-primary mb-1">Tipo de proyecto</p>
                                        <p className="text-sm text-text-muted">{lead.tipo_proyecto || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-primary mb-1">Canal</p>
                                        <p className="text-sm text-text-muted capitalize">{lead.canal}</p>
                                    </div>
                                </div>
                                {lead.mensaje && (
                                    <div>
                                        <p className="text-xs font-semibold text-primary mb-1">Mensaje</p>
                                        <p className="text-sm text-text-muted bg-white p-3 rounded-lg">{lead.mensaje}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs font-semibold text-primary mb-1">Notas internas</p>
                                    <textarea
                                        rows={2}
                                        defaultValue={lead.notas_internas || ''}
                                        onBlur={(e) => updateNotas(lead.id, e.target.value)}
                                        placeholder="Agregar notas internas..."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button onClick={() => deleteLead(lead.id)}
                                        className="text-xs text-red-500 hover:text-red-700 hover:underline">
                                        Eliminar lead
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-text-muted">
                        No se encontraron leads
                    </div>
                )}
            </div>
        </div>
    )
}
