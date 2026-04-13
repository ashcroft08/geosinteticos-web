-- =====================================================
-- SEED DATA — Portal Geosintéticos
-- Ejecutar DESPUÉS de schema.sql
-- =====================================================

-- ===== CATEGORÍAS =====
INSERT INTO categorias (id, nombre, slug, descripcion, orden) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Geosintéticos', 'geosinteticos', 'Geomembranas, geotextiles, geodrenes y accesorios de instalación', 1),
  ('a1000000-0000-0000-0000-000000000002', 'Piscinas', 'piscinas', 'Liners, accesorios, sistemas de filtración y químicos de mantenimiento', 2);

-- ===== SUBCATEGORÍAS =====
INSERT INTO subcategorias (id, categoria_id, nombre, slug, orden) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Geomembranas', 'geomembranas', 1),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Geotextiles', 'geotextiles', 2),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Geodrenes', 'geodrenes', 3),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Liners para Piscina', 'liners-piscina', 1),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Sistemas de Filtración', 'sistemas-filtracion', 2),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'Químicos y Mantenimiento', 'quimicos-mantenimiento', 3);

-- ===== PRODUCTOS =====
INSERT INTO productos (id, nombre, slug, categoria_id, subcategoria_id, descripcion_corta, descripcion_detallada, especificaciones, aplicaciones, certificaciones, disponible, orden) VALUES
(
  'c1000000-0000-0000-0000-000000000001',
  'Geomembrana HDPE 1.0mm',
  'geomembrana-hdpe-1mm',
  'a1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'Geomembrana de polietileno de alta densidad para impermeabilización de reservorios, lagunas y rellenos sanitarios.',
  'La Geomembrana HDPE de 1.0mm es un material de ingeniería diseñado para proporcionar una barrera impermeable de alto rendimiento. Fabricada con resinas vírgenes de polietileno de alta densidad, ofrece excelente resistencia química, UV y mecánica.',
  '[{"propiedad":"Espesor","valor":"1.0","unidad":"mm"},{"propiedad":"Densidad","valor":"0.94","unidad":"g/cm³"},{"propiedad":"Resistencia a la tensión","valor":"27","unidad":"kN/m"},{"propiedad":"Elongación a la rotura","valor":"700","unidad":"%"},{"propiedad":"Resistencia al punzonamiento","valor":"480","unidad":"N"},{"propiedad":"Ancho de rollo","valor":"7","unidad":"m"}]',
  ARRAY['Reservorios de agua','Lagunas de oxidación','Rellenos sanitarios','Minería','Agricultura'],
  ARRAY['ISO 9001:2015','ASTM D7176','GRI GM13'],
  true, 1
),
(
  'c1000000-0000-0000-0000-000000000002',
  'Geomembrana HDPE 1.5mm',
  'geomembrana-hdpe-15mm',
  'a1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'Geomembrana de alta resistencia para aplicaciones mineras y proyectos de gran envergadura.',
  'Geomembrana HDPE de 1.5mm de espesor, diseñada específicamente para aplicaciones que requieren máxima resistencia mecánica y durabilidad.',
  '[{"propiedad":"Espesor","valor":"1.5","unidad":"mm"},{"propiedad":"Densidad","valor":"0.94","unidad":"g/cm³"},{"propiedad":"Resistencia a la tensión","valor":"40","unidad":"kN/m"},{"propiedad":"Elongación a la rotura","valor":"700","unidad":"%"}]',
  ARRAY['Pads de lixiviación','Minería a cielo abierto','Reservorios industriales'],
  ARRAY['ISO 9001:2015','ASTM D7176'],
  true, 2
),
(
  'c1000000-0000-0000-0000-000000000003',
  'Geotextil No Tejido 200 g/m²',
  'geotextil-nt-200',
  'a1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000002',
  'Geotextil de polipropileno no tejido punzonado para separación, filtración y protección.',
  'Geotextil no tejido fabricado con fibras de polipropileno mediante el proceso de punzonado por agujas.',
  '[{"propiedad":"Gramaje","valor":"200","unidad":"g/m²"},{"propiedad":"Espesor","valor":"1.9","unidad":"mm"},{"propiedad":"Resistencia a la tracción","valor":"9","unidad":"kN/m"},{"propiedad":"Permeabilidad","valor":"95","unidad":"l/m²/s"}]',
  ARRAY['Protección de geomembranas','Separación de suelos','Drenaje','Estabilización'],
  ARRAY['ISO 9001:2015','ASTM D4632'],
  true, 3
),
(
  'c1000000-0000-0000-0000-000000000004',
  'Geodrén Planar Compuesto',
  'geodren-planar',
  'a1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000003',
  'Sistema de drenaje planar compuesto por núcleo drenante y geotextil filtro.',
  'Geocompuesto de drenaje formado por un núcleo tridimensional de polipropileno recubierto por geotextil no tejido.',
  '[{"propiedad":"Espesor del núcleo","valor":"10","unidad":"mm"},{"propiedad":"Capacidad de flujo","valor":"3.5","unidad":"l/m/s"},{"propiedad":"Resistencia a compresión","valor":"400","unidad":"kPa"}]',
  ARRAY['Muros de contención','Taludes','Techos verdes','Jardines','Sótanos'],
  ARRAY['ISO 9001:2015'],
  true, 4
),
(
  'c1000000-0000-0000-0000-000000000005',
  'Liner PVC para Piscina Azul',
  'liner-pvc-azul',
  'a1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000004',
  'Membrana de PVC flexible reforzada para revestimiento de piscinas residenciales y comerciales.',
  'Liner de PVC plastificado reforzado con malla de poliéster, diseñado específicamente para el revestimiento de piscinas.',
  '[{"propiedad":"Espesor","valor":"1.5","unidad":"mm"},{"propiedad":"Color","valor":"Azul Adriático","unidad":""},{"propiedad":"Resistencia a la tracción","valor":"1800","unidad":"N/5cm"},{"propiedad":"Garantía","valor":"10","unidad":"años"}]',
  ARRAY['Piscinas residenciales','Piscinas comerciales','Spas','Fuentes ornamentales'],
  ARRAY['ISO 9001:2015','NSF/ANSI 50'],
  true, 5
),
(
  'c1000000-0000-0000-0000-000000000006',
  'Bomba de Piscina 1 HP',
  'bomba-piscina-1hp',
  'a1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000005',
  'Bomba centrífuga de alto rendimiento para circulación y filtración de piscinas.',
  'Bomba centrífuga autoaspirante de 1 HP diseñada para la circulación eficiente del agua en piscinas de hasta 60 m³.',
  '[{"propiedad":"Potencia","valor":"1","unidad":"HP"},{"propiedad":"Caudal máximo","valor":"18","unidad":"m³/h"},{"propiedad":"Altura máxima","valor":"12","unidad":"m"},{"propiedad":"Voltaje","valor":"220","unidad":"V"}]',
  ARRAY['Piscinas residenciales','Spas','Jacuzzis'],
  ARRAY['CE','ISO 9001:2015'],
  true, 6
),
(
  'c1000000-0000-0000-0000-000000000007',
  'Filtro de Arena 24"',
  'filtro-arena-24',
  'a1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000005',
  'Filtro de arena de alto rendimiento para piscinas de hasta 70 m³.',
  'Filtro de arena con tanque de polietileno de alta densidad resistente a la corrosión y a los rayos UV.',
  '[{"propiedad":"Diámetro","valor":"24","unidad":"pulgadas"},{"propiedad":"Caudal","valor":"14","unidad":"m³/h"},{"propiedad":"Capacidad de arena","valor":"150","unidad":"kg"}]',
  ARRAY['Piscinas residenciales','Piscinas comerciales pequeñas'],
  ARRAY['CE','NSF'],
  true, 7
),
(
  'c1000000-0000-0000-0000-000000000008',
  'Cloro Granulado 5kg',
  'cloro-granulado-5kg',
  'a1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000006',
  'Cloro granulado de disolución rápida para desinfección de piscinas.',
  'Hipoclorito de calcio granulado al 65% de cloro activo. Producto de disolución rápida.',
  '[{"propiedad":"Concentración","valor":"65","unidad":"%"},{"propiedad":"Peso","valor":"5","unidad":"kg"},{"propiedad":"Presentación","valor":"Granulado","unidad":""}]',
  ARRAY['Desinfección de piscinas','Tratamiento de choque','Mantenimiento regular'],
  ARRAY['NSF/ANSI 60'],
  true, 8
);

