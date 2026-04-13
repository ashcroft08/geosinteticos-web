'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Package, FolderKanban, MessageSquare, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
    totalProductos: number
    totalProyectos: number
    totalLeads: number
    leadsNuevos: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProductos: 0,
        totalProyectos: 0,
        totalLeads: 0,
        leadsNuevos: 0,
    })
    const [recentLeads, setRecentLeads] = useState<Array<{
        id: string
        nombre: string
        email: string
        producto_nombre: string | null
        estado: string
        created_at: string
    }>>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        try {
            const supabase = createSupabaseClient()

            const [productosRes, proyectosRes, leadsRes, leadsNuevosRes, recentRes] = await Promise.all([
                (supabase.from('productos') as any).select('id', { count: 'exact', head: true }),
                (supabase.from('proyectos') as any).select('id', { count: 'exact', head: true }),
                (supabase.from('leads') as any).select('id', { count: 'exact', head: true }),
                (supabase.from('leads') as any).select('id', { count: 'exact', head: true }).eq('estado', 'nuevo'),
                (supabase.from('leads') as any).select('id, nombre, email, producto_nombre, estado, created_at').order('created_at', { ascending: false }).limit(5),
            ])

            setStats({
                totalProductos: productosRes.count || 0,
                totalProyectos: proyectosRes.count || 0,
                totalLeads: leadsRes.count || 0,
                leadsNuevos: leadsNuevosRes.count || 0,
            })

            setRecentLeads((recentRes.data || []) as Array<{ id: string; nombre: string; email: string; producto_nombre: string | null; estado: string; created_at: string }>)
        } catch {
            setError('Error al cargar el dashboard')
        } finally {
            setLoading(false)
        }
    }

    const estadoColor: Record<string, string> = {
        nuevo: 'bg-blue-100 text-blue-700',
        contactado: 'bg-yellow-100 text-yellow-700',
        cotizado: 'bg-purple-100 text-purple-700',
        cerrado: 'bg-green-100 text-green-700',
        descartado: 'bg-gray-100 text-gray-600',
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
                <AlertCircle size={24} className="text-red-500" />
                <p className="text-red-700">{error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Productos', value: stats.totalProductos, icon: Package, href: '/admin/productos', color: 'bg-blue-500' },
                    { label: 'Proyectos', value: stats.totalProyectos, icon: FolderKanban, href: '/admin/proyectos', color: 'bg-green-500' },
                    { label: 'Total Leads', value: stats.totalLeads, icon: MessageSquare, href: '/admin/leads', color: 'bg-purple-500' },
                    { label: 'Leads Nuevos', value: stats.leadsNuevos, icon: TrendingUp, href: '/admin/leads', color: 'bg-accent' },
                ].map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-primary">{stat.value}</p>
                            <p className="text-text-muted text-sm mt-1">{stat.label}</p>
                        </Link>
                    )
                })}
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="font-bold text-primary text-lg">Leads Recientes</h3>
                    <Link href="/admin/leads" className="text-accent hover:underline text-sm font-medium">
                        Ver todos →
                    </Link>
                </div>
                {recentLeads.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {recentLeads.map((lead) => (
                            <div key={lead.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface/50 transition-colors">
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-primary truncate">{lead.nombre}</p>
                                    <p className="text-text-muted text-sm truncate">{lead.email}</p>
                                </div>
                                {lead.producto_nombre && (
                                    <span className="hidden md:inline-block px-3 py-1 bg-surface text-text-muted text-xs rounded-full mx-4 truncate max-w-[200px]">
                                        {lead.producto_nombre}
                                    </span>
                                )}
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColor[lead.estado] || 'bg-gray-100'}`}>
                                        {lead.estado}
                                    </span>
                                    <span className="text-text-muted text-xs flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(lead.created_at).toLocaleDateString('es-PE')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-text-muted">
                        <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
                        <p>No hay leads registrados todavía</p>
                    </div>
                )}
            </div>
        </div>
    )
}
