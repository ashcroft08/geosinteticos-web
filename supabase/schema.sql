-- =====================================================
-- SCHEMA SQL — Portal Geosintéticos
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===== TRIGGER PARA updated_at =====
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- ===== PROFILES (enlazado a auth.users) =====
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  rol TEXT CHECK (rol IN ('super_admin', 'editor', 'viewer')) DEFAULT 'viewer',
  nombre TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios autenticados pueden ver profiles"
  ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Solo super_admin puede modificar profiles"
  ON profiles FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE rol = 'super_admin')
  );

-- ===== CATEGORÍAS =====
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

ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de categorías"
  ON categorias FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican categorías"
  ON categorias FOR ALL USING (auth.role() = 'authenticated');

-- ===== SUBCATEGORÍAS =====
CREATE TABLE subcategorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL,
  descripcion TEXT,
  orden INT DEFAULT 0,
  activa BOOLEAN DEFAULT true
);

ALTER TABLE subcategorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de subcategorías"
  ON subcategorias FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican subcategorías"
  ON subcategorias FOR ALL USING (auth.role() = 'authenticated');

-- ===== PRODUCTOS =====
CREATE TABLE productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  categoria_id UUID REFERENCES categorias(id),
  subcategoria_id UUID REFERENCES subcategorias(id),
  descripcion_corta TEXT CHECK (char_length(descripcion_corta) <= 300),
  descripcion_detallada TEXT,
  especificaciones JSONB DEFAULT '[]',
  aplicaciones TEXT[] DEFAULT '{}',
  certificaciones TEXT[] DEFAULT '{}',
  disponible BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  orden INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_productos_updated
  BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_productos_slug ON productos(slug);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_disponible ON productos(disponible);

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de productos"
  ON productos FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican productos"
  ON productos FOR ALL USING (auth.role() = 'authenticated');

-- ===== IMÁGENES DE PRODUCTOS =====
CREATE TABLE producto_imagenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url_publica TEXT NOT NULL,
  alt TEXT,
  es_principal BOOLEAN DEFAULT false,
  orden INT DEFAULT 0
);

ALTER TABLE producto_imagenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de imágenes de productos"
  ON producto_imagenes FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican imágenes de productos"
  ON producto_imagenes FOR ALL USING (auth.role() = 'authenticated');

-- ===== FICHAS TÉCNICAS =====
CREATE TABLE producto_fichas_tecnicas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url_publica TEXT NOT NULL,
  nombre_archivo TEXT NOT NULL,
  tamanio_mb NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE producto_fichas_tecnicas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de fichas técnicas"
  ON producto_fichas_tecnicas FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican fichas técnicas"
  ON producto_fichas_tecnicas FOR ALL USING (auth.role() = 'authenticated');

-- ===== PROYECTOS =====
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
  reto TEXT CHECK (char_length(reto) <= 500),
  solucion TEXT CHECK (char_length(solucion) <= 800),
  metricas JSONB DEFAULT '[]',
  destacado BOOLEAN DEFAULT false,
  publicado BOOLEAN DEFAULT false,
  orden INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_proyectos_updated
  BEFORE UPDATE ON proyectos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_proyectos_slug ON proyectos(slug);
CREATE INDEX idx_proyectos_tipo_obra ON proyectos(tipo_obra);

ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de proyectos"
  ON proyectos FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican proyectos"
  ON proyectos FOR ALL USING (auth.role() = 'authenticated');

-- ===== PRODUCTOS USADOS EN PROYECTOS =====
CREATE TABLE proyecto_productos (
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  nombre_producto TEXT NOT NULL,
  PRIMARY KEY (proyecto_id, producto_id)
);

ALTER TABLE proyecto_productos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de proyecto_productos"
  ON proyecto_productos FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican proyecto_productos"
  ON proyecto_productos FOR ALL USING (auth.role() = 'authenticated');

-- ===== IMÁGENES DE PROYECTOS =====
CREATE TABLE proyecto_imagenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url_publica TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('antes', 'durante', 'despues', 'general')),
  descripcion TEXT,
  orden INT DEFAULT 0
);

ALTER TABLE proyecto_imagenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de imágenes de proyectos"
  ON proyecto_imagenes FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican imágenes de proyectos"
  ON proyecto_imagenes FOR ALL USING (auth.role() = 'authenticated');

-- ===== LEADS =====
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  empresa TEXT,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo_proyecto TEXT,
  producto_id UUID REFERENCES productos(id),
  producto_nombre TEXT,
  metros_cuadrados NUMERIC,
  tiempo_ejecucion TEXT,
  servicio_requerido TEXT,
  mensaje TEXT,
  acepto_politica BOOLEAN DEFAULT false,
  canal TEXT DEFAULT 'formulario',
  estado TEXT DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'cotizado', 'cerrado', 'descartado')),
  notas_internas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Inserción pública de leads"
  ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Solo admins ven y gestionan leads"
  ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Solo admins actualizan leads"
  ON leads FOR UPDATE USING (auth.role() = 'authenticated');

-- ===== CERTIFICACIONES =====
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

ALTER TABLE certificaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de certificaciones"
  ON certificaciones FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican certificaciones"
  ON certificaciones FOR ALL USING (auth.role() = 'authenticated');

-- ===== CONFIGURACIÓN DEL SITIO =====
CREATE TABLE configuracion_sitio (
  clave TEXT PRIMARY KEY,
  valor JSONB NOT NULL,
  descripcion TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE configuracion_sitio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de configuración"
  ON configuracion_sitio FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican configuración"
  ON configuracion_sitio FOR ALL USING (auth.role() = 'authenticated');
