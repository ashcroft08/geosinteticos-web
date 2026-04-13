/**
 * Datos estáticos de respaldo — se usan cuando Supabase no está conectado.
 * Estos datos son los mismos que se insertarían con seed.sql.
 */

import type { Especificacion, Metrica } from '@/lib/supabase/types'

export interface ProductoEstaticoImagen {
    url_publica: string
    alt: string
    es_principal: boolean
}

export interface ProductoEstatico {
    id: string
    nombre: string
    slug: string
    categoria_nombre: string
    subcategoria_nombre: string
    descripcion_corta: string
    descripcion_detallada: string
    imagenes: ProductoEstaticoImagen[]
    especificaciones: Especificacion[]
    aplicaciones: string[]
    certificaciones: string[]
    disponible: boolean
}

export interface ProyectoEstaticoImagen {
    url_publica: string
    tipo: string
    descripcion: string
}

export interface ProyectoEstatico {
    id: string
    titulo: string
    slug: string
    cliente: string
    ciudad: string
    region: string
    tipo_obra: string
    fecha: string
    reto: string
    solucion: string
    metricas: Metrica[]
    imagenes: ProyectoEstaticoImagen[]
    productos_usados: string[]
    destacado: boolean
}

export interface ServicioEstatico {
    numero: string
    titulo: string
    descripcion: string
    items: string[]
}

