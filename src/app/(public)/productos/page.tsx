import { fetchProductos, fetchCategorias } from '@/lib/data/productos'
import ProductCatalog from '@/components/public/ProductCatalog'

export const metadata = {
    title: 'Productos | GeoSintéticos Industrial',
    description: 'Catálogo completo de geosintéticos y productos para piscinas.',
}

export const revalidate = 60 // Revalidar cada minuto

export default async function ProductosPage() {
    const [productos, categorias] = await Promise.all([
        fetchProductos(),
        fetchCategorias()
    ])

    return (
        <div className="py-20 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-accent font-semibold text-sm tracking-wider uppercase">Catálogo</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mt-3 mb-6">
                        Nuestras Soluciones
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Productos de alta calidad certificados internacionalmente para garantizar la durabilidad de su proyecto.
                    </p>
                </div>

                <ProductCatalog productos={productos} categorias={categorias} />
            </div>
        </div>
    )
}
