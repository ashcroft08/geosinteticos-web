import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, MapPin, User, CheckCircle2 } from 'lucide-react'
import { fetchProyectoBySlug } from '@/lib/data/proyectos'
import ProjectGallery from '@/components/public/ProjectGallery'

interface Props {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const proyecto = await fetchProyectoBySlug(slug)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geosinteticos.com.ec'

    if (!proyecto) return { title: 'Proyecto no encontrado' }

    const imagenPrincipal =
        proyecto.imagenes_estructuradas?.general ||
        proyecto.imagenes_estructuradas?.antes ||
        proyecto.imagenes_estructuradas?.durante ||
        `${siteUrl}/Logo.png`

    const descripcion = proyecto.reto || `${proyecto.titulo} — Proyecto ejecutado por G&G Geosintéticos`

    return {
        title: `${proyecto.titulo} | G&G Geosintéticos`,
        description: descripcion,
        openGraph: {
            title: proyecto.titulo,
            description: descripcion,
            url: `${siteUrl}/proyectos/${slug}`,
            siteName: 'G&G Geosintéticos',
            type: 'article',
            locale: 'es_EC',
            images: [
                {
                    url: imagenPrincipal,
                    width: 1200,
                    height: 630,
                    alt: proyecto.titulo,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: proyecto.titulo,
            description: descripcion,
            images: [imagenPrincipal],
        },
    }
}

export default async function ProyectoPage({ params }: Props) {
    const { slug } = await params
    const proyecto = await fetchProyectoBySlug(slug)

    if (!proyecto) {
        notFound()
    }

    // Encontrar imagen principal
    const imagenPrincipal =
        proyecto.imagenes_estructuradas?.general ||
        proyecto.imagenes_estructuradas?.antes ||
        proyecto.imagenes_estructuradas?.durante ||
        '/placeholder.svg'

    // Filtrar otras imágenes para la galería (solo URLs válidas)
    const galeriaUrls = Object.values(proyecto.imagenes_estructuradas || {}).filter(url => typeof url === 'string' && url !== imagenPrincipal)
    const galeria = galeriaUrls.map(url => ({
        url_publica: url,
        descripcion: null
    }))

    return (
        <article className="bg-white min-h-screen pb-20">
            {/* Hero Image */}
            <div className="relative h-[60vh] min-h-[400px]">
                {imagenPrincipal && (
                    <Image
                        src={imagenPrincipal}
                        alt={proyecto.titulo}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                <div className="absolute inset-0 flex flex-col justify-end pb-12 sm:pb-20">
                    <div className="max-w-7xl mx-auto px-4 w-full">
                        <Link
                            href="/proyectos"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full w-fit"
                        >
                            <ArrowLeft size={18} /> Volver a Proyectos
                        </Link>
                        <span className="inline-block px-4 py-1.5 bg-accent text-white font-bold text-sm rounded-full mb-4">
                            {proyecto.tipo_obra}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl">
                            {proyecto.titulo}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-white/90 text-sm md:text-base font-medium">
                            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                                <User size={18} className="text-accent" />
                                {proyecto.cliente}
                            </div>
                            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                                <MapPin size={18} className="text-accent" />
                                {proyecto.ciudad}, {proyecto.region}
                            </div>
                            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                                <Calendar size={18} className="text-accent" />
                                {proyecto.fecha}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12 sm:mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Reto y Solución */}
                        <div className="grid gap-12">
                            <div>
                                <h2 className="text-2xl font-bold text-primary mb-4 border-l-4 border-accent pl-4">El Reto</h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {proyecto.reto}
                                </p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-primary mb-4 border-l-4 border-accent pl-4">La Solución</h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {proyecto.solucion}
                                </p>
                            </div>
                        </div>

                        {/* Galería Adicional */}
                        <ProjectGallery images={galeria} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Project Stats */}
                            <div className="bg-primary text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />

                                <h3 className="text-xl font-bold mb-6 text-accent relative">Resultados Clave</h3>
                                <div className="space-y-6 relative">
                                    {proyecto.metricas.map((metrica, i) => (
                                        <div key={i} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
                                            <div className="text-white/60 text-sm mb-1">{metrica.indicador}</div>
                                            <div className="text-2xl font-bold">{metrica.valor}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                                <h3 className="text-xl font-bold text-primary mb-4">¿Proyecto Similar?</h3>
                                <p className="text-gray-600 mb-6 text-sm">
                                    Contamos con la experiencia y tecnología para ejecutar proyectos de alta complejidad.
                                </p>
                                <Link
                                    href="/contacto"
                                    className="block w-full text-center py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-all shadow-md hover:shadow-lg"
                                >
                                    Contactar Especialista
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}
