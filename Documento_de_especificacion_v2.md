# 📋 Documento de Especificación de Requerimientos (SRS) v2.0

## Sitio Web Corporativo — Geosintéticos y Productos de Piscina

**Versión**: 2.0  
**Fecha de actualización**: Febrero 2026  
**Cambio principal**: Incorporación de backend con Supabase (base de datos + autenticación) y panel de administración CMS

---

## 1. INTRODUCCIÓN

### 1.1 Propósito del Documento

Este documento establece los requerimientos funcionales y técnicos para el desarrollo de un sitio web corporativo con backend administrable, enfocado en la presentación de productos geosintéticos y accesorios de piscina, incluyendo un portafolio de proyectos ejecutados y un panel de administración para gestión de contenido.

### 1.2 Alcance del Proyecto

- **Nombre del Proyecto**: Portal Corporativo de Geosintéticos y Piscinas
- **Tipo**: Aplicación Web Full-Stack (Next.js + Supabase)
- **Objetivo**: Plataforma de presentación, catálogo informativo, generación de leads y gestión de contenido desde panel administrativo
- **NO incluye**: Comercio electrónico, pasarela de pagos, gestión de inventario avanzado

### 1.3 Cambios Respecto a v1.0

| Aspecto | v1.0 (Solo Frontend) | v2.0 (Full-Stack) |
|---|---|---|
| Datos | JSON estáticos / hardcoded | Supabase PostgreSQL |
| Autenticación | No aplica | Supabase Auth (admins) |
| Imágenes/PDFs | Carpeta `/public` | Supabase Storage |
| Formularios | EmailJS / simulado | Supabase (tabla leads) |
| Gestión de contenido | Editar código | Panel CMS administrable |
| Despliegue | Estático (Vercel) | Next.js + Supabase Cloud |

### 1.4 Audiencia Objetivo

- **Primaria**: Empresas constructoras, mineras, agrícolas y clientes institucionales
- **Secundaria**: Clientes residenciales interesados en productos de piscina
- **Administradores**: Personal interno que gestiona el contenido del sitio

---

## 2. DESCRIPCIÓN GENERAL DEL SISTEMA

### 2.1 Perspectiva del Producto

Portal web full-stack que funciona como:

- Catálogo digital de productos técnicos (administrable)
- Portafolio corporativo de proyectos (administrable)
- Herramienta de generación y seguimiento de cotizaciones/leads
- Plataforma institucional de marca con CMS integrado

### 2.2 Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│                  USUARIO FINAL                      │
│            (Clientes / Visitantes)                  │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼─────────────────────────────┐
│            NEXT.JS APP (Frontend + API Routes)       │
│  ┌────────────────┐   ┌──────────────────────────┐  │
│  │  Sitio Público │   │   Panel Administración   │  │
│  │  (SSR / SSG)   │   │   /admin (Protegido)     │  │
│  └────────────────┘   └──────────────────────────┘  │
└───────────────────────┬─────────────────────────────┘
                        │ Supabase Client / REST
┌───────────────────────▼─────────────────────────────┐
│                    SUPABASE                         │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │  PostgreSQL  │ │    Auth      │ │   Storage   │ │
│  │  (Tablas)    │ │  (Admins)    │ │  (Archivos) │ │
│  └──────────────┘ └──────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────┘
```

### 2.3 Funcionalidades Principales

1. Catálogo de productos con fichas técnicas descargables (gestionado desde admin)
2. Portafolio de proyectos con casos de éxito (gestionado desde admin)
3. Información institucional y certificaciones (editable desde admin)
4. Sistema de captación y seguimiento de leads (formularios y WhatsApp)
5. Panel de administración protegido con Supabase Auth
6. Gestión de archivos (imágenes, PDFs) en Supabase Storage

---

## 3. MÓDULO DE AUTENTICACIÓN Y ADMINISTRACIÓN

### RF-ADM0: Sistema de Autenticación con Supabase Auth

- **ID**: RF-ADM0
- **Prioridad**: Alta
- **Descripción**: Control de acceso al panel de administración mediante Supabase Auth

**Especificaciones**:

```typescript
// Proveedor: Supabase Auth (Email + Password)
// Solo para administradores internos — NO registro público

