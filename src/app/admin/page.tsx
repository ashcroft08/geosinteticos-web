'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Package, FolderKanban, MessageSquare, TrendingUp, Clock, AlertCircle, Eye, BarChart3, Trophy } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
    totalProductos: number
    totalProyectos: number
    totalLeads: number
    leadsNuevos: number
}

interface AnalyticsData {
    totalSemana: number
    totalHoy: number
    topProductos: Array<{ slug: string; nombre: string; vistas: number }>
    visitasPorDia: Array<{ fecha: string; visitas: number }>
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProductos: 0,
        totalProyectos: 0,
        totalLeads: 0,
        leadsNuevos: 0,
    })
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
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

            // Cargar analíticas de page_views
            try {
                const analyticsRes = await fetch('/api/page-views')
                if (analyticsRes.ok) {
                    const data = await analyticsRes.json()
                    setAnalytics(data)
                }
            } catch {
                // Si falla (tabla no existe aún), simplemente no mostramos analíticas
                console.warn('No se pudieron cargar las analíticas de visitas')
            }
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

    // Calcular máximo de visitas para la barra del gráfico
    const maxVisitas = analytics?.visitasPorDia
        ? Math.max(...analytics.visitasPorDia.map(d => d.visitas), 1)
        : 1

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

            {/* ===== SECCIÓN DE ANALÍTICAS ===== */}
            {analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Visitas de la Semana — Gráfico de barras */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                                    <BarChart3 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary">Visitas de la Semana</h3>
                                    <p className="text-text-muted text-xs">Últimos 7 días</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-primary">{analytics.totalSemana}</p>
                                <p className="text-xs text-text-muted">
                                    <span className="text-indigo-500 font-semibold">{analytics.totalHoy} hoy</span>
                                </p>
                            </div>
                        </div>

                        {/* Mini gráfico de barras */}
                        <div className="flex items-end gap-2 h-32">
                            {analytics.visitasPorDia.map((dia) => {
                                const heightPercent = maxVisitas > 0 ? (dia.visitas / maxVisitas) * 100 : 0
                                const fechaCorta = new Date(dia.fecha + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'short' })
                                return (
                                    <div key={dia.fecha} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-[10px] text-text-muted font-medium">
                                            {dia.visitas > 0 ? dia.visitas : ''}
                                        </span>
                                        <div
                                            className="w-full rounded-t-lg bg-indigo-100 hover:bg-indigo-200 transition-colors relative group"
                                            style={{ height: `${Math.max(heightPercent, 4)}%` }}
                                        >
                                            <div
                                                className="absolute inset-0 rounded-t-lg bg-indigo-500 transition-all"
                                                style={{ height: `${Math.max(heightPercent, 4)}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-text-muted capitalize">{fechaCorta}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Top 3 Productos más vistos */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-primary">Top Productos</h3>
                                <p className="text-text-muted text-xs">Más vistos esta semana</p>
                            </div>
                        </div>

                        {analytics.topProductos.length > 0 ? (
                            <div className="space-y-4">
                                {analytics.topProductos.map((producto, index) => {
                                    const medals = ['🥇', '🥈', '🥉']
                                    const barColors = ['bg-amber-500', 'bg-gray-400', 'bg-amber-700']
                                    const maxVistas = analytics.topProductos[0]?.vistas || 1
                                    const widthPercent = (producto.vistas / maxVistas) * 100

                                    return (
                                        <div key={producto.slug} className="group">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-lg shrink-0">{medals[index]}</span>
                                                    <Link
                                                        href={`/productos/${producto.slug}`}
                                                        className="text-sm font-medium text-primary truncate hover:text-accent transition-colors"
                                                    >
                                                        {producto.nombre}
                                                    </Link>
                                                </div>
                                                <div className="flex items-center gap-1 text-text-muted shrink-0 ml-2">
                                                    <Eye size={14} />
                                                    <span className="text-sm font-semibold">{producto.vistas}</span>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${barColors[index]} transition-all duration-500`}
                                                    style={{ width: `${widthPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-text-muted">
                                <Eye size={32} className="mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">Aún no hay datos de visitas</p>
                                <p className="text-xs mt-1">Las visitas se registrarán automáticamente</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

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
