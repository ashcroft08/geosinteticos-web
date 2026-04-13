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

    // 1. Intentar buscar como producto
    const producto = await fetchProductoBySlug(slug)
    if (producto) {
        return {
            title: `${producto.nombre} | GeoSintéticos Industrial`,
            description: producto.descripcion_corta,
        }
    }

    // 2. Intentar buscar como categoría
    const category = await fetchCategoryBySlug(slug)
    if (category) {
        return {
            title: `${category.nombre} | GeoSintéticos Industrial`,
            description: category.descripcion || `Productos de la categoría ${category.nombre}`,
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
