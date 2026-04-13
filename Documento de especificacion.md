**📋 Documento de Especificación de Requerimientos (SRS)**

**Sitio Web Corporativo \- Geosintéticos y Productos de Piscina**

---

**1\. INTRODUCCIÓN**

**1.1 Propósito del Documento**

Este documento establece los requerimientos funcionales y técnicos para el desarrollo de un sitio web corporativo e institucional enfocado en la presentación de productos geosintéticos y accesorios de piscina, incluyendo un portafolio de proyectos ejecutados.

**1.2 Alcance del Proyecto**

* **Nombre del Proyecto**: Portal Corporativo de Geosintéticos y Piscinas  
* **Tipo**: Aplicación Web Frontend (SPA \- Single Page Application)  
* **Objetivo**: Plataforma de presentación, catálogo informativo y generación de leads  
* **NO incluye**: Comercio electrónico, pasarela de pagos, gestión de inventario backend

**1.3 Audiencia Objetivo**

* **Primaria**: Empresas constructoras, mineras, agrícolas y clientes institucionales  
* **Secundaria**: Clientes residenciales interesados en productos de piscina  
* **Perfil**: Tomadores de decisiones que requieren información técnica detallada

---

**2\. DESCRIPCIÓN GENERAL DEL SISTEMA**

**2.1 Perspectiva del Producto**

Portal web informativo y de captación de leads que funciona como:

* Catálogo digital de productos técnicos  
* Portafolio corporativo de proyectos  
* Herramienta de generación de cotizaciones  
* Plataforma institucional de marca

**2.2 Funcionalidades Principales**

1. Catálogo de productos con fichas técnicas descargables  
2. Portafolio de proyectos con casos de éxito  
3. Información institucional y certificaciones  
4. Sistema de captación de leads (formularios y WhatsApp)  
5. Navegación responsive y moderna

---

**3\. REQUERIMIENTOS FUNCIONALES**

**3.1 MÓDULO A: CATÁLOGO DE PRODUCTOS**

**RF-A1: Estructura de Categorización**

* **ID**: RF-A1  
* **Prioridad**: Alta  
* **Descripción**: Sistema de categorización de dos niveles

**Especificaciones**:

Nivel 1 \- Categorías Principales:

├── Geosintéticos (Industrial/Obra Civil)

│   ├── Geomembranas

│   ├── Geotextiles

│   ├── Geodrenes

│   └── Accesorios de Instalación

│

└── Piscinas (Recreativo/Residencial)

	├── Liners para Piscina

	├── Accesorios de Piscina

	├── Sistemas de Filtración

	└── Químicos y Mantenimiento

**Criterios de Aceptación**:

* ✅ Menú de navegación que diferencie claramente ambas categorías  
* ✅ Filtros visuales con iconografía distintiva  
* ✅ Página de listado independiente por categoría  
* ✅ Contador de productos por categoría

---

**RF-A2: Ficha de Producto**

* **ID**: RF-A2  
* **Prioridad**: Alta  
* **Descripción**: Página detallada de cada producto

**Campos Obligatorios**:

{

  "id": "string",

  "nombre": "string",

  "categoria": "Geosintéticos | Piscinas",

  "subcategoria": "string",

  "descripcionCorta": "string (max 160 caracteres)",

  "descripcionDetallada": "string (HTML permitido)",

  "imagenes": \[

	{

  	"url": "string",

  	"alt": "string",

      "esPrincipal": "boolean"

	}

  \],

  "fichaTecnica": {

    "urlPDF": "string",

    "nombreArchivo": "string",

    "tamanioMB": "number"

  },

  "especificaciones": \[

	{

      "propiedad": "string",

      "valor": "string",

      "unidad": "string"

	}

  \],

  "aplicaciones": \["string"\],

  "certificaciones": \["string"\],

  "disponible": "boolean"

}

**Componentes UI**:

1. **Galería de imágenes** con zoom y thumbnails  
2. **Tabla de especificaciones técnicas** responsive  
3. **Botón de descarga PDF** con icono y animación de descarga  
4. **Botón "Solicitar Presupuesto"** destacado  
5. **Productos relacionados** (3-4 items)  
6. **Breadcrumb** de navegación

---

**RF-A3: Descarga de Fichas Técnicas**