// Configuración supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Login de administrador
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@empresa.com',
  password: '...'
})

// Protección de rutas /admin con middleware de Next.js
// middleware.ts
export async function middleware(request: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

**Roles**:

| Rol | Permisos |
|---|---|
| `super_admin` | Acceso total, crear otros admins |
| `editor` | Crear/editar productos, proyectos, contenido |
| `viewer` | Solo lectura del panel (ver leads/estadísticas) |

**Implementación de Roles (RLS en Supabase)**:

```sql
-- Tabla de perfiles con roles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  rol TEXT CHECK (rol IN ('super_admin', 'editor', 'viewer')) DEFAULT 'viewer',
  nombre TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security: solo admins pueden ver profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE rol = 'super_admin'));
```

**Criterios de Aceptación**:

- ✅ Login con email/password en `/admin/login`
- ✅ Redirección automática si no autenticado
- ✅ Sesión persistente con refresh tokens de Supabase
- ✅ Logout con invalidación de sesión
- ✅ Página de acceso denegado para roles insuficientes

---

### RF-ADM1: Panel de Administración (CMS)

- **ID**: RF-ADM1
- **Prioridad**: Alta
- **Descripción**: Interfaz para gestionar todo el contenido del sitio

**Estructura del Panel**:

```
/admin
├── /dashboard          — Resumen: leads recientes, productos, proyectos
├── /productos
│   ├── /lista          — Tabla con todos los productos
│   ├── /nuevo          — Formulario crear producto
│   └── /[id]/editar    — Formulario editar producto
├── /proyectos
│   ├── /lista
│   ├── /nuevo
│   └── /[id]/editar
├── /leads              — Tabla de cotizaciones recibidas
├── /configuracion
│   ├── /empresa        — Info corporativa, misión, visión, valores
│   ├── /certificaciones
│   └── /usuarios       — Gestión de admins (solo super_admin)
└── /archivos           — Explorador de Supabase Storage
```

---

## 4. REQUERIMIENTOS FUNCIONALES — MÓDULO A: CATÁLOGO DE PRODUCTOS

### RF-A1: Estructura de Categorización

- **ID**: RF-A1
- **Prioridad**: Alta
- **Descripción**: Categorías gestionadas desde Supabase, no hardcodeadas

**Schema de Base de Datos**:

```sql
-- Categorías
CREATE TABLE categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  icono_url TEXT,
  orden INT DEFAULT 0,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subcategorías
CREATE TABLE subcategorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL,
  descripcion TEXT,
  orden INT DEFAULT 0,
  activa BOOLEAN DEFAULT true
);
```

**Categorías Iniciales (seed)**:

- Geosintéticos → [Geomembranas, Geotextiles, Geodrenes, Accesorios de Instalación]
- Piscinas → [Liners para Piscina, Accesorios de Piscina, Sistemas de Filtración, Químicos y Mantenimiento]

**Criterios de Aceptación**:

- ✅ Categorías y subcategorías editables desde el panel admin
- ✅ Menú de navegación público generado dinámicamente desde Supabase
- ✅ Contador de productos por categoría calculado con query
- ✅ Reordenamiento con drag-and-drop en el panel (campo `orden`)

---

### RF-A2: Ficha de Producto (con Backend)

- **ID**: RF-A2
- **Prioridad**: Alta
- **Descripción**: Productos gestionados en Supabase con imágenes en Storage

**Schema de Base de Datos**:

```sql
CREATE TABLE productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  categoria_id UUID REFERENCES categorias(id),
  subcategoria_id UUID REFERENCES subcategorias(id),
  descripcion_corta TEXT CHECK (char_length(descripcion_corta) <= 160),
  descripcion_detallada TEXT,  -- HTML permitido (sanitizado en frontend)
  especificaciones JSONB DEFAULT '[]',
  -- [{"propiedad": "Espesor", "valor": "1.0", "unidad": "mm"}]
  aplicaciones TEXT[] DEFAULT '{}',
  certificaciones TEXT[] DEFAULT '{}',
  disponible BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  orden INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Imágenes de productos (almacenadas en Supabase Storage)
CREATE TABLE producto_imagenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,  -- path en Supabase Storage
  url_publica TEXT NOT NULL,    -- URL pública generada
  alt TEXT,
  es_principal BOOLEAN DEFAULT false,
  orden INT DEFAULT 0
);

-- Fichas técnicas PDF
CREATE TABLE producto_fichas_tecnicas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url_publica TEXT NOT NULL,
  nombre_archivo TEXT NOT NULL,
  tamanio_mb NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Row Level Security**:

```sql
-- Lectura pública: todos pueden ver productos disponibles
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Productos visibles al público"
  ON productos FOR SELECT
  USING (disponible = true);

-- Escritura: solo usuarios autenticados (admins)
CREATE POLICY "Solo admins pueden modificar productos"
  ON productos FOR ALL
  USING (auth.role() = 'authenticated');
```

---

### RF-A3: Gestión de Archivos en Supabase Storage

- **ID**: RF-A3
- **Prioridad**: Alta
- **Descripción**: Imágenes y PDFs almacenados en buckets de Supabase Storage

**Configuración de Buckets**:

```
Supabase Storage
├── productos-imagenes/     (público, imágenes webp/jpg)
│   └── {producto_id}/image_01.webp
├── productos-pdfs/         (público, fichas técnicas)
│   └── {producto_id}/ficha-tecnica.pdf
├── proyectos-imagenes/     (público)
│   └── {proyecto_id}/antes/img_01.webp
└── certificaciones/        (público)
    └── iso9001.pdf
```

**Implementación de Upload (Panel Admin)**:

```typescript
// Upload de imagen de producto
const uploadProductImage = async (file: File, productoId: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${productoId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('productos-imagenes')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('productos-imagenes')
    .getPublicUrl(fileName)

  // Guardar referencia en base de datos
  await supabase.from('producto_imagenes').insert({
    producto_id: productoId,
    storage_path: fileName,
    url_publica: publicUrl,
  })

  return publicUrl
}
```

**Políticas de Storage**:

```sql
-- Lectura pública para todos los buckets de contenido
CREATE POLICY "Imágenes públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('productos-imagenes', 'proyectos-imagenes', 'certificaciones'));

-- Solo admins autenticados pueden subir/eliminar
CREATE POLICY "Solo admins pueden subir archivos"
  ON storage.objects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

---

### RF-A4: Botón de Cotización (con persistencia en Supabase)

- **ID**: RF-A4
- **Prioridad**: Alta
- **Descripción**: Las solicitudes de cotización se guardan en Supabase y son visibles en el panel admin

**Schema**:

```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  empresa TEXT,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo_proyecto TEXT,
  producto_id UUID REFERENCES productos(id),
  producto_nombre TEXT,   -- Copia desnormalizada
  metros_cuadrados NUMERIC,
  tiempo_ejecucion TEXT,
  servicio_requerido TEXT,
  mensaje TEXT,
  acepto_politica BOOLEAN DEFAULT false,
  canal TEXT DEFAULT 'formulario',   -- 'formulario' | 'whatsapp'
  estado TEXT DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'cotizado', 'cerrado', 'descartado')),
  notas_internas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**API Route (Next.js)**:

```typescript
// app/api/leads/route.ts
export async function POST(req: Request) {
  const body = await req.json()

  // Validar con Zod
  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error }, { status: 400 })
  }

  // Guardar en Supabase usando service_role (sin RLS)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin.from('leads').insert(parsed.data)
  if (error) return Response.json({ error }, { status: 500 })

  // Opcional: enviar email de notificación al equipo
  await sendNotificationEmail(parsed.data)

  return Response.json({ success: true }, { status: 201 })
}
```

**RLS para leads**:

```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- Inserción pública (cualquiera puede enviar formulario vía API route)
CREATE POLICY "Inserción pública de leads"
  ON leads FOR INSERT WITH CHECK (true);
