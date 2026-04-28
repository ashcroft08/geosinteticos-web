'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Phone, Mail, Facebook, Menu, X, Search, Loader2, Package, FolderKanban } from 'lucide-react'

/** Ícono SVG de TikTok – lucide-react no incluye este ícono */
function TikTokIcon({ size = 16 }: { size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.17a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.6z" />
        </svg>
    )
}

const FACEBOOK_URL = 'https://www.facebook.com/instalacion.geomembrana.79?mibextid=rS40aB7S9Ucbxw6v'
const TIKTOK_URL = 'https://www.tiktok.com/@geomembrana.geosi5?_r=1&_t=ZS-95ZZE2mUATK'

const NAV_LINKS = [
    { href: '/', label: 'Inicio' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/productos', label: 'Productos' },
    { href: '/proyectos', label: 'Proyectos' },
    { href: '/contacto', label: 'Contacto' },
]

interface HeaderContacto {
    telefono: string
    email: string
}

interface SearchResult {
    productos: Array<{ slug: string; nombre: string; descripcion: string; imagen: string | null }>
    proyectos: Array<{ slug: string; titulo: string; tipo_obra: string; ubicacion: string; imagen: string | null }>
}

/** Debounce helper — evita disparar la búsqueda en cada tecla */
function useDebounce() {
    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

    return (callback: () => void, delay: number) => {
        if (timer) clearTimeout(timer)
        setTimer(setTimeout(callback, delay))
    }
}

export default function Header({ contacto }: { contacto: HeaderContacto }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
    const [searchLoading, setSearchLoading] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const debounce = useDebounce()

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query)

        if (query.trim().length < 2) {
            setSearchResults(null)
            setSearchLoading(false)
            return
        }

        setSearchLoading(true)
        debounce(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
                if (res.ok) {
                    const data = await res.json()
                    setSearchResults(data)
                }
            } catch {
                setSearchResults(null)
            } finally {
                setSearchLoading(false)
            }
        }, 300)
    }

    const closeSearch = () => {
        setSearchOpen(false)
        setSearchQuery('')
        setSearchResults(null)
    }

    const navigateTo = (href: string) => {
        closeSearch()
        setMobileMenuOpen(false)
        router.push(href)
    }

    const totalResults = (searchResults?.productos.length || 0) + (searchResults?.proyectos.length || 0)

    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Top Bar */}
            <div className="bg-primary text-white text-sm hidden md:block">
                <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <a href={`tel:${contacto.telefono.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                            <Phone size={14} />
                            <span>{contacto.telefono}</span>
                        </a>
                        <a href={`mailto:${contacto.email}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                            <Mail size={14} />
                            <span>{contacto.email}</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-accent transition-colors"><Facebook size={16} /></a>
                        <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-accent transition-colors"><TikTokIcon size={16} /></a>
                    </div>
                </div>
            </div>

            {/* Main Nav */}
            <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image
                            src="/Logo.png"
                            alt="Geomembrana & Geosintéticos"
                            width={44}
                            height={44}
                            className="rounded-lg transition-transform group-hover:scale-110"
                        />
                        <div className="leading-tight">
                            <span className="font-bold text-primary text-lg tracking-wide">GEOMEMBRANA</span>
                            <span className="block text-xs text-accent font-semibold tracking-[0.2em]">& Geosintéticos</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.href)
                                    ? 'bg-accent text-white'
                                    : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Search + CTA + Mobile Toggle */}
                    <div className="flex items-center gap-2">
                        {/* Search Toggle */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-primary"
                            aria-label="Buscar"
                        >
                            <Search size={20} />
                        </button>

                        <Link
                            href="/contacto"
                            className="hidden md:inline-flex items-center px-5 py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-all shadow-sm hover:shadow-md text-sm"
                        >
                            Cotizar
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Menú"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== SEARCH BAR EXPANDIBLE ===== */}
            {searchOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                        onClick={closeSearch}
                    />
                    {/* Search Panel */}
                    <div className="absolute top-full left-0 w-full z-50 bg-white shadow-2xl border-b border-gray-200">
                        <div className="max-w-3xl mx-auto px-4 py-4">
                            {/* Input */}
                            <div className="relative">
                                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Buscar productos, proyectos..."
                                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all"
                                />
                                {searchLoading && (
                                    <Loader2 size={20} className="absolute right-12 top-1/2 -translate-y-1/2 text-accent animate-spin" />
                                )}
                                <button
                                    onClick={closeSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Results */}
                            {searchResults && searchQuery.length >= 2 && (
                                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                                    {totalResults === 0 ? (
                                        <div className="text-center py-8 text-gray-400">
                                            <Search size={32} className="mx-auto mb-2" />
                                            <p className="text-sm">No se encontraron resultados para &quot;{searchQuery}&quot;</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Productos */}
                                            {searchResults.productos.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                        <Package size={14} /> Productos
                                                    </p>
                                                    <div className="space-y-1">
                                                        {searchResults.productos.map((p) => (
                                                            <button
                                                                key={p.slug}
                                                                onClick={() => navigateTo(`/productos/${p.slug}`)}
                                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                                                            >
                                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 relative">
                                                                    {p.imagen ? (
                                                                        <Image
                                                                            src={p.imagen}
                                                                            alt={p.nombre}
                                                                            fill
                                                                            sizes="48px"
                                                                            className="object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                            <Package size={20} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="font-semibold text-primary text-sm truncate group-hover:text-accent transition-colors">
                                                                        {p.nombre}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 truncate">
                                                                        {p.descripcion}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Proyectos */}
                                            {searchResults.proyectos.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                        <FolderKanban size={14} /> Proyectos
                                                    </p>
                                                    <div className="space-y-1">
                                                        {searchResults.proyectos.map((p) => (
                                                            <button
                                                                key={p.slug}
                                                                onClick={() => navigateTo(`/proyectos/${p.slug}`)}
                                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                                                            >
                                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 relative">
                                                                    {p.imagen ? (
                                                                        <Image
                                                                            src={p.imagen}
                                                                            alt={p.titulo}
                                                                            fill
                                                                            sizes="48px"
                                                                            className="object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                            <FolderKanban size={20} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="font-semibold text-primary text-sm truncate group-hover:text-accent transition-colors">
                                                                        {p.titulo}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 truncate">
                                                                        {p.tipo_obra}{p.ubicacion ? ` — ${p.ubicacion}` : ''}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Hint */}
                            {searchQuery.length < 2 && (
                                <p className="text-center text-xs text-gray-400 mt-3">
                                    Escribe al menos 2 caracteres para buscar
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <nav className="fixed top-0 right-0 w-80 h-full bg-white z-50 shadow-2xl lg:hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="font-bold text-primary">Menú</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Mobile Search */}
                        <div className="px-4 py-3 border-b">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                                    onChange={(e) => {
                                        const q = e.target.value
                                        if (q.trim().length >= 2) {
                                            setMobileMenuOpen(false)
                                            setSearchOpen(true)
                                            setSearchQuery(q)
                                            handleSearch(q)
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col p-4 gap-1 flex-1">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg font-medium transition-all ${isActive(link.href)
                                        ? 'bg-accent text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className="p-4 border-t">
                            <Link
                                href="/contacto"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-center px-5 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-all"
                            >
                                Solicitar Cotización
                            </Link>
                        </div>
                    </nav>
                </>
            )}
        </header>
    )
}
