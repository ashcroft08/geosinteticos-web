-- Migración para reforzar la seguridad en configuracion_sitio y leads
-- Fecha: 2026-04-28

-- 1. Reforzar tabla 'configuracion_sitio'
-- Asegurarnos de que RLS está habilitado
ALTER TABLE public.configuracion_sitio ENABLE ROW LEVEL SECURITY;

-- Eliminar posibles políticas públicas antiguas de lectura si existen
DROP POLICY IF EXISTS "Permitir lectura pública de configuracion_sitio" ON public.configuracion_sitio;

-- Permitir lectura y escritura solo a usuarios autenticados (admin)
-- Nota: La web frontend leerá estos datos usando la clave service_role desde la API.
CREATE POLICY "Permitir lectura y escritura solo a autenticados" 
ON public.configuracion_sitio
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 2. Reforzar tabla 'leads'
-- Asegurarnos de que RLS está habilitado
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Eliminar posibles políticas públicas (como insert o select público) si existen
DROP POLICY IF EXISTS "Permitir insertar leads públicamente" ON public.leads;
DROP POLICY IF EXISTS "Permitir lectura pública de leads" ON public.leads;

-- Permitir lectura y escritura solo a usuarios autenticados (admin)
-- Nota: La inserción de nuevos leads (POST) se hace mediante la API Route /api/leads 
-- la cual usa service_role (bypasea RLS), así que no necesitamos dar INSERT al rol anon.
CREATE POLICY "Permitir acceso total a autenticados en leads" 
ON public.leads
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