-- Lectura y edición solo admins
CREATE POLICY "Solo admins ven leads"
  ON leads FOR SELECT USING (auth.role() = 'authenticated');
```

---

## 5. REQUERIMIENTOS FUNCIONALES — MÓDULO B: PORTAFOLIO DE PROYECTOS

### RF-B1: Estructura de Proyecto (con Backend)

- **ID**: RF-B1
- **Prioridad**: Alta
- **Descripción**: Proyectos gestionados completamente desde Supabase

**Schema de Base de Datos**:

```sql
CREATE TABLE proyectos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cliente TEXT,
  ciudad TEXT,
  region TEXT,
  pais TEXT DEFAULT 'Perú',
  tipo_obra TEXT CHECK (tipo_obra IN ('Minería', 'Agricultura', 'Residencial', 'Industrial', 'Ambiental')),
  fecha DATE,
  reto TEXT CHECK (char_length(reto) <= 300),
  solucion TEXT CHECK (char_length(solucion) <= 500),
  metricas JSONB DEFAULT '[]',
  -- [{"indicador": "Área instalada", "valor": "15,000 m²"}]
  destacado BOOLEAN DEFAULT false,
  publicado BOOLEAN DEFAULT false,
  orden INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Productos utilizados en el proyecto
CREATE TABLE proyecto_productos (
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  nombre_producto TEXT NOT NULL,  -- Copia desnormalizada
  PRIMARY KEY (proyecto_id, producto_id)
);

