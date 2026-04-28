'use client'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useAdminUI } from '@/contexts/AdminUIContext'
import {
    Plus, Pencil, Trash2, Check, X, Loader2, AlertCircle,
    ChevronDown, ChevronRight, Eye, EyeOff, ArrowUp, ArrowDown,
} from 'lucide-react'

/* ── Tipos ── */
interface CategoriaRow {
    id: string
    nombre: string
    slug: string
    descripcion: string | null
    icono_url: string | null
    orden: number
    activa: boolean
}

interface SubcategoriaRow {
    id: string
    categoria_id: string
    nombre: string
    slug: string
    descripcion: string | null
    orden: number
    activa: boolean
}

/* ── Helpers ── */
const toSlug = (text: string) =>
    text.toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

/* ── Componente principal ── */
export default function AdminCategoriasPage() {
    const [categorias, setCategorias] = useState<CategoriaRow[]>([])
    const [subcategorias, setSubcategorias] = useState<SubcategoriaRow[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { showToast, confirmAction } = useAdminUI()

    // Categoría expandida
    const [expandedCat, setExpandedCat] = useState<string | null>(null)

    // Form de Categoría
    const [showCatForm, setShowCatForm] = useState(false)
    const [editingCatId, setEditingCatId] = useState<string | null>(null)
    const [catForm, setCatForm] = useState({ nombre: '', slug: '', descripcion: '', icono_url: '' })

    // Form de Subcategoría
    const [showSubForm, setShowSubForm] = useState(false)
    const [editingSubId, setEditingSubId] = useState<string | null>(null)
    const [subParentId, setSubParentId] = useState<string | null>(null)
    const [subForm, setSubForm] = useState({ nombre: '', slug: '', descripcion: '' })

    /* ── Data loading ── */
    const loadData = useCallback(async () => {
        try {
            const supabase = createSupabaseClient()
            const [catRes, subRes] = await Promise.all([
                (supabase.from('categorias') as any).select('*').order('orden'),
                (supabase.from('subcategorias') as any).select('*').order('orden'),
            ])
            setCategorias((catRes.data || []) as CategoriaRow[])
            setSubcategorias((subRes.data || []) as SubcategoriaRow[])
        } catch {
            showToast('Error al cargar categorías', 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadData() }, [loadData])

    /* ── Categoría CRUD ── */
    const resetCatForm = () => {
        setCatForm({ nombre: '', slug: '', descripcion: '', icono_url: '' })
        setEditingCatId(null)
        setShowCatForm(false)
    }

    const handleEditCat = (cat: CategoriaRow) => {
        setCatForm({
            nombre: cat.nombre,
            slug: cat.slug,
            descripcion: cat.descripcion || '',
            icono_url: cat.icono_url || '',
        })
        setEditingCatId(cat.id)
        setShowCatForm(true)
    }

    const handleSaveCat = async () => {
        if (!catForm.nombre.trim()) return
        setSaving(true)
        try {
            const supabase = createSupabaseClient()
            const payload = {
                nombre: catForm.nombre,
                slug: catForm.slug || toSlug(catForm.nombre),
                descripcion: catForm.descripcion || null,
                icono_url: catForm.icono_url || null,
            }

            if (editingCatId) {
                const { error } = await (supabase.from('categorias') as any).update(payload).eq('id', editingCatId)
                if (error) throw error
            } else {
                const maxOrden = categorias.length > 0 ? Math.max(...categorias.map(c => c.orden)) + 1 : 0
                const { error } = await (supabase.from('categorias') as any).insert({ ...payload, orden: maxOrden })
                if (error) throw error
            }
            resetCatForm()
            await loadData()
            showToast('Categoría guardada con éxito', 'success')
        } catch (err: unknown) {
            showToast('Error al conectar con el servidor', 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteCat = async (id: string) => {
        const subsCount = subcategorias.filter(s => s.categoria_id === id).length
        const msg = subsCount > 0
            ? `Esta categoría tiene ${subsCount} subcategoría(s). Se eliminarán también. ¿Continuar?`
            : '¿Estás seguro de eliminar este registro?'

        const confirmed = await confirmAction(msg)
        if (!confirmed) return

        const supabase = createSupabaseClient()
        const { error } = await (supabase.from('categorias') as any).delete().eq('id', id)
        if (error) {
            showToast('Error al eliminar la categoría', 'error')
        } else {
            showToast('Categoría eliminada correctamente', 'success')
            await loadData()
        }
    }

    const toggleCatActiva = async (id: string, activa: boolean) => {
        const supabase = createSupabaseClient()
        await (supabase.from('categorias') as any).update({ activa: !activa }).eq('id', id)
        await loadData()
    }

    const moveCat = async (id: string, direction: 'up' | 'down') => {
        const index = categorias.findIndex(c => c.id === id)
        if (index < 0) return
        const swapIndex = direction === 'up' ? index - 1 : index + 1
        if (swapIndex < 0 || swapIndex >= categorias.length) return

        const supabase = createSupabaseClient()
        const current = categorias[index]
        const swap = categorias[swapIndex]
        await Promise.all([
            (supabase.from('categorias') as any).update({ orden: swap.orden }).eq('id', current.id),
            (supabase.from('categorias') as any).update({ orden: current.orden }).eq('id', swap.id),
        ])
        await loadData()
    }

    /* ── Subcategoría CRUD ── */
    const resetSubForm = () => {
        setSubForm({ nombre: '', slug: '', descripcion: '' })
        setEditingSubId(null)
        setSubParentId(null)
        setShowSubForm(false)
    }

    const handleEditSub = (sub: SubcategoriaRow) => {
        setSubForm({
            nombre: sub.nombre,
            slug: sub.slug,
            descripcion: sub.descripcion || '',
        })
        setEditingSubId(sub.id)
        setSubParentId(sub.categoria_id)
        setShowSubForm(true)
    }

    const handleSaveSub = async () => {
        if (!subForm.nombre.trim() || !subParentId) return
        setSaving(true)
        try {
            const supabase = createSupabaseClient()
            const payload = {
                nombre: subForm.nombre,
                slug: subForm.slug || toSlug(subForm.nombre),
                descripcion: subForm.descripcion || null,
                categoria_id: subParentId,
            }

            if (editingSubId) {
                const { error } = await (supabase.from('subcategorias') as any).update(payload).eq('id', editingSubId)
                if (error) throw error
            } else {
                const siblings = subcategorias.filter(s => s.categoria_id === subParentId)
                const maxOrden = siblings.length > 0 ? Math.max(...siblings.map(s => s.orden)) + 1 : 0
                const { error } = await (supabase.from('subcategorias') as any).insert({ ...payload, orden: maxOrden })
                if (error) throw error
            }
            resetSubForm()
            await loadData()
            showToast('Subcategoría guardada con éxito', 'success')
        } catch (err: unknown) {
            showToast('Error al conectar con el servidor', 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteSub = async (id: string) => {
        const confirmed = await confirmAction('¿Estás seguro de eliminar esta subcategoría?')
        if (!confirmed) return

        const supabase = createSupabaseClient()
        const { error } = await (supabase.from('subcategorias') as any).delete().eq('id', id)
        if (error) {
            showToast('Error al eliminar subcategoría', 'error')
        } else {
            showToast('Subcategoría eliminada correctamente', 'success')
            await loadData()
        }
    }

    const toggleSubActiva = async (id: string, activa: boolean) => {
        const supabase = createSupabaseClient()
        await (supabase.from('subcategorias') as any).update({ activa: !activa }).eq('id', id)
        await loadData()
    }

    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const deleteSelectedCats = async () => {
        if (selectedIds.length === 0) return
        
        // Verificar cuántas subcategorías se verán afectadas
        const affectedSubs = subcategorias.filter(s => selectedIds.includes(s.categoria_id)).length
        const msg = affectedSubs > 0 
            ? `Estás a punto de eliminar ${selectedIds.length} categorías y sus ${affectedSubs} subcategorías asociadas. ¿Deseas continuar?`
            : `¿Estás seguro de eliminar las ${selectedIds.length} categorías seleccionadas?`

        const confirmed = await confirmAction(msg)
        if (!confirmed) return

        const supabase = createSupabaseClient()
        const { error } = await (supabase.from('categorias') as any).delete().in('id', selectedIds)
        
        if (error) {
            showToast('Error al eliminar las categorías', 'error')
        } else {
            showToast(`${selectedIds.length} categorías eliminadas`, 'success')
            setSelectedIds([])
            await loadData()
        }
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === categorias.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(categorias.map(c => c.id))
        }
    }

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    /* ── Render ── */
    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" /></div>
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-primary">Categorías y Subcategorías</h2>
                    <p className="text-sm text-text-muted">Organiza tus productos por categorías</p>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {categorias.length > 0 && (
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer mr-2">
                            <input 
                                type="checkbox" 
                                checked={categorias.length > 0 && selectedIds.length === categorias.length}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                            />
                            Seleccionar todas
                        </label>
                    )}
                    
                    {selectedIds.length > 0 && (
                        <button 
                            onClick={deleteSelectedCats}
                            className="px-4 py-2 bg-red-50 text-red-600 font-semibold text-sm rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                        >
                            Eliminar ({selectedIds.length})
                        </button>
                    )}
                    
                    <button
                        onClick={() => { resetCatForm(); setShowCatForm(true) }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-all"
                    >
                        <Plus size={18} /> Nueva Categoría
                    </button>
                </div>
            </div>

            {/* Form: Categoría */}
            {showCatForm && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                    <h3 className="font-bold text-primary text-lg mb-4">
                        {editingCatId ? 'Editar Categoría' : 'Nueva Categoría'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Nombre *</label>
                            <input
                                type="text" value={catForm.nombre}
                                onChange={(e) => setCatForm({ ...catForm, nombre: e.target.value, slug: toSlug(e.target.value) })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                                placeholder="Ej: Geomembranas"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Slug</label>
                            <input
                                type="text" value={catForm.slug}
                                onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                                placeholder="geomembranas"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-primary mb-1">Descripción</label>
                            <textarea
                                rows={2} value={catForm.descripcion}
                                onChange={(e) => setCatForm({ ...catForm, descripcion: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-accent focus:outline-none"
                                placeholder="Breve descripción de la categoría"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSaveCat} disabled={saving || !catForm.nombre.trim()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                            {editingCatId ? 'Actualizar' : 'Crear'}
                        </button>
                        <button onClick={resetCatForm} className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Form: Subcategoría (inline modal) */}
            {showSubForm && (
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 shadow-lg">
                    <h3 className="font-bold text-primary text-lg mb-4">
                        {editingSubId ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
                        <span className="text-sm font-normal text-text-muted ml-2">
                            en {categorias.find(c => c.id === subParentId)?.nombre}
                        </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Nombre *</label>
                            <input
                                type="text" value={subForm.nombre}
                                onChange={(e) => setSubForm({ ...subForm, nombre: e.target.value, slug: toSlug(e.target.value) })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                                placeholder="Ej: HDPE"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Slug</label>
                            <input
                                type="text" value={subForm.slug}
                                onChange={(e) => setSubForm({ ...subForm, slug: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-primary mb-1">Descripción</label>
                            <textarea
                                rows={2} value={subForm.descripcion}
                                onChange={(e) => setSubForm({ ...subForm, descripcion: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-accent focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSaveSub} disabled={saving || !subForm.nombre.trim()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                            {editingSubId ? 'Actualizar' : 'Crear'}
                        </button>
                        <button onClick={resetSubForm} className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Lista de Categorías */}
            {categorias.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <p className="text-text-muted text-sm">No hay categorías aún. Crea la primera.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {categorias.map((cat, index) => {
                        const catSubs = subcategorias.filter(s => s.categoria_id === cat.id)
                        const isExpanded = expandedCat === cat.id
                        return (
                            <div key={cat.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                {/* Categoría Header */}
                                <div className={`flex items-center gap-3 px-5 py-4 transition-colors ${selectedIds.includes(cat.id) ? 'bg-accent/5' : ''}`}>
                                    {/* Checkbox */}
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.includes(cat.id)}
                                        onChange={() => toggleSelect(cat.id)}
                                        className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent cursor-pointer"
                                    />

                                    {/* Expand toggle */}
                                    <button
                                        onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                                        className="p-1 text-gray-400 hover:text-primary rounded transition-colors"
                                    >
                                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </button>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedCat(isExpanded ? null : cat.id)}>
                                        <div className="flex items-center gap-2">
                                            <p className={`font-semibold ${selectedIds.includes(cat.id) ? 'text-accent' : 'text-primary'}`}>{cat.nombre}</p>
                                            <span className="text-xs text-text-muted bg-surface px-2 py-0.5 rounded-full">
                                                {catSubs.length} sub{catSubs.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-muted truncate">/{cat.slug}</p>
                                    </div>

                                    {/* Estado */}
                                    <button
                                        onClick={() => toggleCatActiva(cat.id, cat.activa)}
                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${cat.activa
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat.activa ? <><Eye size={12} /> Activa</> : <><EyeOff size={12} /> Inactiva</>}
                                    </button>

                                    {/* Orden */}
                                    <div className="flex flex-col gap-0.5">
                                        <button
                                            onClick={() => moveCat(cat.id, 'up')}
                                            disabled={index === 0}
                                            className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 rounded transition-colors"
                                            title="Subir"
                                        >
                                            <ArrowUp size={14} />
                                        </button>
                                        <button
                                            onClick={() => moveCat(cat.id, 'down')}
                                            disabled={index === categorias.length - 1}
                                            className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 rounded transition-colors"
                                            title="Bajar"
                                        >
                                            <ArrowDown size={14} />
                                        </button>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => handleEditCat(cat)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg" title="Editar">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => handleDeleteCat(cat.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg" title="Eliminar">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Subcategorías (expandible) */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-surface/50">
                                        <div className="px-5 py-3">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Subcategorías</p>
                                                <button
                                                    onClick={() => { resetSubForm(); setSubParentId(cat.id); setShowSubForm(true) }}
                                                    className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-dark transition-colors"
                                                >
                                                    <Plus size={14} /> Agregar subcategoría
                                                </button>
                                            </div>

                                            {catSubs.length === 0 ? (
                                                <p className="text-sm text-gray-400 italic py-4 text-center">Sin subcategorías</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {catSubs.map((sub) => (
                                                        <div key={sub.id} className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-primary text-sm">{sub.nombre}</p>
                                                                <p className="text-xs text-text-muted">/{sub.slug}</p>
                                                            </div>

                                                            <button
                                                                onClick={() => toggleSubActiva(sub.id, sub.activa)}
                                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${sub.activa
                                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                                    }`}
                                                            >
                                                                {sub.activa ? 'Activa' : 'Inactiva'}
                                                            </button>

                                                            <div className="flex items-center gap-1">
                                                                <button onClick={() => handleEditSub(sub)} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg" title="Editar">
                                                                    <Pencil size={14} />
                                                                </button>
                                                                <button onClick={() => handleDeleteSub(sub.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg" title="Eliminar">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
