'use client'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useAdminUI } from '@/contexts/AdminUIContext'
import { Plus, Pencil, Trash2, Search, AlertCircle, Loader2, Check, X, Eye, EyeOff, PlusCircle, Image as ImageIcon, LayoutGrid, List } from 'lucide-react'
import Image from 'next/image'
import ProjectSlotUploader from '@/components/admin/ProjectSlotUploader'

interface MetricaRow {
    indicador: string
    valor: string
}

interface ProyectoRow {
    id: string
    titulo: string
    slug: string
    cliente: string | null
    ciudad: string | null
    region: string | null
    tipo_obra: string | null
    fecha: string | null
    destacado: boolean
    publicado: boolean
    imagenes_estructuradas: Record<string, string | null>
}

const TIPOS_OBRA = ['Minería', 'Agricultura', 'Residencial', 'Industrial', 'Ambiental']

export default function AdminProyectosPage() {
    const [proyectos, setProyectos] = useState<ProyectoRow[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const { showToast, confirmAction } = useAdminUI()

    // Form state
    const [form, setForm] = useState({
        titulo: '', slug: '', cliente: '', ciudad: '', region: '', pais: 'Perú',
        tipo_obra: '', tipo_obra_custom: '', fecha: '', reto: '', solucion: '',
        destacado: false, publicado: false,
    })
    const [metricas, setMetricas] = useState<MetricaRow[]>([])

    // Imágenes JSON Slots
    const [imagenes, setImagenes] = useState<Record<string, string | null>>({})

    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const loadData = useCallback(async () => {
        try {
            const supabase = createSupabaseClient()

            const { data, error } = await (supabase.from('proyectos') as any)
                .select('id, titulo, slug, cliente, ciudad, region, tipo_obra, fecha, destacado, publicado, imagenes_estructuradas')
                .order('orden')

            if (error) {
                // Si la columna orden no existe aún (común en desarrollo), reintenta por created_at
                const { data: fallbackData, error: backupError } = await (supabase.from('proyectos') as any)
                    .select('id, titulo, slug, cliente, ciudad, region, tipo_obra, fecha, destacado, publicado, imagenes_estructuradas')
                    .order('created_at', { ascending: false })

                if (backupError) throw backupError

                const rows = (fallbackData || []) as ProyectoRow[]
                setProyectos(rows)
                setSelectedIds([])

                if (editingId) {
                    const current = rows.find(p => p.id === editingId)
                    if (current) setImagenes(current.imagenes_estructuradas || {})
                }
                return
            }

            const rows = (data || []) as ProyectoRow[]
            setProyectos(rows)
            setSelectedIds([])

            // Actualizar imágenes si estamos editando
            if (editingId) {
                const current = rows.find(p => p.id === editingId)
                if (current) setImagenes(current.imagenes_estructuradas || {})
            }
        } catch {
            showToast('Error al cargar los proyectos', 'error')
        } finally {
            setLoading(false)
        }
    }, [editingId, showToast])

    useEffect(() => { loadData() }, [loadData])

    const resetForm = () => {
        setForm({
            titulo: '', slug: '', cliente: '', ciudad: '', region: '', pais: 'Perú',
            tipo_obra: '', tipo_obra_custom: '', fecha: '', reto: '', solucion: '',
            destacado: false, publicado: false,
        })
        setMetricas([])
        setImagenes({})
        setEditingId(null)
        setShowForm(false)
    }

    const toSlug = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const handleEdit = async (id: string) => {
        const supabase = createSupabaseClient()
        const { data } = await (supabase.from('proyectos') as any)
            .select(`*`)
            .eq('id', id)
            .single()

        if (data) {
            const row = data as any
            const isCustom = row.tipo_obra && !TIPOS_OBRA.includes(row.tipo_obra)
            setForm({
                titulo: row.titulo, slug: row.slug, cliente: row.cliente || '',
                ciudad: row.ciudad || '', region: row.region || '', pais: row.pais || 'Perú',
                tipo_obra: isCustom ? 'Otro' : (row.tipo_obra || ''),
                tipo_obra_custom: isCustom ? row.tipo_obra : '',
                fecha: row.fecha ? row.fecha.slice(0, 10) : '',
                reto: row.reto || '', solucion: row.solucion || '',
                destacado: row.destacado, publicado: row.publicado,
            })
            const mets = Array.isArray(row.metricas) ? row.metricas : []
            setMetricas(mets.map((m: Record<string, string>) => ({
                indicador: m.indicador || '',
                valor: m.valor || '',
            })))
            setImagenes(row.imagenes_estructuradas || {})
            setEditingId(id)
            setShowForm(true)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const supabase = createSupabaseClient()
            const payload = {
                titulo: form.titulo,
                slug: form.slug || toSlug(form.titulo),
                cliente: form.cliente || null,
                ciudad: form.ciudad || null,
                region: form.region || null,
                pais: form.pais || 'Perú',
                tipo_obra: form.tipo_obra === 'Otro' ? (form.tipo_obra_custom || null) : (form.tipo_obra || null),
                fecha: form.fecha || null,
                reto: form.reto || null,
                solucion: form.solucion || null,
                metricas: metricas.filter(m => m.indicador.trim() !== ''),
                destacado: form.destacado,
                publicado: form.publicado,
            }

            let newId = editingId

            if (editingId) {
                const { error } = await (supabase.from('proyectos') as any).update(payload).eq('id', editingId)
                if (error) throw error
            } else {
                const { data: inserted, error } = await (supabase.from('proyectos') as any).insert(payload).select('id').single()
                if (error) throw error
                newId = (inserted as any).id
            }

            if (!editingId && newId) {
                setEditingId(newId)
                showToast('Proyecto creado. Ahora puedes subir imágenes.', 'success')
                await loadData()
            } else {
                resetForm()
                await loadData()
                showToast('Proyecto guardado correctamente.', 'success')
            }
        } catch (err: unknown) {
            showToast('Error al guardar el proyecto', 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        const confirmed = await confirmAction('¿Estás seguro de eliminar este proyecto?')
        if (!confirmed) return

        const supabase = createSupabaseClient()
        const { error } = await (supabase.from('proyectos') as any).delete().eq('id', id)
        if (error) {
            showToast('Error al eliminar el proyecto', 'error')
        } else {
            showToast('Proyecto eliminado correctamente', 'success')
            await loadData()
        }
    }

    const togglePublicado = async (id: string, publicado: boolean) => {
        const supabase = createSupabaseClient()
        await (supabase.from('proyectos') as any).update({ publicado: !publicado }).eq('id', id)
        await loadData()
    }

    const deleteSelectedProjects = async () => {
        if (selectedIds.length === 0) return
        
        const confirmed = await confirmAction(`¿Estás seguro de eliminar los ${selectedIds.length} proyectos seleccionados?`)
        if (!confirmed) return

        const supabase = createSupabaseClient()
        const { error } = await (supabase.from('proyectos') as any).delete().in('id', selectedIds)
        
        if (error) {
            showToast('Error al eliminar los proyectos', 'error')
        } else {
            setProyectos(proyectos.filter(p => !selectedIds.includes(p.id)))
            setSelectedIds([])
            showToast(`${selectedIds.length} proyectos eliminados`, 'success')
        }
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === filtered.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filtered.map(p => p.id))
        }
    }

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    // Eliminamos las viejas funciones de borrar y actualizar imágenes anidadas ya que
    // usarán ProjectSlotUploader.tsx que llama a la nueva API /api/upload-slot.

    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

    const filtered = proyectos.filter(p => p.titulo.toLowerCase().includes(searchTerm.toLowerCase()))

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" /></div>
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Buscar proyectos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent text-sm focus:outline-none" />
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-accent' : 'text-gray-500 hover:text-gray-700'}`} title="Vista de lista"><List size={18} /></button>
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-accent' : 'text-gray-500 hover:text-gray-700'}`} title="Vista de cuadrícula"><LayoutGrid size={18} /></button>
                    </div>

                    {selectedIds.length > 0 && (
                        <button 
                            onClick={deleteSelectedProjects}
                            className="px-4 py-2 bg-red-50 text-red-600 font-semibold text-sm rounded-lg hover:bg-red-100 transition-colors border border-red-100 shrink-0"
                        >
                            Eliminar ({selectedIds.length})
                        </button>
                    )}
                    <button onClick={() => { resetForm(); setShowForm(true) }}
                        className="flex items-center gap-2 px-5 py-2 bg-accent text-white font-semibold text-sm rounded-lg hover:bg-accent-dark transition-all shrink-0">
                        <Plus size={18} /> Nuevo Proyecto
                    </button>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                    <h3 className="font-bold text-primary text-lg mb-4">{editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Título *</label>
                            <input type="text" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value, slug: toSlug(e.target.value) })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Slug</label>
                            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Cliente</label>
                            <input type="text" value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Tipo de Obra</label>
                            <select value={form.tipo_obra} onChange={(e) => setForm({ ...form, tipo_obra: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
                                <option value="">Seleccionar</option>
                                {TIPOS_OBRA.map(t => <option key={t} value={t}>{t}</option>)}
                                <option value="Otro">Otro</option>
                            </select>
                            {form.tipo_obra === 'Otro' && (
                                <input
                                    type="text"
                                    placeholder="Especificar tipo de obra"
                                    value={form.tipo_obra_custom}
                                    onChange={(e) => setForm({ ...form, tipo_obra_custom: e.target.value })}
                                    className="w-full px-4 py-2 mt-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent"
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Ciudad</label>
                            <input type="text" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Región</label>
                            <input type="text" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Fecha</label>
                            <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
                        </div>
                    </div>
                    <div className="space-y-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Reto</label>
                            <textarea rows={2} value={form.reto} onChange={(e) => setForm({ ...form, reto: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Solución</label>
                            <textarea rows={3} value={form.solucion} onChange={(e) => setForm({ ...form, solucion: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-primary">Métricas del Proyecto</label>
                                <button
                                    type="button"
                                    onClick={() => setMetricas([...metricas, { indicador: '', valor: '' }])}
                                    className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-dark transition-colors"
                                >
                                    <PlusCircle size={14} /> Agregar
                                </button>
                            </div>
                            {metricas.length > 0 ? (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-[1fr_1fr_32px] gap-2 text-xs font-semibold text-gray-500 px-1">
                                        <span>Indicador</span>
                                        <span>Valor</span>
                                        <span></span>
                                    </div>
                                    {metricas.map((met, index) => (
                                        <div key={index} className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center">
                                            <input
                                                type="text" placeholder="Ej: Área cubierta" value={met.indicador}
                                                onChange={(e) => {
                                                    const updated = [...metricas]
                                                    updated[index] = { ...updated[index], indicador: e.target.value }
                                                    setMetricas(updated)
                                                }}
                                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                                            />
                                            <input
                                                type="text" placeholder="Ej: 5,000 m²" value={met.valor}
                                                onChange={(e) => {
                                                    const updated = [...metricas]
                                                    updated[index] = { ...updated[index], valor: e.target.value }
                                                    setMetricas(updated)
                                                }}
                                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setMetricas(metricas.filter((_, i) => i !== index))}
                                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic px-1">Sin métricas. Haz clic en &quot;Agregar&quot; para añadir una.</p>
                            )}
                        </div>

                        {/* Galería de imágenes */}
                        <div className="border-t border-gray-100 pt-6">
                            <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                                <ImageIcon size={20} className="text-accent" /> Galería de Imágenes
                            </h4>

                            {editingId ? (
                                <div>
                                    <ProjectSlotUploader
                                        proyectoId={editingId}
                                        currentImages={imagenes}
                                        onUploadComplete={loadData}
                                    />
                                </div>
                            ) : (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                                    <AlertCircle size={18} className="text-amber-500 shrink-0" />
                                    <p className="text-sm text-amber-700">
                                        Primero guarda el proyecto con <strong>&quot;Crear&quot;</strong> para poder subir imágenes a la galería.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.publicado} onChange={(e) => setForm({ ...form, publicado: e.target.checked })} className="w-4 h-4 accent-accent" />
                                <span className="text-sm font-medium">Publicado</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.destacado} onChange={(e) => setForm({ ...form, destacado: e.target.checked })} className="w-4 h-4 accent-accent" />
                                <span className="text-sm font-medium">Destacado</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                        <button onClick={handleSave} disabled={saving || !form.titulo}
                            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-all disabled:opacity-50">
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                            {editingId ? 'Actualizar' : 'Crear'}
                        </button>
                        <button onClick={resetForm} className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50">Cancelar</button>
                    </div>
                </div>
            )}

            {/* Vistas (Lista / Cuadrícula) */}
            {viewMode === 'list' ? (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface border-b border-gray-200">
                                    <th className="text-left px-5 py-3 w-12">
                                        <input 
                                            type="checkbox" 
                                            checked={filtered.length > 0 && selectedIds.length === filtered.length}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent cursor-pointer"
                                        />
                                    </th>
                                    <th className="text-left px-5 py-3 font-semibold text-primary">Proyecto</th>
                                    <th className="text-left px-5 py-3 font-semibold text-primary hidden md:table-cell">Tipo</th>
                                    <th className="text-left px-5 py-3 font-semibold text-primary hidden lg:table-cell">Ubicación</th>
                                    <th className="text-center px-5 py-3 font-semibold text-primary">Estado</th>
                                    <th className="text-right px-5 py-3 font-semibold text-primary">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((project) => {
                                    const mainImage = project.imagenes_estructuradas?.general
                                    return (
                                        <tr key={project.id} className={`border-b border-gray-100 transition-colors ${selectedIds.includes(project.id) ? 'bg-accent/5' : 'hover:bg-surface/50'}`}>
                                            <td className="px-5 py-4">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.includes(project.id)}
                                                    onChange={() => toggleSelect(project.id)}
                                                    className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {mainImage && (
                                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                                            <Image src={mainImage} alt={project.titulo} fill className="object-cover" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-primary truncate">{project.titulo}</p>
                                                        <p className="text-text-muted text-xs truncate">{project.cliente || '—'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 hidden md:table-cell">
                                                <span className="px-3 py-1 bg-surface text-text-muted text-xs rounded-full">{project.tipo_obra || '—'}</span>
                                            </td>
                                            <td className="px-5 py-4 hidden lg:table-cell text-text-muted">
                                                {project.ciudad ? `${project.ciudad}, ${project.region}` : '—'}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <button onClick={() => togglePublicado(project.id, project.publicado)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${project.publicado ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                                    {project.publicado ? <><Eye size={12} /> Publicado</> : <><EyeOff size={12} /> Borrador</>}
                                                </button>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleEdit(project.id)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg" title="Editar">
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(project.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg" title="Eliminar">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={6} className="px-5 py-12 text-center text-text-muted">No se encontraron proyectos</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map(project => {
                        const mainImage = project.imagenes_estructuradas?.general
                        return (
                            <div key={project.id} className={`bg-white rounded-2xl border ${selectedIds.includes(project.id) ? 'border-accent bg-accent/5 shadow-md' : 'border-gray-100'} overflow-hidden relative group transition-all hover:shadow-lg`}>
                                <div className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-sm rounded-md p-1">
                                    <input type="checkbox" checked={selectedIds.includes(project.id)} onChange={() => toggleSelect(project.id)} className="w-5 h-5 text-accent border-gray-300 rounded focus:ring-accent cursor-pointer shadow-sm block" />
                                </div>
                                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(project.id)} className="p-2 bg-white text-blue-500 rounded-lg shadow-sm hover:bg-blue-50 border border-gray-100" title="Editar"><Pencil size={16}/></button>
                                    <button onClick={() => handleDelete(project.id)} className="p-2 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 border border-gray-100" title="Eliminar"><Trash2 size={16}/></button>
                                </div>
                                <div className="aspect-video bg-gray-50 relative border-b border-gray-100">
                                    {mainImage ? (
                                        <Image src={mainImage} alt={project.titulo} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={48} strokeWidth={1} /></div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <p className="font-bold text-primary truncate flex-1" title={project.titulo}>{project.titulo}</p>
                                        <button 
                                            onClick={() => togglePublicado(project.id, project.publicado)} 
                                            className="shrink-0 group/btn"
                                            title={project.publicado ? "Publicado" : "Borrador"}
                                        >
                                            {project.publicado ? (
                                                <Eye size={18} className="text-green-600 hover:text-green-700" />
                                            ) : (
                                                <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-1 text-xs text-text-muted">
                                        <span><span className="font-medium text-gray-500">Cliente:</span> {project.cliente || '—'}</span>
                                        <span><span className="font-medium text-gray-500">Tipo:</span> {project.tipo_obra || '—'}</span>
                                        <span className="truncate"><span className="font-medium text-gray-500">Ubicación:</span> {project.ciudad ? `${project.ciudad}, ${project.region}` : '—'}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {filtered.length === 0 && (
                        <div className="col-span-full py-12 text-center text-text-muted bg-white rounded-2xl border border-gray-100">
                            No se encontraron proyectos
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
