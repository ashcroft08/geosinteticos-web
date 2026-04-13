import type { Metadata } from 'next'
import { AdminUIProvider } from '@/contexts/AdminUIContext'

export const metadata: Metadata = {
    title: 'Iniciar Sesión — GeoSintéticos Admin',
    robots: 'noindex, nofollow',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminUIProvider>
            {children}
        </AdminUIProvider>
    )
}
