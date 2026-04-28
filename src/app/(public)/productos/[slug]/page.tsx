import { notFound } from 'next/navigation'
import { fetchProductoBySlug, fetchCategoryBySlug, fetchProductosPorCategoriaSlug } from '@/lib/data/productos'
import { fetchCatalogoUrl } from '@/lib/data/configuracion'
import ProductView from '@/components/public/ProductView'
import CategoryView from '@/components/public/CategoryView'

interface Props {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://geosinteticos.com.ec'

    // 1. Intentar buscar como producto
    const producto = await fetchProductoBySlug(slug)
    if (producto) {
        const imagenPrincipal = producto.imagenes.find(i => i.es_principal)?.url_publica
            || producto.imagenes[0]?.url_publica
            || `${siteUrl}/Logo.png`

        return {
            title: `${producto.nombre} | G&G Geosintéticos`,
            description: producto.descripcion_corta || `${producto.nombre} — Soluciones profesionales en geosintéticos`,
            openGraph: {
                title: producto.nombre,
                description: producto.descripcion_corta || `${producto.nombre} — Soluciones profesionales en geosintéticos`,
                url: `${siteUrl}/productos/${slug}`,
                siteName: 'G&G Geosintéticos',
                type: 'website',
                locale: 'es_EC',
                images: [
                    {
                        url: imagenPrincipal,
                        width: 1200,
                        height: 630,
                        alt: producto.nombre,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: producto.nombre,
                description: producto.descripcion_corta || `${producto.nombre} — Soluciones profesionales en geosintéticos`,
                images: [imagenPrincipal],
            },
        }
    }

    // 2. Intentar buscar como categoría
    const category = await fetchCategoryBySlug(slug)
    if (category) {
        return {
            title: `${category.nombre} | G&G Geosintéticos`,
            description: category.descripcion || `Productos de la categoría ${category.nombre}`,
            openGraph: {
                title: category.nombre,
                description: category.descripcion || `Productos de la categoría ${category.nombre}`,
                url: `${siteUrl}/productos/${slug}`,
                siteName: 'G&G Geosintéticos',
                type: 'website',
                locale: 'es_EC',
                images: [{ url: `${siteUrl}/Logo.png`, width: 800, height: 600, alt: 'G&G Logo' }],
            },
        }
    }

    return { title: 'No encontrado' }
}

export default async function Page({ params }: Props) {
    const { slug } = await params
    const catalogoUrl = await fetchCatalogoUrl()

    // 1. Intentar buscar como producto
    const producto = await fetchProductoBySlug(slug)
    if (producto) {
        return <ProductView producto={producto} catalogoUrl={catalogoUrl} />
    }

    // 2. Intentar buscar como categoría
    const category = await fetchCategoryBySlug(slug)
    if (category) {
        const products = await fetchProductosPorCategoriaSlug(slug)
        return <CategoryView categoria={category} productos={products} />
    }

    // 3. 404
    notFound()
}
