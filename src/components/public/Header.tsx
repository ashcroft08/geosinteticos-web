'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone, Mail, Facebook, Instagram, Linkedin, Menu, X } from 'lucide-react'

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

export default function Header({ contacto }: { contacto: HeaderContacto }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

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
                        <a href="#" aria-label="Facebook" className="hover:text-accent transition-colors"><Facebook size={16} /></a>
                        <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors"><Instagram size={16} /></a>
                        <a href="#" aria-label="LinkedIn" className="hover:text-accent transition-colors"><Linkedin size={16} /></a>
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

                    {/* CTA + Mobile Toggle */}
                    <div className="flex items-center gap-3">
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