* **ID**: RF-A3  
* **Prioridad**: Alta  
* **Descripción**: Sistema de descarga de documentos PDF

**Funcionalidad**:

// Comportamiento del botón

onClick: () \=\> {

  // 1\. Mostrar loading spinner

  // 2\. Descargar PDF desde carpeta /public/docs/

  // 3\. Registrar descarga (localStorage o analytics)

  // 4\. Mostrar notificación de éxito

}

**Criterios de Aceptación**:

* ✅ Descarga directa sin redirección  
* ✅ Nombres de archivo descriptivos: ficha-geomembrana-hdpe-1mm.pdf  
* ✅ Validación de existencia del archivo  
* ✅ Mensaje de error si el PDF no está disponible  
* ✅ Tracking de descargas (Google Analytics event)

---

**RF-A4: Botón de Cotización**

* **ID**: RF-A4  
* **Prioridad**: Alta  
* **Descripción**: Sistema de solicitud de presupuesto

**Opciones de Implementación**:

**Opción 1: Modal con Formulario**

Campos del Formulario:

\- Nombre completo\*

\- Empresa/Organización

\- Email\*

\- Teléfono\*

\- Tipo de proyecto\* (Dropdown)

\- Producto seleccionado (Pre-rellenado)

\- Cantidad aproximada / Metros cuadrados

\- Mensaje adicional

\- Checkbox: "Acepto política de privacidad"\*

**Opción 2: Enlace a WhatsApp**

// Mensaje pre-configurado

