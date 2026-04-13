'use client'

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useAdminUI } from '@/contexts/AdminUIContext'
import { Plus, Pencil, Trash2, Search, AlertCircle, Loader2, Check, X, PlusCircle, Star, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import ImageUploader from '@/components/admin/ImageUploader'

interface EspecificacionRow {
    propiedad: string
    valor: string
    unidad: string
}

interface ProductoImagen {
    id: string
    url_publica: string
    es_principal: boolean
}

interface ProductoRow {
    id: string
    nombre: string
    slug: string
    disponible: boolean
    destacado: boolean
    orden: number
    created_at: string
    producto_imagenes: ProductoImagen[]
    categorias: { nombre: string } | null
    subcategorias: { nombre: string } | null
}

export default function AdminProductosPage() {
    const [productos, setProductos] = useState<ProductoRow[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const { showToast, confirmAction } = useAdminUI()

    // Form state
    const [form, setForm] = useState({
        nombre: '', slug: '', descripcion_corta: '', descripcion_detallada: '',
        categoria_id: '', subcategoria_id: '', disponible: true, destacado: false,
        aplicaciones: '', certificaciones: '',
    })
    const [especificaciones, setEspecificaciones] = useState<EspecificacionRow[]>([])

    // Imágenes del producto en edición
    const [imagenes, setImagenes] = useState<ProductoImagen[]>([])

    const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([])
    const [subcategorias, setSubcategorias] = useState<{ id: string; nombre: string; categoria_id: string }[]>([])

    const loadData = useCallback(async () => {
        try {
            const supabase = createSupabaseClient()
            const [prodRes, catRes, subRes] = await Promise.all([
                (supabase.from('productos') as any)
                    .select('id, nombre, slug, disponible, destacado, orden, created_at, producto_imagenes(id, url_publica, es_principal), categorias(nombre), subcategorias(nombre)')
                    .order('orden'),
                (supabase.from('categorias') as any).select('id, nombre').order('orden'),
                (supabase.from('subcategorias') as any).select('id, nombre, categoria_id').order('orden'),
            ])
            setProductos((prodRes.data || []) as ProductoRow[])
            setCategorias((catRes.data || []) as { id: string; nombre: string }[])
            setSubcategorias((subRes.data || []) as { id: string; nombre: string; categoria_id: string }[])

            // Si estamos editando, actualizar las imágenes del producto actual
            if (editingId) {
                const currentProd = ((prodRes.data || []) as ProductoRow[]).find(p => p.id === editingId)
                if (currentProd) setImagenes(currentProd.producto_imagenes || [])
            }
        } catch {
            showToast('Error al cargar los productos', 'error')
        } finally {
            setLoading(false)
        }
    }, [editingId])

    useEffect(() => { loadData() }, [loadData])

    const resetForm = () => {
        setForm({
            nombre: '', slug: '', descripcion_corta: '', descripcion_detallada: '',
            categoria_id: '', subcategoria_id: '', disponible: true, destacado: false,
            aplicaciones: '', certificaciones: '',
        })
        setEspecificaciones([])
        setImagenes([])
        setEditingId(null)
        setShowForm(false)
    }

    const toSlug = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const handleEdit = async (id: string) => {
        const supabase = createSupabaseClient()
        const { data } = await (supabase.from('productos') as any)
            .select(`*, producto_imagenes(id, url_publica, es_principal)`)
            .eq('id', id)
            .single()

        if (data) {
            const row = data as any
            setForm({
                nombre: row.nombre, slug: row.slug,
                descripcion_corta: row.descripcion_corta || '',
                descripcion_detallada: row.descripcion_detallada || '',
                categoria_id: row.categoria_id || '',
                subcategoria_id: row.subcategoria_id || '',
                disponible: row.disponible, destacado: row.destacado,
                aplicaciones: (row.aplicaciones || []).join(', '),
                certificaciones: (row.certificaciones || []).join(', '),
            })
            const specs = Array.isArray(row.especificaciones) ? row.especificaciones : []
            setEspecificaciones(specs.map((s: Record<string, string>) => ({
                propiedad: s.propiedad || '',
                valor: s.valor || '',
                unidad: s.unidad || '',
            })))
            setImagenes(row.producto_imagenes || [])
            setEditingId(id)
            setShowForm(true)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const supabase = createSupabaseClient()
            const payload = {
                nombre: form.nombre,
                slug: form.slug || toSlug(form.nombre),
                descripcion_corta: form.descripcion_corta || null,
                descripcion_detallada: form.descripcion_detallada || null,
                categoria_id: form.categoria_id && form.categoria_id.trim() !== '' ? form.categoria_id : null,
                subcategoria_id: form.subcategoria_id && form.subcategoria_id.trim() !== '' ? form.subcategoria_id : null,
                disponible: form.disponible,
                destacado: form.destacado,
                aplicaciones: form.aplicaciones ? form.aplicaciones.split(',').map(s => s.trim()).filter(Boolean) : [],
                certificaciones: form.certificaciones ? form.certificaciones.split(',').map(s => s.trim()).filter(Boolean) : [],
                especificaciones: especificaciones.filter(e => e.propiedad.trim() !== ''),
            }

            let newId = editingId

            if (editingId) {
                const { error } = await (supabase.from('productos') as any).update(payload).eq('id', editingId)
                if (error) throw error
            } else {
                const { data: inserted, error } = await (supabase.from('productos') as any).insert(payload).select('id').single()
                if (error) throw error
                newId = (inserted as any).id
            }

            if (!editingId && newId) {
                setEditingId(newId)
                showToast('Producto creado. Ahora puedes subir imágenes.', 'success')
                await loadData() // Recargar para tener el ID actualizado en la lista
            } else {
                resetForm()
                await loadData()
                showToast('Producto actualizado correctamente', 'success')
            }

        } catch (err: unknown) {
            showToast('Error al guardar el producto', 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        const confirmed = await confirmAction('¿Estás seguro de eliminar este producto? Se eliminarán también sus imágenes.')
        if (!confirmed) return

        const supabase = createSupabaseClient()
        const { error } = await (supabase.from('productos') as any).delete().eq('id', id)
        if (error) {
            showToast('Error al eliminar el producto', 'error')
        } else {
            showToast('Producto eliminado correctamente', 'success')
            await loadData()
        }
    }

    // Gestión de Imágenes
    const handleSetPrincipal = async (imagenId: string) => {
        if (!editingId) return
        const supabase = createSupabaseClient()

        // 1. Quitar principal de todas
        await (supabase.from('producto_imagenes') as any).update({ es_principal: false }).eq('producto_id', editingId)

        // 2. Poner principal a la seleccionada
        const { error } = await (supabase.from('producto_imagenes') as any).update({ es_principal: true }).eq('id', imagenId)

        if (error) {
            showToast('Error al actualizar imagen principal', 'error')
        } else {
            showToast('Imagen principal actualizada', 'success')
            loadData()
        }
    }

    const handleDeleteImage = async (imagenId: string) => {
        const confirmed = await confirmAction('¿Borrar esta imagen?')
        if (!confirmed) return

        const supabase = createSupabaseClient()
        const { error } = await (supabase.from('producto_imagenes') as any).delete().eq('id', imagenId)
        if (error) {
            showToast('Error al borrar imagen', 'error')
        } else {
            showToast('Imagen borrada correctamente', 'success')
            loadData()
        }
    }

    const filteredProducts = productos.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" /></div>
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text" placeholder="Buscar productos..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    />
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true) }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-all"
                >
                    <Plus size={18} /> Nuevo Producto
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                    <h3 className="font-bold text-primary text-lg mb-4">
                        {editingId ? 'Editar Producto' : 'Nuevo Producto'}
                    </h3>

                    {/* Tabs / Secciones */}
                    <div className="space-y-6">
                        {/* Datos Básicos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Nombre *</label>
                                <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value, slug: toSlug(e.target.value) })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Slug</label>
                                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Categoría</label>
                                <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
                                    <option value="">Seleccionar</option>
                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Subcategoría</label>
                                <select value={form.subcategoria_id} onChange={(e) => setForm({ ...form, subcategoria_id: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
                                    <option value="">Seleccionar</option>
                                    {subcategorias.filter(s => !form.categoria_id || s.categoria_id === form.categoria_id).map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Descripciones */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Descripción corta</label>
                                <textarea rows={2} value={form.descripcion_corta} onChange={(e) => setForm({ ...form, descripcion_corta: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Descripción detallada</label>
                                <textarea rows={3} value={form.descripcion_detallada} onChange={(e) => setForm({ ...form, descripcion_detallada: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
                            </div>
                        </div>

                        {/* Listas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Aplicaciones (separadas por coma)</label>
                                <input type="text" value={form.aplicaciones} onChange={(e) => setForm({ ...form, aplicaciones: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" placeholder="Minería, Agricultura, ..." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Certificaciones (separadas por coma)</label>
                                <input type="text" value={form.certificaciones} onChange={(e) => setForm({ ...form, certificaciones: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" placeholder="ISO 9001, ASTM, ..." />
                            </div>
                        </div>

                        {/* Especificaciones */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-primary">Especificaciones Técnicas</label>
                                <button
                                    type="button"
                                    onClick={() => setEspecificaciones([...especificaciones, { propiedad: '', valor: '', unidad: '' }])}
                                    className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-dark transition-colors"
                                >
                                    <PlusCircle size={14} /> Agregar
                                </button>
                            </div>
                            {especificaciones.length > 0 ? (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-[1fr_1fr_80px_32px] gap-2 text-xs font-semibold text-gray-500 px-1">
                                        <span>Propiedad</span>
                                        <span>Valor</span>
                                        <span>Unidad</span>
                                        <span></span>
                                    </div>
                                    {especificaciones.map((spec, index) => (
                                        <div key={index} className="grid grid-cols-[1fr_1fr_80px_32px] gap-2 items-center">
                                            <input
                                                type="text" placeholder="Ej: Resistencia" value={spec.propiedad}
                                                onChange={(e) => {
                                                    const updated = [...especificaciones]
                                                    updated[index] = { ...updated[index], propiedad: e.target.value }
                                                    setEspecificaciones(updated)
                                                }}
                                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                                            />
                                            <input
                                                type="text" placeholder="Ej: 200" value={spec.valor}
                                                onChange={(e) => {
                                                    const updated = [...especificaciones]
                                                    updated[index] = { ...updated[index], valor: e.target.value }
                                                    setEspecificaciones(updated)
                                                }}
                                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                                            />
                                            <input
                                                type="text" placeholder="kN/m" value={spec.unidad}
                                                onChange={(e) => {
                                                    const updated = [...especificaciones]
                                                    updated[index] = { ...updated[index], unidad: e.target.value }
                                                    setEspecificaciones(updated)
                                                }}
                                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setEspecificaciones(especificaciones.filter((_, i) => i !== index))}
                                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic px-1">Sin especificaciones. Haz clic en "Agregar" para añadir una.</p>
                            )}
                        </div>

                        {/* Galería de Imágenes */}
                        <div className="border-t border-gray-100 pt-6">
                            <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                                <ImageIcon size={20} className="text-accent" /> Galería de Imágenes
                            </h4>

                            {editingId ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Uploader */}
                                    <div>
                                        <ImageUploader
                                            tipo="producto"
                                            entidadId={editingId}
                                            onUploadComplete={loadData}
                                        />
                                        <p className="text-xs text-gray-400 mt-2 text-center">
                                            Sube imágenes de alta calidad para la galería del producto.
                                        </p>
                                    </div>

                                    {/* Lista de Imágenes */}
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                        {imagenes.length === 0 ? (
                                            <p className="text-sm text-gray-400 italic text-center py-8">No hay imágenes subidas.</p>
                                        ) : (
                                            imagenes.map((img) => (
                                                <div key={img.id} className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg bg-gray-50">
                                                    <div className="relative w-16 h-16 bg-white rounded-md overflow-hidden border border-gray-200 shrink-0">
                                                        {img.url_publica && <Image src={img.url_publica} alt="Imagen producto" fill className="object-cover" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        {img.es_principal && (
                                                            <span className="text-xs font-bold text-accent uppercase tracking-wider">Principal</span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleSetPrincipal(img.id)}
                                                            disabled={img.es_principal}
                                                            className={`p-1.5 rounded-lg transition-colors ${img.es_principal ? 'text-yellow-400 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                                                            title="Marcar como principal"
                                                        >
                                                            <Star size={16} fill={img.es_principal ? "currentColor" : "none"} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteImage(img.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Eliminar imagen"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                                    <AlertCircle size={18} className="text-amber-500 shrink-0" />
                                    <p className="text-sm text-amber-700">
                                        Primero guarda el producto con <strong>&quot;Crear&quot;</strong> para poder subir imágenes a la galería.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.disponible} onChange={(e) => setForm({ ...form, disponible: e.target.checked })} className="w-4 h-4 accent-accent" />
                                <span className="text-sm font-medium">Disponible</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.destacado} onChange={(e) => setForm({ ...form, destacado: e.target.checked })} className="w-4 h-4 accent-accent" />
                                <span className="text-sm font-medium">Destacado</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                        <button onClick={handleSave} disabled={saving || !form.nombre}
                            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-all disabled:opacity-50">
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                            {editingId ? 'Actualizar' : 'Crear'}
                        </button>
                        <button onClick={resetForm} className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface border-b border-gray-200">
                                <th className="text-left px-5 py-3 font-semibold text-primary">Producto</th>
                                <th className="text-left px-5 py-3 font-semibold text-primary hidden md:table-cell">Categoría</th>
                                <th className="text-center px-5 py-3 font-semibold text-primary">Estado</th>
                                <th className="text-right px-5 py-3 font-semibold text-primary">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => {
                                const mainImage = product.producto_imagenes?.find(i => i.es_principal) || product.producto_imagenes?.[0]
                                return (
                                    <tr key={product.id} className="border-b border-gray-100 hover:bg-surface/50">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {mainImage?.url_publica && (
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                        <Image src={mainImage.url_publica} alt={product.nombre} fill className="object-cover" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-medium text-primary truncate">{product.nombre}</p>
                                                    <p className="text-text-muted text-xs truncate">{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className="text-text-muted">{product.categorias?.nombre || '—'}</span>
                                            {product.subcategorias?.nombre && (
                                                <span className="text-xs text-gray-400 block">{product.subcategorias.nombre}</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${product.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.disponible ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(product.id)}
                                                    className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-all" title="Editar">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all" title="Eliminar">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-5 py-12 text-center text-text-muted">
                                        No se encontraron productos
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
