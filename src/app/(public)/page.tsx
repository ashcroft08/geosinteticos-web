import Link from 'next/link'
import Image from 'next/image'
import { Info, Users, Target, Shield, ArrowRight } from 'lucide-react'
import { fetchProyectos as getProyectos } from '@/lib/data/proyectos'
import { fetchEstadisticas as getEstadisticas, fetchEmpresaInfo, fetchBannerInicio } from '@/lib/data/configuracion'

export default async function HomePage() {
    const [proyectos, estadisticas, empresa, bannerUrl] = await Promise.all([
        getProyectos(),
        getEstadisticas(),
        fetchEmpresaInfo(),
        fetchBannerInicio()
    ])

    // Filtrar destacados y limitar a 3
    const featuredProjects = proyectos.filter((p) => p.destacado).slice(0, 3)

    return (
        <>
            {/* ===== HERO ===== */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={bannerUrl}
                        alt="Proyecto industrial"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
                    <div className="max-w-2xl animate-fade-in-up">
                        <span className="inline-block px-4 py-1.5 bg-accent text-white text-sm font-semibold rounded-full mb-6 backdrop-blur-sm border border-accent/30">
                            Soluciones de Impermeabilización
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            <span className="text-accent">INDUSTRIAL</span>
                            <br />
                            Calidad que Supera
                            <br />
                            Cada Desafío
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed max-w-xl">
                            Cuando parece no haber suficiente tiempo para hacerlo bien, recuerda que siempre hay tiempo para la investigación correcta y soluciones duraderas.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/contacto"
                                className="inline-flex items-center px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg hover:shadow-xl text-lg"
                            >
                                Solicitar Cotización
                            </Link>
                            <Link
                                href="/proyectos"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 text-lg"
                            >
                                Ver Proyectos <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-accent font-semibold text-sm tracking-wider uppercase">
                            NUESTRO OBJETIVO — CERO ACCIDENTES
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mt-3 mb-4">
                            LA SEGURIDAD ES ÉXITO POR PROPÓSITO, NO POR ACCIDENTE
                        </h2>
                        <p className="text-text-muted text-lg">
                            Nunca pienses que trabajar de forma segura es en vano cuando podría salvar toda una vida de dolor.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Info size={30} />, title: 'Ideas Industriales', desc: 'Ignorar una advertencia puede causar grandes problemas' },
                            { icon: <Users size={30} />, title: 'Ingenieros Expertos', desc: 'Si vas a ser imprudente, mejor que seas enseñado' },
                            { icon: <Target size={30} />, title: 'Equipamiento Moderno', desc: 'La vida no comenzó por accidente; no la termines como uno' },
                            { icon: <Shield size={30} />, title: 'Soporte de Proyectos', desc: 'Haz de tu planta la mejor, más segura que el resto' },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="group p-8 bg-surface rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 cursor-default border border-gray-100 hover:border-primary hover:shadow-xl"
                            >
                                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-5 text-accent group-hover:bg-accent group-hover:text-primary transition-all">
                                    {feature.icon}
                                </div>
                                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                                <p className="text-text-muted group-hover:text-gray-300 text-sm leading-relaxed transition-colors">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== MISSION ===== */}
            <section className="py-20 bg-surface">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                        <Target size={28} />
                    </div>
                    <span className="text-accent font-semibold text-sm tracking-wider uppercase">Nuestra Misión</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mt-3 mb-4">
                        {empresa.mision}
                    </h2>
                    <p className="text-text-muted text-lg">Los récords de seguridad no suceden por accidente</p>
                </div>
            </section>

            {/* ===== STATS ===== */}
            <section className="py-16 bg-primary">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        {estadisticas.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-accent text-4xl md:text-5xl font-bold mb-2">{stat.numero}</div>
                                <div className="text-gray-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURED PROJECTS ===== */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-accent font-semibold text-sm tracking-wider uppercase">Portafolio</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mt-3 mb-4">
                            Proyectos Destacados
                        </h2>
                        <p className="text-text-muted text-lg">
                            Conoce algunos de nuestros proyectos más emblemáticos en minería, agricultura e infraestructura.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredProjects.map((project) => (
                            <Link
                                key={project.slug}
                                href={`/proyectos/${project.slug}`}
                                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 aspect-[4/3]"
                            >
                                <Image
                                    src={project.imagenes_estructuradas?.general || project.imagenes_estructuradas?.antes || project.imagenes_estructuradas?.durante || '/placeholder.svg'}
                                    alt={project.titulo}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold rounded-full mb-3">
                                        {project.tipo_obra}
                                    </span>
                                    <h3 className="text-white font-bold text-xl mb-1">{project.titulo}</h3>
                                    <p className="text-gray-300 text-sm">{project.ciudad}, {project.region}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link
                            href="/proyectos"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-all text-lg"
                        >
                            Ver Todos los Proyectos <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="py-20 bg-gradient-to-r from-primary to-primary-light">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        ¿Tienes un proyecto en mente?
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        Nuestro equipo de expertos está listo para asesorarte y brindarte la mejor solución para tu proyecto.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contacto"
                            className="inline-flex items-center px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-lg text-lg"
                        >
                            Contáctanos Ahora
                        </Link>
                        <a
                            href="https://wa.me/51999999999"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 text-lg"
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}