-- ===== IMÁGENES DE PRODUCTOS =====
INSERT INTO producto_imagenes (producto_id, storage_path, url_publica, alt, es_principal, orden) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'productos/geomembrana-1.webp', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', 'Geomembrana HDPE instalada', true, 1),
  ('c1000000-0000-0000-0000-000000000001', 'productos/geomembrana-2.webp', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', 'Detalle de soldadura', false, 2),
  ('c1000000-0000-0000-0000-000000000002', 'productos/geomembrana15.webp', 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800', 'Proyecto minero', true, 1),
  ('c1000000-0000-0000-0000-000000000003', 'productos/geotextil.webp', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Geotextil instalado', true, 1),
  ('c1000000-0000-0000-0000-000000000004', 'productos/geodren.webp', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', 'Geodrén instalado', true, 1),
  ('c1000000-0000-0000-0000-000000000005', 'productos/liner-pvc.webp', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800', 'Piscina con liner azul', true, 1),
  ('c1000000-0000-0000-0000-000000000006', 'productos/bomba.webp', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', 'Bomba de piscina', true, 1),
  ('c1000000-0000-0000-0000-000000000007', 'productos/filtro.webp', 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800', 'Filtro de arena', true, 1),
  ('c1000000-0000-0000-0000-000000000008', 'productos/cloro.webp', 'https://images.unsplash.com/photo-1586847934254-4b4e3e4f9a59?w=800', 'Cloro granulado', true, 1);

-- ===== PROYECTOS =====
INSERT INTO proyectos (id, titulo, slug, cliente, ciudad, region, pais, tipo_obra, fecha, reto, solucion, metricas, destacado, publicado, orden) VALUES
(
  'd1000000-0000-0000-0000-000000000001',
  'Reservorio de Lixiviación Minera',
  'reservorio-minero-arequipa',
  'Minera del Sur S.A.',
  'Arequipa', 'Arequipa', 'Perú',
  'Minería',
  '2024-06-01',
  'Construcción de reservorio de 50,000 m³ para lixiviación en zona de alta radiación UV y temperaturas extremas.',
  'Instalación de geomembrana HDPE de 2.0mm con soldadura termoplástica certificada. Sistema de subdrenaje con geocompuesto drenante.',
  '[{"indicador":"Área instalada","valor":"18,000 m²"},{"indicador":"Tiempo de ejecución","valor":"45 días"},{"indicador":"Garantía otorgada","valor":"10 años"}]',
  true, true, 1
),
(
  'd1000000-0000-0000-0000-000000000002',
  'Laguna de Riego Tecnificado',
  'laguna-agricola-ica',
  'Agroindustrias del Valle',
  'Ica', 'Ica', 'Perú',
  'Agricultura',
  '2024-03-01',
  'Almacenamiento de 25,000 m³ de agua para riego tecnificado. Zona desértica con alta evaporación.',
  'Geomembrana HDPE de 1.0mm con sistema antievaporación. Geotextil de protección en toda la superficie de contacto.',
  '[{"indicador":"Capacidad","valor":"25,000 m³"},{"indicador":"Área impermeabilizada","valor":"8,500 m²"},{"indicador":"Reducción de pérdidas","valor":"95%"}]',
  true, true, 2
),
(
  'd1000000-0000-0000-0000-000000000003',
  'Piscina Olímpica Hotel 5 Estrellas',
  'piscina-hotel-miraflores',
  'Hotel Continental Lima',
  'Lima', 'Lima', 'Perú',
  'Residencial',
  '2023-12-01',
  'Renovación completa de piscina olímpica de 25m con altos estándares de calidad.',
  'Instalación de liner PVC reforzado azul adriático con sistema de anclaje oculto.',
  '[{"indicador":"Dimensiones","valor":"25m x 12m"},{"indicador":"Tiempo de obra","valor":"15 días"},{"indicador":"Satisfacción cliente","valor":"100%"}]',
  true, true, 3
),
(
  'd1000000-0000-0000-0000-000000000004',
  'Celda de Relleno Sanitario',
  'relleno-sanitario-trujillo',
  'Municipalidad Provincial de Trujillo',
  'Trujillo', 'La Libertad', 'Perú',
  'Ambiental',
  '2023-08-01',
  'Impermeabilización de celda de 4 hectáreas para manejo de residuos sólidos.',
  'Sistema de doble barrera con geomembranas HDPE y geocompuesto drenante para captación de lixiviados.',
  '[{"indicador":"Área total","valor":"40,000 m²"},{"indicador":"Soldaduras realizadas","valor":"12,500 m"},{"indicador":"Ensayos de QC","valor":"100%"}]',
  false, true, 4
),
(
  'd1000000-0000-0000-0000-000000000005',
  'Reservorio de Agua Potable',
  'reservorio-ancash',
  'EPS Chavín S.A.',
  'Huaraz', 'Áncash', 'Perú',
  'Industrial',
  '2023-05-01',
  'Construcción de reservorio de 10,000 m³ para agua potable en zona de altura (3,200 msnm).',
  'Geomembrana HDPE certificada para contacto con agua potable. Sistema de anclaje perimetral reforzado.',
  '[{"indicador":"Volumen","valor":"10,000 m³"},{"indicador":"Población beneficiada","valor":"15,000 hab"}]',
  false, true, 5
);

-- ===== IMÁGENES DE PROYECTOS =====
INSERT INTO proyecto_imagenes (proyecto_id, storage_path, url_publica, tipo, descripcion, orden) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'proyectos/minera-antes.webp', 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800', 'antes', 'Terreno antes de la intervención', 1),
  ('d1000000-0000-0000-0000-000000000001', 'proyectos/minera-durante.webp', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', 'durante', 'Proceso de instalación', 2),
  ('d1000000-0000-0000-0000-000000000001', 'proyectos/minera-despues.webp', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', 'despues', 'Proyecto finalizado', 3),
  ('d1000000-0000-0000-0000-000000000002', 'proyectos/laguna.webp', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', 'despues', 'Laguna terminada', 1),
  ('d1000000-0000-0000-0000-000000000003', 'proyectos/piscina.webp', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800', 'despues', 'Piscina renovada', 1),
  ('d1000000-0000-0000-0000-000000000004', 'proyectos/relleno.webp', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800', 'durante', 'Instalación en proceso', 1),
  ('d1000000-0000-0000-0000-000000000005', 'proyectos/reservorio.webp', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', 'despues', 'Reservorio finalizado', 1);

-- ===== CERTIFICACIONES =====
INSERT INTO certificaciones (nombre, emisor, vigencia, descripcion, activa, orden) VALUES
  ('ISO 9001:2015', 'Bureau Veritas', '2024-2027', 'Sistema de Gestión de Calidad', true, 1),
  ('ISO 14001:2015', 'Bureau Veritas', '2024-2027', 'Sistema de Gestión Ambiental', true, 2),
  ('ASTM International', 'ASTM', 'Permanente', 'Normas Técnicas Internacionales', true, 3),
  ('GRI-GM13', 'GSI', 'Permanente', 'Especificación de Geomembranas', true, 4);

-- ===== CONFIGURACIÓN DEL SITIO =====
INSERT INTO configuracion_sitio (clave, valor, descripcion) VALUES
  ('empresa_nombre', '"GeoSintéticos Industrial"', 'Nombre de la empresa'),
  ('empresa_descripcion', '"Más de 25 años brindando soluciones de impermeabilización de alta calidad para proyectos de minería, agricultura, construcción y medio ambiente."', 'Descripción de la empresa'),
  ('empresa_mision', '"Proveer soluciones de impermeabilización de alta calidad, contribuyendo al desarrollo sostenible de proyectos de infraestructura en el país, con un equipo humano comprometido con la excelencia."', 'Misión de la empresa'),
  ('empresa_vision', '"Ser reconocidos como la empresa líder en soluciones geosintéticas a nivel latinoamericano, destacando por nuestra innovación tecnológica, calidad de servicio y compromiso ambiental."', 'Visión de la empresa'),
  ('empresa_valores', '["Calidad","Innovación","Compromiso","Integridad"]', 'Valores de la empresa'),
  ('contacto_telefono', '"+51 999 999 999"', 'Teléfono de contacto'),
  ('contacto_email', '"ventas@geosinteticos.com"', 'Email de contacto'),
  ('contacto_direccion', '"Av. Industrial 1234, Lima, Perú"', 'Dirección'),
  ('contacto_horario', '"Lun - Vie: 8:00 AM - 6:00 PM"', 'Horario de atención'),
  ('contacto_whatsapp', '"51999999999"', 'WhatsApp número'),
  ('redes_sociales', '{"facebook":"https://facebook.com/geosinteticos","instagram":"https://instagram.com/geosinteticos","linkedin":"https://linkedin.com/company/geosinteticos"}', 'Redes sociales'),
  ('estadisticas', '[{"numero":"25+","label":"Años de Experiencia"},{"numero":"500+","label":"Proyectos Realizados"},{"numero":"99+","label":"Clientes Satisfechos"},{"numero":"50+","label":"Productos Disponibles"},{"numero":"15+","label":"Técnicos Certificados"}]', 'Estadísticas del home');