const mensaje \= \`Hola, estoy interesado en el producto: ${nombreProducto}.

Quisiera recibir una cotización para mi proyecto.\`;

 

const urlWhatsApp \= \`https://wa.me/51999999999?text=${encodeURIComponent(mensaje)}\`;

**Opción 3: Híbrida** (Recomendada)

* Botón principal: Abre modal con formulario  
* Botón secundario: "Cotizar por WhatsApp"

---

**3.2 MÓDULO B: PORTAFOLIO DE PROYECTOS**

**RF-B1: Estructura de Proyecto**

* **ID**: RF-B1  
* **Prioridad**: Alta  
* **Descripción**: Modelo de datos para casos de éxito

**Estructura JSON**:

{

  "id": "string",

  "titulo": "string",

  "cliente": "string (opcional)",

  "ubicacion": {

    "ciudad": "string",

    "region": "string",

	"pais": "string"

  },

  "tipoDeObra": "Minería | Agricultura | Residencial | Industrial | Ambiental",

  "fecha": "YYYY-MM",

  "reto": "string (200-300 caracteres)",

  "solucion": "string (300-500 caracteres)",

  "productosUtilizados": \[

	{

      "idProducto": "string",

      "nombreProducto": "string"

	}

  \],

  "metricas": \[

	{

      "indicador": "string",

      "valor": "string"

	}

  \],

  "galeria": \[

	{

  	"url": "string",

      "tipo": "antes | durante | despues",

      "descripcion": "string"

	}

  \],

  "destacado": "boolean"

}

**Ejemplo Real**:

json

{

  "titulo": "Impermeabilización de Reservorio Minero",

  "tipoDeObra": "Minería",

  "reto": "Construcción de reservorio de 50,000 m³ para lixiviación en zona de alta radiación UV y temperaturas extremas (-5°C a 35°C)",

  "solucion": "Instalación de geomembrana HDPE de 2.0mm con soldadura termoplástica certificada. Tiempo de instalación: 45 días.",

  "metricas": \[

    {"indicador": "Área instalada", "valor": "15,000 m²"},

    {"indicador": "Tiempo de ejecución", "valor": "45 días"},

    {"indicador": "Garantía", "valor": "10 años"}

  \]

}

---

**RF-B2: Sistema de Filtros**

* **ID**: RF-B2  
* **Prioridad**: Media  
* **Descripción**: Filtrado dinámico del portafolio

**Filtros Disponibles**:

1. **Por Tipo de Obra**: Minería, Agricultura, Residencial, Industrial, Ambiental  
2. **Por Año**: 2024, 2023, 2022, Más antiguos  
3. **Por Ubicación**: Dropdown de regiones/departamentos  
4. **Búsqueda por texto**: Buscar en título, reto y solución

**Comportamiento**:

// Los filtros son acumulativos (AND logic)

filtros \= {

  tipoObra: \["Minería", "Agricultura"\],

  anio: "2024",

  ubicacion: "Lima"

}

 

// Resultado: Proyectos que cumplan TODAS las condiciones

**Criterios de Aceptación**:

* ✅ Actualización en tiempo real sin reload  
* ✅ Contador de resultados: "Mostrando 8 de 45 proyectos"  
* ✅ Botón "Limpiar filtros"  
* ✅ Estado vacío con mensaje amigable

---

**RF-B3: Galería de Imágenes**

* **ID**: RF-B3  
* **Prioridad**: Alta  
* **Descripción**: Visualización de proceso constructivo

**Componentes UI**:

1. **Vista Grid (Página principal de portafolio)**:  
   ┌─────────────┬─────────────┬─────────────┐  
   │  Proyecto 1 │  Proyecto 2 │  Proyecto 3 │  
   │  \[Imagen\]   │  \[Imagen\]   │  \[Imagen\]   │  
   │  Título 	│  Título     │  Título 	│  
   │  Tipo   	│  Tipo       │  Tipo   	│  
   └─────────────┴─────────────┴─────────────┘  
2. **Vista Detalle (Página individual)**:  
   Tabs:  
   \[ Antes | Durante | Después \]  
      
   ┌──────────────────────────────────────┐  
   │                                  	│  
   │    	Imagen Principal          	│  
   │      	(Lightbox)              	│  
   │                                  	│  
   └──────────────────────────────────────┘  
      
   \[Thumbnail 1\] \[Thumbnail 2\] \[Thumbnail 3\]

**Características**:

* ✅ Lazy loading de imágenes  
* ✅ Lightbox/Modal para vista completa  
* ✅ Navegación con teclado (← →)  
* ✅ Etiquetas visuales: "Antes", "Durante", "Después"  
* ✅ Soporte para zoom

---

**3.3 MÓDULO C: SECCIONES INSTITUCIONALES**

**RF-C1: Página "Quiénes Somos"**

* **ID**: RF-C1  
* **Prioridad**: Media  
* **Descripción**: Información corporativa

**Secciones**:

1. **Hero Section**:  
   * Imagen de portada corporativa  
   * Tagline/Slogan  
   * Años de experiencia destacados  
2. **Historia de la Empresa**:  
   * Timeline interactivo (opcional)  
   * Hitos importantes  
3. **Misión y Visión**:  
   \<div class="mision-vision"\>  
     \<div class="card"\>  
   	\<icon\>🎯\</icon\>  
   	\<h3\>Misión\</h3\>  
   	\<p\>Texto de misión...\</p\>  
     \</div\>  
     \<div class="card"\>  
   	\<icon\>🔭\</icon\>  
   	\<h3\>Visión\</h3\>  
   	\<p\>Texto de visión...\</p\>  
     \</div\>  
   \</div\>  
4. **Valores Corporativos**:  
   * Grid de valores con iconos  
   * Calidad, Innovación, Compromiso, etc.  
5. **Certificaciones de Calidad** (⚠️ **MUY IMPORTANTE**):  
   ┌────────────────────────────────────────┐  
   │  Certificaciones y Acreditaciones      │  
   ├────────────────────────────────────────┤  
   │  \[Logo ISO 9001\]  \[Logo ISO 14001\] 	│  
   │  Gestión de  	Gestión           	│  
   │  Calidad     	Ambiental          	│  
   │                                    	│  
   │  \[Logo ASTM\] 	\[Certificado Lab\] 	│  
   │  Normas      	Fichas de         	│  
   │  Internacionales Laboratorio           │  
   └────────────────────────────────────────┘

**Datos de Certificaciones**:

{

  "certificaciones": \[

	{

      "nombre": "ISO 9001:2015",

      "emisor": "Bureau Veritas",

      "logo": "/images/certs/iso9001.png",

      "pdfCertificado": "/docs/certificado-iso9001.pdf",

      "vigencia": "2024-2027"

	},

	{

      "nombre": "Fichas Técnicas de Laboratorio",

      "descripcion": "Ensayos de tracción, punzonamiento y elongación según ASTM D",

      "urlDocumentos": "/certificaciones/laboratorio"

	}

  \]

}

---

**RF-C2: Página "Servicios"**

* **ID**: RF-C2  
* **Prioridad**: Alta  
* **Descripción**: Diferenciación de servicios ofrecidos

**Estructura de Servicios**:

1️⃣ Venta de Materiales

   ✓ Geomembranas HDPE/LLDPE/PVC

   ✓ Geotextiles tejidos y no tejidos

   ✓ Accesorios de piscina

   ✓ Envío a nivel nacional

 

2️⃣ Instalación Profesional

   ✓ Soldadura termoplástica certificada

   ✓ Control de calidad en obra

   ✓ Ensayos destructivos y no destructivos

   ✓ Personal técnico especializado

 

3️⃣ Asesoría Técnica

   ✓ Diseño de soluciones

   ✓ Cálculo de cantidades

   ✓ Especificaciones técnicas

   ✓ Supervisión de instalación

 

4️⃣ Post-Venta

   ✓ Garantías extendidas

   ✓ Mantenimiento preventivo

   ✓ Reparaciones

**Componente UI**:

* Cards expandibles o Accordions  
* Cada servicio con icono representativo  
* CTA específico: "Consultar por instalación"  
* Tabla comparativa: Solo Material vs Material \+ Instalación

---

**3.4 MÓDULO D: CONTACTO Y CAPTACIÓN**

**RF-D1: Formulario Avanzado de Contacto**

* **ID**: RF-D1  
* **Prioridad**: Alta  
* **Descripción**: Formulario de lead generation cualificado

**Estructura del Formulario**:

\<form id="contacto-avanzado"\>

  \<\!-- Información Personal \--\>

  \<input type="text" name="nombre" placeholder="Nombre completo\*" required\>

  \<input type="text" name="empresa" placeholder="Empresa/Organización"\>

  \<input type="email" name="email" placeholder="Email corporativo\*" required\>

  \<input type="tel" name="telefono" placeholder="Teléfono de contacto\*" required\>

 

  \<\!-- Información del Proyecto \--\>

  \<select name="tipoProyecto" required\>

	\<option value=""\>Tipo de proyecto\*\</option\>

	\<option value="mineria"\>Minería\</option\>

	\<option value="agricultura"\>Agricultura\</option\>

	\<option value="piscina-residencial"\>Piscina Residencial\</option\>

	\<option value="piscina-comercial"\>Piscina Comercial\</option\>

	\<option value="reservorio"\>Reservorio de Agua\</option\>

	\<option value="relleno-sanitario"\>Relleno Sanitario\</option\>

	\<option value="otro"\>Otro\</option\>

  \</select\>

 

  \<input type="number" name="metrosCuadrados" placeholder="Metros cuadrados aproximados"\>

 

  \<select name="tiempoEjecucion"\>

	\<option value=""\>Tiempo estimado de ejecución\</option\>

	\<option value="inmediato"\>Inmediato (menos de 1 mes)\</option\>

	\<option value="1-3-meses"\>1 a 3 meses\</option\>

	\<option value="3-6-meses"\>3 a 6 meses\</option\>

	\<option value="mas-6-meses"\>Más de 6 meses\</option\>

  \</select\>

 

  \<select name="servicioRequerido"\>

	\<option value=""\>Servicio requerido\*\</option\>

	\<option value="solo-material"\>Solo compra de material\</option\>

	\<option value="material-instalacion"\>Material \+ Instalación\</option\>

	\<option value="asesoria"\>Asesoría técnica\</option\>

  \</select\>

 

  \<textarea name="mensaje" placeholder="Cuéntanos más sobre tu proyecto..." rows="5"\>\</textarea\>

 

  \<\!-- Privacidad \--\>

  \<label\>

	\<input type="checkbox" name="politica" required\>

	Acepto la \<a href="/politica-privacidad"\>política de privacidad\</a\>\*

  \</label\>

 

  \<button type="submit"\>Enviar Consulta\</button\>

\</form\>

**Validaciones Frontend**:

validaciones \= {

  nombre: { min: 3, pattern: /^\[a-záéíóúñ\\s\]+$/i },

  email: { pattern: /^\[^\\s@\]+@\[^\\s@\]+\\.\[^\\s@\]+$/ },

  telefono: { pattern: /^\\+?\[\\d\\s-()\]+$/, min: 9 },

  metrosCuadrados: { min: 1, max: 1000000 }

}

**Manejo del Submit (Frontend)**:

// Como es solo frontend, simular envío

const handleSubmit \= async (formData) \=\> {

  // 1\. Validar campos

  if (\!validate(formData)) return;

 

  // 2\. Mostrar loading

  setLoading(true);

 

  // 3\. Simular envío a backend (localStorage o emailJS)

  await sendToEmailService(formData);

 

  // 4\. Mostrar mensaje de éxito

  showSuccessMessage();

 

  // 5\. Resetear formulario

  resetForm();

 

  // 6\. Redirect a página de agradecimiento (opcional)

  // router.push('/gracias');

};

---

**RF-D2: Botón Flotante de WhatsApp**

* **ID**: RF-D2  
* **Prioridad**: Alta  
* **Descripción**: Widget de contacto rápido por WhatsApp

**Especificaciones Técnicas**:

**Posicionamiento**:

css

.whatsapp-float {  position: fixed;  bottom: 20px;  right: 20px;  z-index: 1000;	/\* Responsive \*/  @media (max-width: 768px) {	bottom: 15px;	right: 15px;  }}

**Comportamiento**:

javascript

// Mensajes contextuales según la páginaconst mensajes \= {  homepage: "Hola, me gustaría recibir más información sobre sus productos.",  productos: \`Hola, estoy interesado en ${nombreProducto}. ¿Podrían enviarme una cotización?\`,  proyectos: "Hola, vi su portafolio de proyectos y me gustaría discutir mi proyecto.",  contacto: "Hola, prefiero comunicarme por WhatsApp. ¿Podemos conversar?"};// Número de WhatsAppconst numeroWhatsApp \= "+51999999999"; // ⚠️ Actualizar con número real// Generar URLconst url \= \`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}\`;

**Características**:

* ✅ Icono animado (pulse effect)  
* ✅ Tooltip al hacer hover: "¿Necesitas ayuda? Chatea con nosotros"  
* ✅ Badge con notificación (opcional): "¡Escríbenos\!"  
* ✅ Se oculta en la página de contacto (opcional)  
* ✅ Estado online/offline (horario de atención)

**Componente React/Vue Ejemplo**:

jsx

\<WhatsAppButton  phoneNumber="+51999999999"  message="Mensaje contextual"  showBadge={true}  badgeText="¡Escríbenos\!"  position="bottom-right"  tooltipText="Chatea con nosotros"/\>

---

**4\. REQUERIMIENTOS NO FUNCIONALES**

**4.1 Rendimiento (RNF-P)**

| ID | Requerimiento | Métrica |
| :---- | :---- | :---- |
| RNF-P1 | Tiempo de carga inicial | \< 3 segundos (First Contentful Paint) |
| RNF-P2 | Tiempo de carga de imágenes | Lazy loading, \< 1 segundo por imagen |
| RNF-P3 | Tamaño de bundle JavaScript | \< 500KB (gzipped) |
| RNF-P4 | Tamaño de imágenes | WebP/AVIF, \< 200KB por imagen |
| RNF-P5 | Score Lighthouse | \> 90 en Performance |

**Optimizaciones Requeridas**:

javascript

// 1\. Code Splittingimport { lazy, Suspense } from 'react';const Portafolio \= lazy(() \=\> import('./pages/Portafolio'));// 2\. Image Optimization\<Image  src="/products/geomembrana.jpg"  alt="Geomembrana HDPE"  width={800}  height={600}  loading="lazy"  placeholder="blur"/\>// 3\. Font Optimization// Usar font-display: swap@font-face {  font-family: 'CustomFont';  font-display: swap;}

---

**4.2 Usabilidad (RNF-U)**

| ID | Requerimiento | Criterio |
| :---- | :---- | :---- |
| RNF-U1 | Accesibilidad | WCAG 2.1 Level AA |
| RNF-U2 | Navegación | Máximo 3 clics para cualquier contenido |
| RNF-U3 | Mensajes de error | Claros, específicos y con solución |
| RNF-U4 | Feedback visual | Todos los botones con estados hover/active/disabled |
| RNF-U5 | Búsqueda | Resultados en \< 500ms |

---

**4.3 Diseño Responsive (RNF-R)**

**Breakpoints Obligatorios**:

css

/\* Mobile First Approach \*/:root {  \--mobile: 320px;  \--tablet: 768px;  \--desktop: 1024px;  \--desktop-lg: 1440px;}/\* Diseño específico \*/@media (min-width: 320px)  { /\* Mobile \*/ }@media (min-width: 768px)  { /\* Tablet \*/ }@media (min-width: 1024px) { /\* Desktop \*/ }@media (min-width: 1440px) { /\* Large Desktop \*/ }

**Pruebas Requeridas**:

* ✅ iPhone SE (375x667)  
* ✅ iPhone 12/13 Pro (390x844)  
* ✅ iPad (768x1024)  
* ✅ iPad Pro (1024x1366)  
* ✅ Desktop 1920x1080

---

**4.4 Compatibilidad de Navegadores (RNF-C)**

| Navegador | Versión Mínima | Soporte |
| :---- | :---- | :---- |
| Chrome | 90+ | ✅ Completo |
| Firefox | 88+ | ✅ Completo |
| Safari | 14+ | ✅ Completo |
| Edge | 90+ | ✅ Completo |
| Opera | 76+ | ⚠️ Básico |
| IE 11 | \- | ❌ No soportado |

---

**4.5 SEO (RNF-SEO)**

| ID | Requerimiento | Implementación |
| :---- | :---- | :---- |
| RNF-SEO1 | Meta tags | Únicos por página |
| RNF-SEO2 | Estructura HTML | Semántica (header, nav, main, article, aside, footer) |
| RNF-SEO3 | URLs | Amigables: /productos/geomembranas/hdpe-1mm |
| RNF-SEO4 | Sitemap | sitemap.xml generado |
| RNF-SEO5 | Schema.org | Marcado de productos y organización |
| RNF-SEO6 | Open Graph | Metadatos para redes sociales |

**Ejemplo de Meta Tags**:

html

\<head\>  \<title\>Geomembranas HDPE \- Impermeabilización Industrial | Empresa\</title\>  \<meta name="description" content="Geomembranas HDPE de alta calidad para proyectos mineros, agrícolas y ambientales. Instalación certificada y asesoría técnica."\>  \<meta name="keywords" content="geomembrana, HDPE, impermeabilización, minería, agricultura"\>	\<\!-- Open Graph \--\>  \<meta property="og:title" content="Geomembranas HDPE \- Empresa"\>  \<meta property="og:description" content="Soluciones de impermeabilización..."\>  \<meta property="og:image" content="https://ejemplo.com/og-image.jpg"\>	\<\!-- Schema.org \--\>  \<script type="application/ld+json"\>  {	"@context": "https://schema.org",    "@type": "Product",	"name": "Geomembrana HDPE 1.0mm",	"description": "...",	"offers": {  	"@type": "Offer",      "availability": "https://schema.org/InStock"	}  }  \</script\>\</head\>

---

**5\. ARQUITECTURA Y TECNOLOGÍAS SUGERIDAS**

**5.1 Stack Tecnológico Recomendado**

**Opción 1: React \+ Next.js (⭐ Recomendado)**

Frontend Framework: Next.js 14+ (App Router)UI Library: React 18+Styling: Tailwind CSS \+ shadcn/uiState Management: Zustand o Context APIForms: React Hook Form \+ ZodAnimations: Framer MotionIcons: Lucide React

**Ventajas**:

* ✅ SSR/SSG para mejor SEO  
* ✅ Image optimization nativo  
* ✅ File-based routing  
* ✅ Gran ecosistema de componentes  
* ✅ Excelente documentación

---

**Opción 2: Vue 3 \+ Nuxt 3**

Frontend Framework: Nuxt 3UI Library: Vue 3 (Composition API)Styling: Tailwind CSS \+ PrimeVueState Management: PiniaForms: VeeValidateAnimations: Vue TransitionIcons: Heroicons

---

**Opción 3: Astro (Para sitios muy estáticos)**

Framework: Astro 4+Islands: React/Vue componentsStyling: Tailwind CSSCMS: Markdown \+ Frontmatter

---

**5.2 Estructura de Carpetas (Next.js)**

proyecto-web/

├── public/

│   ├── images/

│   │   ├── products/

│   │   ├── projects/

│   │   ├── certifications/

│   │   └── logos/

│   ├── docs/

│   │   ├── fichas-tecnicas/

│   │   └── certificados/

│   └── fonts/

│

├── src/

│   ├── app/

│   │   ├── (home)/

│   │   │   └── page.tsx

│   │   ├── productos/

│   │   │   ├── page.tsx\*

