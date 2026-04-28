import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook } from 'lucide-react'
import { fetchContactoInfo } from '@/lib/data/configuracion'

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

export default async function Footer() {
    const contacto = await fetchContactoInfo()

    return (
        <footer className="bg-primary text-white">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/Logo.png"
                                alt="Geomembrana & Geosintéticos"
                                width={44}
                                height={44}
                                className="rounded-lg"
                            />
                            <div className="leading-tight">
                                <span className="font-bold text-lg tracking-wide">GEOMEMBRANA</span>
                                <span className="block text-xs text-accent font-semibold tracking-[0.2em]">& Geosintéticos</span>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Más de 25 años brindando soluciones de impermeabilización de alta calidad para proyectos de minería, agricultura, construcción y medio ambiente.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://www.facebook.com/instalacion.geomembrana.79?mibextid=rS40aB7S9Ucbxw6v" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                                <Facebook size={16} />
                            </a>
                            <a href="https://www.tiktok.com/@geomembrana.geosi5?_r=1&_t=ZS-95ZZE2mUATK" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                                <TikTokIcon size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Enlaces */}
                    <div>
                        <h4 className="font-semibold text-accent mb-4">Enlaces</h4>
                        <div className="flex flex-col gap-2">
                            {[
                                { href: '/', label: 'Inicio' },
                                { href: '/nosotros', label: 'Nosotros' },
                                { href: '/servicios', label: 'Servicios' },
                                { href: '/productos', label: 'Productos' },
                                { href: '/proyectos', label: 'Proyectos' },
                            ].map((link) => (
                                <Link key={link.href} href={link.href} className="text-gray-400 hover:text-accent transition-colors text-sm">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Productos */}
                    <div>
                        <h4 className="font-semibold text-accent mb-4">Productos</h4>
                        <div className="flex flex-col gap-2">
                            {['Geomembranas', 'Geotextiles', 'Geodrenes', 'Liners de Piscina', 'Accesorios'].map((item) => (
                                <Link key={item} href="/productos" className="text-gray-400 hover:text-accent transition-colors text-sm">
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 className="font-semibold text-accent mb-4">Contacto</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm text-gray-400">
                                <MapPin size={18} className="shrink-0 mt-0.5" />
                                <span>{contacto.direccion}</span>
                            </div>
                            <a href={`tel:${contacto.telefono.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-accent transition-colors">
                                <Phone size={18} className="shrink-0" />
                                <span>{contacto.telefono}</span>
                            </a>
                            <a href={`mailto:${contacto.email}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-accent transition-colors">
                                <Mail size={18} className="shrink-0" />
                                <span>{contacto.email}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-white/10 mt-8">
                <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-center md:text-left text-gray-500 text-sm">
                        © {new Date().getFullYear()} Geomembrana & Geosintéticos. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <Link href="/privacidad" className="text-sm text-gray-400 hover:text-accent transition-colors">
                            Política de Privacidad
                        </Link>
                        <Link href="/terminos" className="text-sm text-gray-400 hover:text-accent transition-colors">
                            Términos y Condiciones
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

