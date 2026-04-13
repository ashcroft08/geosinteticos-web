import { fetchContactoInfo } from '@/lib/data/configuracion'
import ContactFormClient from '@/components/public/ContactFormClient'

export const metadata = {
    title: 'Contacto | GeoSintéticos Industrial',
    description: 'Contáctanos para cotizaciones y consultas sobre nuestros productos y servicios de geosintéticos.',
}

export const revalidate = 60

export default async function ContactoPage() {
    const contacto = await fetchContactoInfo()

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="text-accent font-semibold text-sm tracking-wider uppercase">Contáctanos</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mt-3 mb-4">¿Cómo podemos ayudarte?</h2>
                    <p className="text-text-muted text-lg">Completa el formulario y nos comunicaremos contigo a la brevedad.</p>
                </div>
                <ContactFormClient contacto={contacto} />
            </div>
        </section>
    )
}
