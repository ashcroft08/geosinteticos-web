/**
 * DATOS - Portal Geosintéticos
 * Productos, Proyectos y Contenido Institucional
 */

// ===== PRODUCTOS =====
const PRODUCTOS = [
  // GEOSINTÉTICOS
  {
    id: 'geomembrana-hdpe-1mm',
    nombre: 'Geomembrana HDPE 1.0mm',
    categoria: 'Geosintéticos',
    subcategoria: 'Geomembranas',
    descripcionCorta: 'Geomembrana de polietileno de alta densidad para impermeabilización de reservorios, lagunas y rellenos sanitarios.',
    descripcionDetallada: 'La Geomembrana HDPE de 1.0mm es un material de ingeniería diseñado para proporcionar una barrera impermeable de alto rendimiento. Fabricada con resinas vírgenes de polietileno de alta densidad, ofrece excelente resistencia química, UV y mecánica. Ideal para proyectos de contención de líquidos, minería, agricultura y manejo de residuos.',
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', alt: 'Geomembrana HDPE instalada', esPrincipal: true },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', alt: 'Detalle de soldadura', esPrincipal: false }
    ],
    fichaTecnica: { urlPDF: '/docs/ficha-geomembrana-hdpe-1mm.pdf', nombreArchivo: 'ficha-geomembrana-hdpe-1mm.pdf', tamanioMB: 1.2 },
    especificaciones: [
      { propiedad: 'Espesor', valor: '1.0', unidad: 'mm' },
      { propiedad: 'Densidad', valor: '0.94', unidad: 'g/cm³' },
      { propiedad: 'Resistencia a la tensión', valor: '27', unidad: 'kN/m' },
      { propiedad: 'Elongación a la rotura', valor: '700', unidad: '%' },
      { propiedad: 'Resistencia al punzonamiento', valor: '480', unidad: 'N' },
      { propiedad: 'Ancho de rollo', valor: '7', unidad: 'm' }
    ],
    aplicaciones: ['Reservorios de agua', 'Lagunas de oxidación', 'Rellenos sanitarios', 'Minería', 'Agricultura'],
    certificaciones: ['ISO 9001:2015', 'ASTM D7176', 'GRI GM13'],
    disponible: true
  },
  {
    id: 'geomembrana-hdpe-1.5mm',
    nombre: 'Geomembrana HDPE 1.5mm',
    categoria: 'Geosintéticos',
    subcategoria: 'Geomembranas',
    descripcionCorta: 'Geomembrana de alta resistencia para aplicaciones mineras y proyectos de gran envergadura.',
    descripcionDetallada: 'Geomembrana HDPE de 1.5mm de espesor, diseñada específicamente para aplicaciones que requieren máxima resistencia mecánica y durabilidad. Perfecta para pads de lixiviación, reservorios mineros y proyectos con exposición a condiciones extremas.',
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800', alt: 'Proyecto minero', esPrincipal: true }
    ],
    fichaTecnica: { urlPDF: '/docs/ficha-geomembrana-hdpe-1.5mm.pdf', nombreArchivo: 'ficha-geomembrana-hdpe-1.5mm.pdf', tamanioMB: 1.5 },
    especificaciones: [
      { propiedad: 'Espesor', valor: '1.5', unidad: 'mm' },
      { propiedad: 'Densidad', valor: '0.94', unidad: 'g/cm³' },
      { propiedad: 'Resistencia a la tensión', valor: '40', unidad: 'kN/m' },
      { propiedad: 'Elongación a la rotura', valor: '700', unidad: '%' }
    ],
    aplicaciones: ['Pads de lixiviación', 'Minería a cielo abierto', 'Reservorios industriales'],
    certificaciones: ['ISO 9001:2015', 'ASTM D7176'],
    disponible: true
  },
  {
    id: 'geotextil-nt-200',
    nombre: 'Geotextil No Tejido 200 g/m²',
    categoria: 'Geosintéticos',
    subcategoria: 'Geotextiles',
    descripcionCorta: 'Geotextil de polipropileno no tejido punzonado para separación, filtración y protección.',
    descripcionDetallada: 'Geotextil no tejido fabricado con fibras de polipropileno mediante el proceso de punzonado por agujas. Proporciona excelentes propiedades de filtración, separación y protección de geomembranas contra daños mecánicos.',
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Geotextil instalado', esPrincipal: true }
    ],
    fichaTecnica: { urlPDF: '/docs/ficha-geotextil-nt-200.pdf', nombreArchivo: 'ficha-geotextil-nt-200.pdf', tamanioMB: 0.8 },
    especificaciones: [
      { propiedad: 'Gramaje', valor: '200', unidad: 'g/m²' },
      { propiedad: 'Espesor', valor: '1.9', unidad: 'mm' },
      { propiedad: 'Resistencia a la tracción', valor: '9', unidad: 'kN/m' },
      { propiedad: 'Permeabilidad', valor: '95', unidad: 'l/m²/s' }
    ],
    aplicaciones: ['Protección de geomembranas', 'Separación de suelos', 'Drenaje', 'Estabilización'],
    certificaciones: ['ISO 9001:2015', 'ASTM D4632'],
    disponible: true
  },
  {
    id: 'geodren-planar',
    nombre: 'Geodrén Planar Compuesto',
    categoria: 'Geosintéticos',
    subcategoria: 'Geodrenes',
    descripcionCorta: 'Sistema de drenaje planar compuesto por núcleo drenante y geotextil filtro.',
    descripcionDetallada: 'Geocompuesto de drenaje formado por un núcleo tridimensional de polipropileno recubierto por geotextil no tejido. Diseñado para aplicaciones de drenaje horizontal y vertical en muros de contención, taludes y techos verdes.',
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', alt: 'Geodrén instalado', esPrincipal: true }
    ],
    fichaTecnica: { urlPDF: '/docs/ficha-geodren-planar.pdf', nombreArchivo: 'ficha-geodren-planar.pdf', tamanioMB: 1.0 },
    especificaciones: [
      { propiedad: 'Espesor del núcleo', valor: '10', unidad: 'mm' },
      { propiedad: 'Capacidad de flujo', valor: '3.5', unidad: 'l/m/s' },
      { propiedad: 'Resistencia a compresión', valor: '400', unidad: 'kPa' }
    ],
    aplicaciones: ['Muros de contención', 'Taludes', 'Techos verdes', 'Jardines', 'Sótanos'],
    certificaciones: ['ISO 9001:2015'],
    disponible: true
  },
  // PISCINAS
  {
    id: 'liner-pvc-azul',
    nombre: 'Liner PVC para Piscina Azul',
    categoria: 'Piscinas',
    subcategoria: 'Liners para Piscina',
    descripcionCorta: 'Membrana de PVC flexible reforzada para revestimiento de piscinas residenciales y comerciales.',
    descripcionDetallada: 'Liner de PVC plastificado reforzado con malla de poliéster, diseñado específicamente para el revestimiento de piscinas. Ofrece excelente resistencia a los rayos UV, al cloro y a los productos químicos típicos del tratamiento de agua de piscinas.',
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800', alt: 'Piscina con liner azul', esPrincipal: true }
    ],
    fichaTecnica: { urlPDF: '/docs/ficha-liner-pvc-azul.pdf', nombreArchivo: 'ficha-liner-pvc-azul.pdf', tamanioMB: 0.9 },
    especificaciones: [
      { propiedad: 'Espesor', valor: '1.5', unidad: 'mm' },
      { propiedad: 'Color', valor: 'Azul Adriático', unidad: '' },
      { propiedad: 'Resistencia a la tracción', valor: '1800', unidad: 'N/5cm' },
      { propiedad: 'Garantía', valor: '10', unidad: 'años' }
    ],
    aplicaciones: ['Piscinas residenciales', 'Piscinas comerciales', 'Spas', 'Fuentes ornamentales'],
    certificaciones: ['ISO 9001:2015', 'NSF/ANSI 50'],
    disponible: true
  },
  {
    id: 'bomba-piscina-1hp',
    nombre: 'Bomba de Piscina 1 HP',
    categoria: 'Piscinas',
    subcategoria: 'Sistemas de Filtración',
    descripcionCorta: 'Bomba centrífuga de alto rendimiento para circulación y filtración de piscinas.',
    descripcionDetallada: 'Bomba centrífuga autoaspirante de 1 HP diseñada para la circulación eficiente del agua en piscinas de hasta 60 m³. Motor monofásico con protección térmica integrada y cuerpo resistente a la corrosión.',
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', alt: 'Bomba de piscina', esPrincipal: true }
    ],
    fichaTecnica: { urlPDF: '/docs/ficha-bomba-1hp.pdf', nombreArchivo: 'ficha-bomba-1hp.pdf', tamanioMB: 0.7 },
    especificaciones: [
      { propiedad: 'Potencia', valor: '1', unidad: 'HP' },
      { propiedad: 'Caudal máximo', valor: '18', unidad: 'm³/h' },
      { propiedad: 'Altura máxima', valor: '12', unidad: 'm' },
      { propiedad: 'Voltaje', valor: '220', unidad: 'V' }
    ],
    aplicaciones: ['Piscinas residenciales', 'Spas', 'Jacuzzis'],
    certificaciones: ['CE', 'ISO 9001:2015'],
    disponible: true
  },
  {
    id: 'filtro-arena-24',
    nombre: 'Filtro de Arena 24"',
    categoria: 'Piscinas',
    subcategoria: 'Sistemas de Filtración',
    descripcionCorta: 'Filtro de arena de alto rendimiento para piscinas de hasta 70 m³.',
    descripcionDetallada: 'Filtro de arena con tanque de polietileno de alta densidad resistente a la corrosión y a los rayos UV. El sistema de drenaje inferior de alta eficiencia garantiza una distribución uniforme del flujo de agua.',
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800', alt: 'Filtro de arena', esPrincipal: true }
    ],
    fichaTecnica: { urlPDF: '/docs/ficha-filtro-arena-24.pdf', nombreArchivo: 'ficha-filtro-arena-24.pdf', tamanioMB: 0.6 },
    especificaciones: [
      { propiedad: 'Diámetro', valor: '24', unidad: 'pulgadas' },
      { propiedad: 'Caudal', valor: '14', unidad: 'm³/h' },
      { propiedad: 'Capacidad de arena', valor: '150', unidad: 'kg' }
    ],
    aplicaciones: ['Piscinas residenciales', 'Piscinas comerciales pequeñas'],
    certificaciones: ['CE', 'NSF'],
    disponible: true
  },
  {
    id: 'cloro-granulado-5kg',
    nombre: 'Cloro Granulado 5kg',
    categoria: 'Piscinas',
    subcategoria: 'Químicos y Mantenimiento',
    descripcionCorta: 'Cloro granulado de disolución rápida para desinfección de piscinas.',
    descripcionDetallada: 'Hipoclorito de calcio granulado al 65% de cloro activo. Producto de disolución rápida ideal para tratamiento de choque y mantenimiento regular del agua de piscinas.',
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1586847934254-4b4e3e4f9a59?w=800', alt: 'Cloro granulado', esPrincipal: true }
    ],
    fichaTecnica: { urlPDF: '/docs/ficha-cloro-granulado.pdf', nombreArchivo: 'ficha-cloro-granulado.pdf', tamanioMB: 0.4 },
    especificaciones: [
      { propiedad: 'Concentración', valor: '65', unidad: '%' },
      { propiedad: 'Peso', valor: '5', unidad: 'kg' },
      { propiedad: 'Presentación', valor: 'Granulado', unidad: '' }
    ],
    aplicaciones: ['Desinfección de piscinas', 'Tratamiento de choque', 'Mantenimiento regular'],
    certificaciones: ['NSF/ANSI 60'],
    disponible: true
  }
];

