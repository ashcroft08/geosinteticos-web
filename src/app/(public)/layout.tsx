import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import WhatsAppFloat from '@/components/public/WhatsAppFloat'
import { fetchContactoInfo } from '@/lib/data/configuracion'

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const contacto = await fetchContactoInfo()

    return (
        <>
            <Header contacto={{ telefono: contacto.telefono, email: contacto.email }} />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppFloat numero={contacto.whatsapp} />
        </>
    )
}