-- Galería de imágenes del proyecto
CREATE TABLE proyecto_imagenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url_publica TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('antes', 'durante', 'despues', 'general')),
  descripcion TEXT,
  orden INT DEFAULT 0
);
```

---

### RF-B2: Sistema de Filtros (Dinámico desde BD)

- **ID**: RF-B2
- **Prioridad**: Media

**Query con filtros dinámicos**:

```typescript
// Obtener proyectos con filtros
const getProyectos = async (filtros: FiltrosPortafolio) => {
  let query = supabase
    .from('proyectos')
    .select(`
      *,
      proyecto_imagenes(url_publica, tipo, orden),
      proyecto_productos(nombre_producto)
    `)
    .eq('publicado', true)
    .order('fecha', { ascending: false })

  if (filtros.tipoObra) {
    query = query.eq('tipo_obra', filtros.tipoObra)
  }
  if (filtros.anio) {
    query = query.gte('fecha', `${filtros.anio}-01-01`)
                 .lte('fecha', `${filtros.anio}-12-31`)
  }
  if (filtros.region) {
    query = query.eq('region', filtros.region)
  }
  if (filtros.busqueda) {
    query = query.or(`titulo.ilike.%${filtros.busqueda}%,reto.ilike.%${filtros.busqueda}%`)
  }

  return query
}
```

---

## 6. REQUERIMIENTOS FUNCIONALES — MÓDULO C: SECCIONES INSTITUCIONALES

### RF-C1: Contenido Institucional Editable

- **ID**: RF-C1
- **Prioridad**: Media
- **Descripción**: Textos de "Quiénes Somos", misión, visión, valores, editables desde el panel

**Schema**:

```sql
-- Configuración general del sitio (key-value)
CREATE TABLE configuracion_sitio (
  clave TEXT PRIMARY KEY,
  valor JSONB NOT NULL,
  descripcion TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ejemplo de claves almacenadas:
-- 'empresa_nombre', 'empresa_descripcion', 'empresa_mision',
-- 'empresa_vision', 'empresa_valores', 'empresa_logo_url',
-- 'contacto_telefono', 'contacto_whatsapp', 'contacto_email',
-- 'redes_sociales', 'anos_experiencia'

-- Certificaciones
CREATE TABLE certificaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  emisor TEXT,
  logo_storage_path TEXT,
  logo_url TEXT,
  pdf_storage_path TEXT,
  pdf_url TEXT,
  vigencia TEXT,
  descripcion TEXT,
  activa BOOLEAN DEFAULT true,
  orden INT DEFAULT 0
);
```

**Carga en el Frontend (SSG/ISR)**:

```typescript
// app/nosotros/page.tsx - Generación estática con revalidación
export const revalidate = 3600  // revalidar cada hora

