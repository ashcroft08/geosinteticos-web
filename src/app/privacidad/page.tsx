import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Política de Privacidad — GeoSintéticos',
    description: 'Nuestra política de privacidad y manejo de datos.',
}

export default function PrivacidadPage() {
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
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-8">Política de Privacidad</h1>

                    <p className="text-text-muted leading-relaxed mb-6 font-medium">
                        Última actualización: 23 de febrero de 2026
                    </p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                            1. Información que recopilamos
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            En G&G (Geomembrana y Geosintéticos), recopilamos información personal que usted nos proporciona voluntariamente al interactuar con nuestro sitio web, específicamente al llenar nuestro formulario de contacto o solicitar una cotización. Esta información puede incluir:
                        </p>
                        <ul className="list-disc list-inside text-text-muted leading-relaxed mb-4 space-y-2 ml-4">
                            <li>Nombre completo.</li>
                            <li>Correo electrónico.</li>
                            <li>Número de teléfono (WhatsApp).</li>
                            <li>Detalles del proyecto o requerimientos específicos relacionados con geomembranas y geosintéticos.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                            2. Uso de la información
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            La información recopilada se utiliza exclusivamente para:
                        </p>
                        <ul className="list-disc list-inside text-text-muted leading-relaxed mb-4 space-y-2 ml-4">
                            <li>Procesar sus solicitudes de cotización para instalación o reparación.</li>
                            <li>Contactarlo para brindarle asesoría técnica a través de nuestros especialistas.</li>
                            <li>Mejorar la atención al cliente y la experiencia en nuestro sitio web.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                            3. Protección de sus datos
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra accesos no autorizados, pérdida o alteración. Sus datos son almacenados en bases de datos seguras y solo el personal autorizado (administradores y técnicos) tiene acceso a ellos para la gestión de proyectos y leads.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                            4. Compartir información con terceros
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            No vendemos, comercializamos ni transferimos a terceros su información personal. Esto no incluye a los proveedores de servicios de alojamiento web (hosting) o gestión de bases de datos que nos asisten en la operación del sitio, siempre que dichas partes acuerden mantener esta información confidencial.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                            5. Sus derechos
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            Usted tiene derecho a solicitar el acceso, rectificación o eliminación de sus datos personales de nuestros registros en cualquier momento. Para ello, puede contactarnos a través de los canales oficiales.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                            6. Contacto
                        </h2>
                        <p className="text-text-muted leading-relaxed mb-4">
                            Si tiene alguna pregunta sobre esta Política de Privacidad, puede contactarnos en:
                        </p>
                        <ul className="list-disc list-inside text-text-muted leading-relaxed mb-4 space-y-2 ml-4">
                            <li><strong>Teléfonos:</strong> 099 516 9681 / 099 242 7557 / 098 182 6766</li>
                            <li><strong>Correo electrónico:</strong> contacto@geosinteticos.com</li>
                        </ul>
                    </section>
                </article>
            </main>
        </div>
    )
}