// ===== PROYECTOS =====
const PROYECTOS = [
  {
    id: 'reservorio-minero-arequipa',
    titulo: 'Reservorio de Lixiviación Minera',
    cliente: 'Minera del Sur S.A.',
    ubicacion: { ciudad: 'Arequipa', region: 'Arequipa', pais: 'Perú' },
    tipoDeObra: 'Minería',
    fecha: '2024-06',
    reto: 'Construcción de reservorio de 50,000 m³ para lixiviación en zona de alta radiación UV y temperaturas extremas (-5°C a 35°C). Terreno con pendientes pronunciadas.',
    solucion: 'Instalación de geomembrana HDPE de 2.0mm con soldadura termoplástica certificada. Sistema de subdrenaje con geocompuesto drenante y geotextil de protección de 300 g/m².',
    productosUtilizados: [
      { idProducto: 'geomembrana-hdpe-1.5mm', nombreProducto: 'Geomembrana HDPE 1.5mm' },
      { idProducto: 'geotextil-nt-200', nombreProducto: 'Geotextil No Tejido 200 g/m²' }
    ],
    metricas: [
      { indicador: 'Área instalada', valor: '18,000 m²' },
      { indicador: 'Tiempo de ejecución', valor: '45 días' },
      { indicador: 'Garantía otorgada', valor: '10 años' }
    ],
    galeria: [
      { url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800', tipo: 'antes', descripcion: 'Terreno antes de la intervención' },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', tipo: 'durante', descripcion: 'Proceso de instalación' },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', tipo: 'despues', descripcion: 'Proyecto finalizado' }
    ],
    destacado: true
  },
  {
    id: 'laguna-agricola-ica',
    titulo: 'Laguna de Riego Tecnificado',
    cliente: 'Agroindustrias del Valle',
    ubicacion: { ciudad: 'Ica', region: 'Ica', pais: 'Perú' },
    tipoDeObra: 'Agricultura',
    fecha: '2024-03',
    reto: 'Almacenamiento de 25,000 m³ de agua para riego tecnificado de cultivos de exportación. Zona desértica con alta evaporación.',
    solucion: 'Geomembrana HDPE de 1.0mm con sistema antievaporación. Instalación de geotextil de protección en toda la superficie de contacto con el terreno.',
    productosUtilizados: [
      { idProducto: 'geomembrana-hdpe-1mm', nombreProducto: 'Geomembrana HDPE 1.0mm' },
      { idProducto: 'geotextil-nt-200', nombreProducto: 'Geotextil No Tejido 200 g/m²' }
    ],
    metricas: [
      { indicador: 'Capacidad', valor: '25,000 m³' },
      { indicador: 'Área impermeabilizada', valor: '8,500 m²' },
      { indicador: 'Reducción de pérdidas', valor: '95%' }
    ],
    galeria: [
      { url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', tipo: 'despues', descripcion: 'Laguna terminada' }
    ],
    destacado: true
  },
  {
    id: 'piscina-hotel-miraflores',
    titulo: 'Piscina Olímpica Hotel 5 Estrellas',
    cliente: 'Hotel Continental Lima',
    ubicacion: { ciudad: 'Lima', region: 'Lima', pais: 'Perú' },
    tipoDeObra: 'Residencial',
    fecha: '2023-12',
    reto: 'Renovación completa de piscina olímpica de 25m con altos estándares de calidad para hotel de lujo. Minimizar tiempo de cierre de instalaciones.',
    solucion: 'Instalación de liner PVC reforzado azul adriático con sistema de anclaje oculto. Renovación completa del sistema de filtración y tratamiento químico.',
    productosUtilizados: [
      { idProducto: 'liner-pvc-azul', nombreProducto: 'Liner PVC para Piscina Azul' },
      { idProducto: 'bomba-piscina-1hp', nombreProducto: 'Bomba de Piscina 1 HP' }
    ],
    metricas: [
      { indicador: 'Dimensiones', valor: '25m x 12m' },
      { indicador: 'Tiempo de obra', valor: '15 días' },
      { indicador: 'Satisfacción cliente', valor: '100%' }
    ],
    galeria: [
      { url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800', tipo: 'despues', descripcion: 'Piscina renovada' }
    ],
    destacado: true
  },
  {
    id: 'relleno-sanitario-trujillo',
    titulo: 'Celda de Relleno Sanitario',
    cliente: 'Municipalidad Provincial de Trujillo',
    ubicacion: { ciudad: 'Trujillo', region: 'La Libertad', pais: 'Perú' },
    tipoDeObra: 'Ambiental',
    fecha: '2023-08',
    reto: 'Impermeabilización de celda de 4 hectáreas para manejo de residuos sólidos cumpliendo normativa ambiental vigente.',
    solucion: 'Sistema de doble barrera con geomembranas HDPE y geocompuesto drenante para captación de lixiviados. Control de calidad con ensayos de vacío en todas las soldaduras.',
    productosUtilizados: [
      { idProducto: 'geomembrana-hdpe-1.5mm', nombreProducto: 'Geomembrana HDPE 1.5mm' },
      { idProducto: 'geodren-planar', nombreProducto: 'Geodrén Planar Compuesto' }
    ],
    metricas: [
      { indicador: 'Área total', valor: '40,000 m²' },
      { indicador: 'Soldaduras realizadas', valor: '12,500 m' },
      { indicador: 'Ensayos de QC', valor: '100%' }
    ],
    galeria: [
      { url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800', tipo: 'durante', descripcion: 'Instalación en proceso' }
    ],
    destacado: false
  },
  {
    id: 'reservorio-ancash',
    titulo: 'Reservorio de Agua Potable',
    cliente: 'EPS Chavín S.A.',
    ubicacion: { ciudad: 'Huaraz', region: 'Áncash', pais: 'Perú' },
    tipoDeObra: 'Industrial',
    fecha: '2023-05',
    reto: 'Construcción de reservorio de 10,000 m³ para almacenamiento de agua potable en zona de altura (3,200 msnm).',
    solucion: 'Geomembrana HDPE certificada para contacto con agua potable. Sistema de anclaje perimetral reforzado y protección mecánica con geotextil.',
    productosUtilizados: [
      { idProducto: 'geomembrana-hdpe-1mm', nombreProducto: 'Geomembrana HDPE 1.0mm' }
    ],
    metricas: [
      { indicador: 'Volumen', valor: '10,000 m³' },
      { indicador: 'Población beneficiada', valor: '15,000 hab' }
    ],
    galeria: [
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', tipo: 'despues', descripcion: 'Reservorio finalizado' }
    ],
    destacado: false
  }
];

// ===== SERVICIOS =====
const SERVICIOS = [
  {
    numero: '01',
    titulo: 'Venta de Materiales',
    descripcion: 'Suministro de geosintéticos y productos de piscina de la más alta calidad.',
    items: ['Geomembranas HDPE/LLDPE/PVC en todos los espesores', 'Geotextiles tejidos y no tejidos', 'Geodrenes y geocompuestos', 'Accesorios de piscina', 'Envío a nivel nacional']
  },
  {
    numero: '02',
    titulo: 'Instalación Profesional',
    descripcion: 'Servicio de instalación con personal técnico certificado y equipos especializados.',
    items: ['Soldadura termoplástica certificada', 'Control de calidad en obra', 'Ensayos destructivos y no destructivos', 'Personal técnico especializado', 'Cumplimiento de normas internacionales']
  },
  {
    numero: '03',
    titulo: 'Asesoría Técnica',
    descripcion: 'Consultoría especializada para el diseño óptimo de su proyecto.',
    items: ['Diseño de soluciones a medida', 'Cálculo de cantidades', 'Especificaciones técnicas', 'Supervisión de instalación', 'Capacitación a personal de obra']
  },
  {
    numero: '04',
    titulo: 'Post-Venta',
    descripcion: 'Acompañamiento continuo para garantizar el óptimo funcionamiento de su proyecto.',
    items: ['Garantías extendidas', 'Mantenimiento preventivo', 'Reparaciones especializadas', 'Inspecciones periódicas', 'Soporte técnico permanente']
  }
];

// ===== CERTIFICACIONES =====
const CERTIFICACIONES = [
  { nombre: 'ISO 9001:2015', emisor: 'Bureau Veritas', vigencia: '2024-2027', descripcion: 'Sistema de Gestión de Calidad' },
  { nombre: 'ISO 14001:2015', emisor: 'Bureau Veritas', vigencia: '2024-2027', descripcion: 'Sistema de Gestión Ambiental' },
  { nombre: 'ASTM International', emisor: 'ASTM', vigencia: 'Permanente', descripcion: 'Normas Técnicas Internacionales' },
  { nombre: 'GRI-GM13', emisor: 'GSI', vigencia: 'Permanente', descripcion: 'Especificación de Geomembranas' }
];

// ===== INFORMACIÓN DE CONTACTO =====
const CONTACTO = {
  telefono: '+51 999 999 999',
  email: 'ventas@geosinteticos.com',
  direccion: 'Av. Industrial 1234, Lima, Perú',
  horario: 'Lun - Vie: 8:00 AM - 6:00 PM',
  whatsapp: '51999999999',
  redes: {
    facebook: 'https://facebook.com/geosinteticos',
    instagram: 'https://instagram.com/geosinteticos',
    linkedin: 'https://linkedin.com/company/geosinteticos'
  }
};

// ===== ESTADÍSTICAS =====
const ESTADISTICAS = [
  { numero: '25+', label: 'Años de Experiencia' },
  { numero: '500+', label: 'Proyectos Realizados' },
  { numero: '99+', label: 'Clientes Satisfechos' },
  { numero: '50+', label: 'Productos Disponibles' },
  { numero: '15+', label: 'Técnicos Certificados' }
];

// Exportar para uso global
window.PRODUCTOS = PRODUCTOS;
window.PROYECTOS = PROYECTOS;
window.SERVICIOS = SERVICIOS;
window.CERTIFICACIONES = CERTIFICACIONES;
window.CONTACTO = CONTACTO;
window.ESTADISTICAS = ESTADISTICAS;