export default async function NosotrosPage() {
  const [{ data: config }, { data: certificaciones }] = await Promise.all([
    supabase.from('configuracion_sitio').select('*'),
    supabase.from('certificaciones').select('*').eq('activa', true).order('orden')
  ])

  return <NosotrosSections config={config} certificaciones={certificaciones} />
}
```

---

## 7. REQUERIMIENTOS FUNCIONALES — MÓDULO D: CONTACTO Y LEADS

### RF-D1: Formulario Avanzado de Contacto (con Supabase)

- **ID**: RF-D1
- **Prioridad**: Alta
- **Descripción**: Formulario que guarda directamente en Supabase tabla `leads`

**Submit Handler Actualizado**:

```typescript
const handleSubmit = async (formData: LeadFormData) => {
  // 1. Validar con Zod (frontend)
  const parsed = leadSchema.safeParse(formData)
  if (!parsed.success) return setErrors(parsed.error)

  setLoading(true)

  try {
    // 2. Enviar a API Route de Next.js (que usa service_role de Supabase)
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data)
    })

    if (!res.ok) throw new Error('Error al enviar')

    // 3. Mostrar mensaje de éxito
    showSuccessMessage()
    resetForm()

  } catch (error) {
    showErrorMessage()
  } finally {
    setLoading(false)
  }
}
```

---

### RF-D2: Panel de Leads en Admin

- **ID**: RF-D2
- **Prioridad**: Alta
- **Descripción**: Visualización y gestión de leads recibidos desde el panel de administración

**Funcionalidades**:

- Tabla con todos los leads ordenados por fecha
- Filtrar por estado: Nuevo / Contactado / Cotizado / Cerrado / Descartado
- Cambiar estado de lead con dropdown
- Añadir notas internas
- Exportar a CSV
- Indicador de leads nuevos en el dashboard

---

## 8. ESQUEMA COMPLETO DE BASE DE DATOS

### 8.1 Diagrama de Tablas

```
auth.users (Supabase)
    └── profiles (id, rol, nombre)

categorias
    └── subcategorias (categoria_id)

productos (categoria_id, subcategoria_id)
    ├── producto_imagenes (producto_id) → Storage: productos-imagenes/
    └── producto_fichas_tecnicas (producto_id) → Storage: productos-pdfs/

proyectos
    ├── proyecto_imagenes (proyecto_id) → Storage: proyectos-imagenes/
    └── proyecto_productos (proyecto_id, producto_id)

leads (producto_id opcional)

certificaciones → Storage: certificaciones/

configuracion_sitio (key-value general)
```

### 8.2 Script SQL Completo de Inicialización

```sql
-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a tablas con updated_at
CREATE TRIGGER trg_productos_updated
  BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_proyectos_updated
  BEFORE UPDATE ON proyectos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 9. ARQUITECTURA Y TECNOLOGÍAS

### 9.1 Stack Tecnológico

