-- ============================================================
-- Migración: Crear tabla page_views para sistema de analíticas
-- Ejecutar en el SQL Editor de Supabase Dashboard
-- ============================================================

CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug_pagina TEXT NOT NULL,
    tipo_pagina TEXT NOT NULL DEFAULT 'pagina',  -- 'producto', 'proyecto', 'pagina'
    dispositivo TEXT NOT NULL DEFAULT 'desktop', -- 'desktop', 'mobile', 'tablet'
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para consultas por fecha (visitas semanales, diarias)
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at DESC);

-- Índice compuesto para "productos más vistos" (filtra por tipo + agrupa por slug)
CREATE INDEX IF NOT EXISTS idx_page_views_tipo_slug ON page_views (tipo_pagina, slug_pagina);

-- Habilitar RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Política: cualquiera puede INSERTAR (visitante anónimo registra su visita)
CREATE POLICY "Cualquiera puede registrar una vista"
    ON page_views FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Política: solo usuarios autenticados (admin) pueden LEER
CREATE POLICY "Solo admin puede leer vistas"
    ON page_views FOR SELECT
    TO authenticated
    USING (true);