export const PRODUCTOS_ESTATICOS: ProductoEstatico[] = [
    {
        id: '1', nombre: 'Geomembrana HDPE 1.0mm', slug: 'geomembrana-hdpe-1mm',
        categoria_nombre: 'Geosintéticos', subcategoria_nombre: 'Geomembranas',
        descripcion_corta: 'Geomembrana de polietileno de alta densidad para impermeabilización de reservorios, lagunas y rellenos sanitarios.',
        descripcion_detallada: 'La Geomembrana HDPE de 1.0mm es un material de ingeniería diseñado para proporcionar una barrera impermeable de alto rendimiento. Fabricada con resinas vírgenes de polietileno de alta densidad, ofrece excelente resistencia química, UV y mecánica.',
        imagenes: [
            { url_publica: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', alt: 'Geomembrana HDPE instalada', es_principal: true },
            { url_publica: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', alt: 'Detalle de soldadura', es_principal: false },
        ],
        especificaciones: [
            { propiedad: 'Espesor', valor: '1.0', unidad: 'mm' },
            { propiedad: 'Densidad', valor: '0.94', unidad: 'g/cm³' },
            { propiedad: 'Resistencia a la tensión', valor: '27', unidad: 'kN/m' },
            { propiedad: 'Elongación a la rotura', valor: '700', unidad: '%' },
            { propiedad: 'Resistencia al punzonamiento', valor: '480', unidad: 'N' },
            { propiedad: 'Ancho de rollo', valor: '7', unidad: 'm' },
        ],
        aplicaciones: ['Reservorios de agua', 'Lagunas de oxidación', 'Rellenos sanitarios', 'Minería', 'Agricultura'],
        certificaciones: ['ISO 9001:2015', 'ASTM D7176', 'GRI GM13'],
        disponible: true,
    },
    {
        id: '2', nombre: 'Geomembrana HDPE 1.5mm', slug: 'geomembrana-hdpe-15mm',
        categoria_nombre: 'Geosintéticos', subcategoria_nombre: 'Geomembranas',
        descripcion_corta: 'Geomembrana de alta resistencia para aplicaciones mineras y proyectos de gran envergadura.',
        descripcion_detallada: 'Geomembrana HDPE de 1.5mm de espesor, diseñada específicamente para aplicaciones que requieren máxima resistencia mecánica y durabilidad.',
        imagenes: [{ url_publica: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800', alt: 'Proyecto minero', es_principal: true }],
        especificaciones: [
            { propiedad: 'Espesor', valor: '1.5', unidad: 'mm' },
            { propiedad: 'Densidad', valor: '0.94', unidad: 'g/cm³' },
            { propiedad: 'Resistencia a la tensión', valor: '40', unidad: 'kN/m' },
            { propiedad: 'Elongación a la rotura', valor: '700', unidad: '%' },
        ],
        aplicaciones: ['Pads de lixiviación', 'Minería a cielo abierto', 'Reservorios industriales'],
        certificaciones: ['ISO 9001:2015', 'ASTM D7176'],
        disponible: true,
    },
    {
        id: '3', nombre: 'Geotextil No Tejido 200 g/m²', slug: 'geotextil-nt-200',
        categoria_nombre: 'Geosintéticos', subcategoria_nombre: 'Geotextiles',
        descripcion_corta: 'Geotextil de polipropileno no tejido punzonado para separación, filtración y protección.',
        descripcion_detallada: 'Geotextil no tejido fabricado con fibras de polipropileno mediante el proceso de punzonado por agujas.',
        imagenes: [{ url_publica: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Geotextil instalado', es_principal: true }],
        especificaciones: [
            { propiedad: 'Gramaje', valor: '200', unidad: 'g/m²' },
            { propiedad: 'Espesor', valor: '1.9', unidad: 'mm' },
            { propiedad: 'Resistencia a la tracción', valor: '9', unidad: 'kN/m' },
            { propiedad: 'Permeabilidad', valor: '95', unidad: 'l/m²/s' },
        ],
        aplicaciones: ['Protección de geomembranas', 'Separación de suelos', 'Drenaje', 'Estabilización'],
        certificaciones: ['ISO 9001:2015', 'ASTM D4632'],
        disponible: true,
    },
    {
        id: '4', nombre: 'Geodrén Planar Compuesto', slug: 'geodren-planar',
        categoria_nombre: 'Geosintéticos', subcategoria_nombre: 'Geodrenes',
        descripcion_corta: 'Sistema de drenaje planar compuesto por núcleo drenante y geotextil filtro.',
        descripcion_detallada: 'Geocompuesto de drenaje formado por un núcleo tridimensional de polipropileno recubierto por geotextil no tejido.',
        imagenes: [{ url_publica: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', alt: 'Geodrén instalado', es_principal: true }],
        especificaciones: [
            { propiedad: 'Espesor del núcleo', valor: '10', unidad: 'mm' },
            { propiedad: 'Capacidad de flujo', valor: '3.5', unidad: 'l/m/s' },
            { propiedad: 'Resistencia a compresión', valor: '400', unidad: 'kPa' },
        ],
        aplicaciones: ['Muros de contención', 'Taludes', 'Techos verdes', 'Jardines', 'Sótanos'],
        certificaciones: ['ISO 9001:2015'],
        disponible: true,
    },
    {
        id: '5', nombre: 'Liner PVC para Piscina Azul', slug: 'liner-pvc-azul',
        categoria_nombre: 'Piscinas', subcategoria_nombre: 'Liners para Piscina',
        descripcion_corta: 'Membrana de PVC flexible reforzada para revestimiento de piscinas residenciales y comerciales.',
        descripcion_detallada: 'Liner de PVC plastificado reforzado con malla de poliéster, diseñado específicamente para el revestimiento de piscinas.',
        imagenes: [{ url_publica: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800', alt: 'Piscina con liner azul', es_principal: true }],
        especificaciones: [
            { propiedad: 'Espesor', valor: '1.5', unidad: 'mm' },
            { propiedad: 'Color', valor: 'Azul Adriático', unidad: '' },
            { propiedad: 'Resistencia a la tracción', valor: '1800', unidad: 'N/5cm' },
            { propiedad: 'Garantía', valor: '10', unidad: 'años' },
        ],
        aplicaciones: ['Piscinas residenciales', 'Piscinas comerciales', 'Spas', 'Fuentes ornamentales'],
        certificaciones: ['ISO 9001:2015', 'NSF/ANSI 50'],
        disponible: true,
    },
    {
        id: '6', nombre: 'Bomba de Piscina 1 HP', slug: 'bomba-piscina-1hp',
        categoria_nombre: 'Piscinas', subcategoria_nombre: 'Sistemas de Filtración',
        descripcion_corta: 'Bomba centrífuga de alto rendimiento para circulación y filtración de piscinas.',
        descripcion_detallada: 'Bomba centrífuga autoaspirante de 1 HP diseñada para la circulación eficiente del agua en piscinas de hasta 60 m³.',
        imagenes: [{ url_publica: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', alt: 'Bomba de piscina', es_principal: true }],
        especificaciones: [
            { propiedad: 'Potencia', valor: '1', unidad: 'HP' },
            { propiedad: 'Caudal máximo', valor: '18', unidad: 'm³/h' },
            { propiedad: 'Altura máxima', valor: '12', unidad: 'm' },
            { propiedad: 'Voltaje', valor: '220', unidad: 'V' },
        ],
        aplicaciones: ['Piscinas residenciales', 'Spas', 'Jacuzzis'],
        certificaciones: ['CE', 'ISO 9001:2015'],
        disponible: true,
    },
    {
        id: '7', nombre: 'Filtro de Arena 24"', slug: 'filtro-arena-24',
        categoria_nombre: 'Piscinas', subcategoria_nombre: 'Sistemas de Filtración',
        descripcion_corta: 'Filtro de arena de alto rendimiento para piscinas de hasta 70 m³.',
        descripcion_detallada: 'Filtro de arena con tanque de polietileno de alta densidad resistente a la corrosión y a los rayos UV.',
        imagenes: [{ url_publica: 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800', alt: 'Filtro de arena', es_principal: true }],
        especificaciones: [
            { propiedad: 'Diámetro', valor: '24', unidad: 'pulgadas' },
            { propiedad: 'Caudal', valor: '14', unidad: 'm³/h' },
            { propiedad: 'Capacidad de arena', valor: '150', unidad: 'kg' },
        ],
        aplicaciones: ['Piscinas residenciales', 'Piscinas comerciales pequeñas'],
        certificaciones: ['CE', 'NSF'],
        disponible: true,
    },
    {
        id: '8', nombre: 'Cloro Granulado 5kg', slug: 'cloro-granulado-5kg',
        categoria_nombre: 'Piscinas', subcategoria_nombre: 'Químicos y Mantenimiento',
        descripcion_corta: 'Cloro granulado de disolución rápida para desinfección de piscinas.',
        descripcion_detallada: 'Hipoclorito de calcio granulado al 65% de cloro activo. Producto de disolución rápida.',
        imagenes: [{ url_publica: 'https://images.unsplash.com/photo-1586847934254-4b4e3e4f9a59?w=800', alt: 'Cloro granulado', es_principal: true }],
        especificaciones: [
            { propiedad: 'Concentración', valor: '65', unidad: '%' },
            { propiedad: 'Peso', valor: '5', unidad: 'kg' },
            { propiedad: 'Presentación', valor: 'Granulado', unidad: '' },
        ],
        aplicaciones: ['Desinfección de piscinas', 'Tratamiento de choque', 'Mantenimiento regular'],
        certificaciones: ['NSF/ANSI 60'],
        disponible: true,
    },
]

export const PROYECTOS_ESTATICOS: ProyectoEstatico[] = [
    {
        id: '1', titulo: 'Reservorio de Lixiviación Minera', slug: 'reservorio-minero-arequipa',
        cliente: 'Minera del Sur S.A.', ciudad: 'Arequipa', region: 'Arequipa', tipo_obra: 'Minería',
        fecha: '2024-06', reto: 'Construcción de reservorio de 50,000 m³ para lixiviación en zona de alta radiación UV y temperaturas extremas.',
        solucion: 'Instalación de geomembrana HDPE de 2.0mm con soldadura termoplástica certificada.',
        metricas: [{ indicador: 'Área instalada', valor: '18,000 m²' }, { indicador: 'Tiempo de ejecución', valor: '45 días' }, { indicador: 'Garantía otorgada', valor: '10 años' }],
        imagenes: [
            { url_publica: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800', tipo: 'antes', descripcion: 'Terreno antes de la intervención' },
            { url_publica: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', tipo: 'durante', descripcion: 'Proceso de instalación' },
            { url_publica: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', tipo: 'despues', descripcion: 'Proyecto finalizado' },
        ],
        productos_usados: ['Geomembrana HDPE 1.5mm', 'Geotextil No Tejido 200 g/m²'],
        destacado: true,
    },
    {
        id: '2', titulo: 'Laguna de Riego Tecnificado', slug: 'laguna-agricola-ica',
        cliente: 'Agroindustrias del Valle', ciudad: 'Ica', region: 'Ica', tipo_obra: 'Agricultura',
        fecha: '2024-03', reto: 'Almacenamiento de 25,000 m³ de agua para riego tecnificado.',
        solucion: 'Geomembrana HDPE de 1.0mm con sistema antievaporación.',
        metricas: [{ indicador: 'Capacidad', valor: '25,000 m³' }, { indicador: 'Área impermeabilizada', valor: '8,500 m²' }, { indicador: 'Reducción de pérdidas', valor: '95%' }],
        imagenes: [{ url_publica: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', tipo: 'despues', descripcion: 'Laguna terminada' }],
        productos_usados: ['Geomembrana HDPE 1.0mm', 'Geotextil No Tejido 200 g/m²'],
        destacado: true,
    },
    {
        id: '3', titulo: 'Piscina Olímpica Hotel 5 Estrellas', slug: 'piscina-hotel-miraflores',
        cliente: 'Hotel Continental Lima', ciudad: 'Lima', region: 'Lima', tipo_obra: 'Residencial',
        fecha: '2023-12', reto: 'Renovación completa de piscina olímpica de 25m.',
        solucion: 'Instalación de liner PVC reforzado azul adriático con sistema de anclaje oculto.',
        metricas: [{ indicador: 'Dimensiones', valor: '25m x 12m' }, { indicador: 'Tiempo de obra', valor: '15 días' }, { indicador: 'Satisfacción cliente', valor: '100%' }],
        imagenes: [{ url_publica: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800', tipo: 'despues', descripcion: 'Piscina renovada' }],
        productos_usados: ['Liner PVC para Piscina Azul', 'Bomba de Piscina 1 HP'],
        destacado: true,
    },
    {
        id: '4', titulo: 'Celda de Relleno Sanitario', slug: 'relleno-sanitario-trujillo',
        cliente: 'Municipalidad Provincial de Trujillo', ciudad: 'Trujillo', region: 'La Libertad', tipo_obra: 'Ambiental',
        fecha: '2023-08', reto: 'Impermeabilización de celda de 4 hectáreas.',
        solucion: 'Sistema de doble barrera con geomembranas HDPE y geocompuesto drenante.',
        metricas: [{ indicador: 'Área total', valor: '40,000 m²' }, { indicador: 'Soldaduras realizadas', valor: '12,500 m' }, { indicador: 'Ensayos de QC', valor: '100%' }],
        imagenes: [{ url_publica: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800', tipo: 'durante', descripcion: 'Instalación en proceso' }],
        productos_usados: ['Geomembrana HDPE 1.5mm', 'Geodrén Planar Compuesto'],
        destacado: false,
    },
    {
        id: '5', titulo: 'Reservorio de Agua Potable', slug: 'reservorio-ancash',
        cliente: 'EPS Chavín S.A.', ciudad: 'Huaraz', region: 'Áncash', tipo_obra: 'Industrial',
        fecha: '2023-05', reto: 'Construcción de reservorio de 10,000 m³ en zona de altura.',
        solucion: 'Geomembrana HDPE certificada para contacto con agua potable.',
        metricas: [{ indicador: 'Volumen', valor: '10,000 m³' }, { indicador: 'Población beneficiada', valor: '15,000 hab' }],
        imagenes: [{ url_publica: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', tipo: 'despues', descripcion: 'Reservorio finalizado' }],
        productos_usados: ['Geomembrana HDPE 1.0mm'],
        destacado: false,
    },
]

export const SERVICIOS_ESTATICOS: ServicioEstatico[] = [
    {
        numero: '01', titulo: 'Venta de Materiales',
        descripcion: 'Suministro de geosintéticos y productos de piscina de la más alta calidad.',
        items: ['Geomembranas HDPE/LLDPE/PVC en todos los espesores', 'Geotextiles tejidos y no tejidos', 'Geodrenes y geocompuestos', 'Accesorios de piscina', 'Envío a nivel nacional'],
    },
    {
        numero: '02', titulo: 'Instalación Profesional',
        descripcion: 'Servicio de instalación con personal técnico certificado y equipos especializados.',
        items: ['Soldadura termoplástica certificada', 'Control de calidad en obra', 'Ensayos destructivos y no destructivos', 'Personal técnico especializado', 'Cumplimiento de normas internacionales'],
    },
    {
        numero: '03', titulo: 'Asesoría Técnica',
        descripcion: 'Consultoría especializada para el diseño óptimo de su proyecto.',
        items: ['Diseño de soluciones a medida', 'Cálculo de cantidades', 'Especificaciones técnicas', 'Supervisión de instalación', 'Capacitación a personal de obra'],
    },
    {
        numero: '04', titulo: 'Post-Venta',
        descripcion: 'Acompañamiento continuo para garantizar el óptimo funcionamiento de su proyecto.',
        items: ['Garantías extendidas', 'Mantenimiento preventivo', 'Reparaciones especializadas', 'Inspecciones periódicas', 'Soporte técnico permanente'],
    },
]

export const ESTADISTICAS = [
    { numero: '25+', label: 'Años de Experiencia' },
    { numero: '500+', label: 'Proyectos Realizados' },
    { numero: '99+', label: 'Clientes Satisfechos' },
    { numero: '50+', label: 'Productos Disponibles' },
    { numero: '15+', label: 'Técnicos Certificados' },
]

export const CERTIFICACIONES_ESTATICAS = [
    { nombre: 'ISO 9001:2015', emisor: 'Bureau Veritas', vigencia: '2024-2027', descripcion: 'Sistema de Gestión de Calidad' },
    { nombre: 'ISO 14001:2015', emisor: 'Bureau Veritas', vigencia: '2024-2027', descripcion: 'Sistema de Gestión Ambiental' },
    { nombre: 'ASTM International', emisor: 'ASTM', vigencia: 'Permanente', descripcion: 'Normas Técnicas Internacionales' },
    { nombre: 'GRI-GM13', emisor: 'GSI', vigencia: 'Permanente', descripcion: 'Especificación de Geomembranas' },
]

export const CONTACTO = {
    telefono: '+51 999 999 999',
    email: 'ventas@geosinteticos.com',
    direccion: 'Av. Industrial 1234, Lima, Perú',
    horario: 'Lun - Vie: 8:00 AM - 6:00 PM',
    whatsapp: '51999999999',
}