```
Frontend:     Next.js 14+ (App Router)
UI Library:   React 18+
Styling:      Tailwind CSS + shadcn/ui
Forms:        React Hook Form + Zod
Animations:   Framer Motion
Icons:        Lucide React

Backend:
Database:     Supabase (PostgreSQL)
Auth:         Supabase Auth (Email/Password)
Storage:      Supabase Storage (S3-compatible)
API:          Next.js API Routes (server actions)

Despliegue:
Frontend:     Vercel
Backend:      Supabase Cloud (o self-hosted)
```

### 9.2 Variables de Entorno Requeridas

```env
# Supabase — Pública (expuesta al cliente)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Supabase — Privada (solo servidor, NUNCA al cliente)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Opcionales
NEXT_PUBLIC_WHATSAPP_NUMBER=+51999999999
NOTIFICATION_EMAIL=ventas@empresa.com
```

### 9.3 Estructura de Carpetas Actualizada (Next.js)

```
proyecto-web/
├── app/
│   ├── (public)/                   — Rutas públicas
│   │   ├── page.tsx                — Home
│   │   ├── productos/
│   │   │   ├── page.tsx            — Listado productos (SSG + ISR)
│   │   │   └── [slug]/page.tsx     — Detalle producto (SSG)
│   │   ├── proyectos/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── nosotros/page.tsx
│   │   ├── servicios/page.tsx
│   │   └── contacto/page.tsx
│   │
│   ├── (admin)/                    — Panel administración (protegido)
│   │   ├── layout.tsx              — Layout admin con verificación de sesión
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── productos/
│   │   │   │   ├── page.tsx        — Listado
│   │   │   │   ├── nuevo/page.tsx
│   │   │   │   └── [id]/page.tsx   — Editar
│   │   │   ├── proyectos/ (ídem)
│   │   │   ├── leads/page.tsx
│   │   │   └── configuracion/
│   │   └── login/page.tsx
│   │
│   └── api/                        — API Routes
│       ├── leads/route.ts          — POST de cotizaciones
│       └── revalidate/route.ts     — Revalidación de caché ISR
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               — Cliente Supabase (browser)
│   │   ├── server.ts               — Cliente Supabase (server, service_role)
│   │   └── types.ts                — Tipos generados con `supabase gen types`
│   └── validations/
│       └── lead.schema.ts          — Zod schemas
│
├── components/
│   ├── public/                     — Componentes sitio público
│   └── admin/                      — Componentes panel admin
│
└── middleware.ts                   — Protección de rutas /admin
```

---

## 10. REQUERIMIENTOS NO FUNCIONALES

### 10.1 Rendimiento (RNF-P)

| ID | Requerimiento | Métrica |
|---|---|---|
| RNF-P1 | Tiempo de carga inicial | < 3s (First Contentful Paint) |
| RNF-P2 | Páginas de productos | SSG con ISR (revalidar cada 1 hora) |
| RNF-P3 | Tamaño de bundle JS | < 500KB (gzipped) |
| RNF-P4 | Imágenes en Storage | WebP/AVIF, < 200KB por imagen |
| RNF-P5 | Score Lighthouse | > 90 en Performance |
| RNF-P6 | Queries a Supabase | Índices en slug, categoria_id, disponible |

**Estrategia de Caché con Next.js + Supabase**:

```typescript
// SSG con revalidación incremental (ISR)
// Los productos se regeneran cada hora sin rebuild completo
export const revalidate = 3600

// generateStaticParams para pre-renderizar páginas de productos
export async function generateStaticParams() {
  const { data } = await supabase
    .from('productos')
    .select('slug')
    .eq('disponible', true)
  return data?.map(p => ({ slug: p.slug })) ?? []
}
```

### 10.2 Seguridad (RNF-S)

