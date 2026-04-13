import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Términos y Condiciones — GeoSintéticos',
    description: 'Términos y condiciones de uso de nuestros servicios.',
}

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-surface">
            {/* Top decorative line */}
            <div className="h-2 w-full bg-accent" />

            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Navigation */}
                <div className="mb-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Volver al Inicio
                    </Link>
                </div>

                {/* Content */}
                <article className="prose prose-slate max-w-none">
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-8">Términos y Condiciones</h1>

                    <p className="text-text-muted leading-relaxed mb-6 font-medium">
                        Última actualización: 23 de febrero de 2026
                    </p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                            1. Aceptación de los Términos
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de los mismos, le rogamos que no utilice nuestros servicios web.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                            2. Servicios Ofrecidos
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            G&G ofrece servicios de instalación, reparación y asesoría técnica en geomembranas y geosintéticos. La información detallada en este sitio web tiene fines informativos y comerciales.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                            3. Cotizaciones y Precios
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            Las solicitudes de cotización enviadas a través de nuestro sitio web son de carácter preliminar. Los precios finales y la viabilidad del proyecto están sujetos a una evaluación técnica detallada por parte de nuestro equipo (Ingenieros e Instaladores), la cual puede requerir una visita en el sitio de la obra.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                            4. Propiedad Intelectual
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            Todo el contenido de este sitio web, incluyendo textos, gráficos, logotipos (G&G), imágenes de proyectos y código, es propiedad de Geomembrana y Geosintéticos y está protegido por las leyes de propiedad intelectual y derechos de autor aplicables en Ecuador.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                            5. Limitación de Responsabilidad
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            Nos esforzamos por mantener la información del sitio actualizada y correcta. Sin embargo, no garantizamos que el sitio esté libre de errores en todo momento. No seremos responsables por daños directos o indirectos derivados del uso de este sitio web.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                            6. Modificaciones
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
                        </p>
                    </section>
                </article>
            </main>
        </div>
    )
}