| ID | Requerimiento | Implementación |
|---|---|---|
| RNF-S1 | Autenticación admin | Supabase Auth con JWT |
| RNF-S2 | Autorización de datos | Row Level Security (RLS) en todas las tablas |
| RNF-S3 | Service Role Key | Nunca expuesta al cliente, solo en API Routes del servidor |
| RNF-S4 | Sanitización HTML | DOMPurify para `descripcion_detallada` antes de renderizar |
| RNF-S5 | Rate limiting | Middleware en `/api/leads` para prevenir spam |
| RNF-S6 | CORS | Configurado en Next.js para permitir solo dominios propios |

### 10.3 Usabilidad del Panel Admin (RNF-UA)

| ID | Requerimiento | Criterio |
|---|---|---|
| RNF-UA1 | Feedback de operaciones | Toast de éxito/error en cada acción |
| RNF-UA2 | Confirmación de borrado | Modal de confirmación antes de eliminar |
| RNF-UA3 | Upload de archivos | Progress bar durante upload a Storage |
| RNF-UA4 | Preview de imágenes | Vista previa antes de confirmar upload |
| RNF-UA5 | Formularios | Auto-guardado en borrador (localStorage como backup) |

### 10.4 SEO, Responsive y Compatibilidad

_(Sin cambios respecto a v1.0 — ver secciones 4.2, 4.3, 4.4, 4.5 del documento original)_

---

## 11. PLAN DE IMPLEMENTACIÓN

### Fase 1 — Configuración Base (Semana 1)

1. Crear proyecto en Supabase (Cloud)
2. Ejecutar script SQL de creación de tablas
3. Configurar RLS en todas las tablas
4. Crear buckets en Supabase Storage con políticas
5. Configurar variables de entorno en Next.js
6. Implementar cliente Supabase (browser + server)
7. Generar tipos TypeScript con `supabase gen types typescript`

### Fase 2 — Panel de Administración (Semana 2-3)

1. Login con Supabase Auth
2. Middleware de protección de rutas `/admin`
3. CRUD de productos (con upload de imágenes y PDFs a Storage)
4. CRUD de proyectos (con galería)
5. Gestión de categorías
6. Panel de configuración del sitio

### Fase 3 — Sitio Público (Semana 4-5)

1. Reemplazar datos estáticos por queries a Supabase
2. Implementar SSG + ISR en páginas de productos y proyectos
3. API Route para recepción de leads
4. Formularios de contacto/cotización conectados

### Fase 4 — Panel de Leads y Pulido (Semana 6)

1. Tabla de leads en admin con filtros y cambio de estado
2. Notificaciones de nuevos leads (email)
3. Optimizaciones de rendimiento e índices
4. Pruebas end-to-end
5. Despliegue en producción (Vercel + Supabase Cloud)

---

## 12. GLOSARIO DE TÉRMINOS TÉCNICOS

| Término | Definición |
|---|---|
| **Supabase** | Plataforma open-source de backend (PostgreSQL + Auth + Storage + Realtime) |
| **RLS** | Row Level Security — Políticas de seguridad a nivel de fila en PostgreSQL |
| **SSG** | Static Site Generation — Páginas pre-generadas en tiempo de build |
| **ISR** | Incremental Static Regeneration — SSG con revalidación periódica sin rebuild |
| **Service Role Key** | Clave de Supabase con permisos totales; usar solo en servidor |
| **Anon Key** | Clave pública de Supabase; respeta las políticas RLS |
| **Storage Bucket** | Contenedor de archivos en Supabase Storage |
| **API Route** | Endpoint de servidor en Next.js (app/api/) |
| **Middleware** | Función de Next.js que intercepta requests para proteger rutas |
| **Slug** | Identificador URL amigable: `geomembrana-hdpe-1mm` |
| **JSONB** | Tipo de dato PostgreSQL para almacenar JSON con indexado eficiente |

---

*Documento de Especificación de Requerimientos v2.0 — Portal Corporativo Geosintéticos y Piscinas*  
*Última actualización: Febrero 2026*
