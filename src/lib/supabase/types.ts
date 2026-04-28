/* ===================================================================
 * Tipos TypeScript para las tablas de Supabase
 * Generados manualmente basados en el schema.sql
 * En producción usar: npx supabase gen types typescript > types.ts
 * =================================================================== */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            categorias: {
                Row: {
                    id: string
                    nombre: string
                    slug: string
                    descripcion: string | null
                    icono_url: string | null
                    orden: number
                    activa: boolean
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['categorias']['Row'], 'id' | 'created_at'> & {
                    id?: string
                    created_at?: string
                }
                Update: Partial<Database['public']['Tables']['categorias']['Insert']>
            }
            subcategorias: {
                Row: {
                    id: string
                    categoria_id: string
                    nombre: string
                    slug: string
                    descripcion: string | null
                    orden: number
                    activa: boolean
                }
                Insert: Omit<Database['public']['Tables']['subcategorias']['Row'], 'id'> & { id?: string }
                Update: Partial<Database['public']['Tables']['subcategorias']['Insert']>
            }
            productos: {
                Row: {
                    id: string
                    nombre: string
                    slug: string
                    categoria_id: string
                    subcategoria_id: string | null
                    descripcion_corta: string | null
                    descripcion_detallada: string | null
                    especificaciones: Json
                    aplicaciones: string[]
                    certificaciones: string[]
                    disponible: boolean
                    destacado: boolean
                    orden: number
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['productos']['Row'], 'id' | 'created_at' | 'updated_at'> & {
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['productos']['Insert']>
            }
            producto_imagenes: {
                Row: {
                    id: string
                    producto_id: string
                    storage_path: string
                    url_publica: string
                    alt: string | null
                    es_principal: boolean
                    orden: number
                }
                Insert: Omit<Database['public']['Tables']['producto_imagenes']['Row'], 'id'> & { id?: string }
                Update: Partial<Database['public']['Tables']['producto_imagenes']['Insert']>
            }
            producto_fichas_tecnicas: {
                Row: {
                    id: string
                    producto_id: string
                    storage_path: string
                    url_publica: string
                    nombre_archivo: string
                    tamanio_mb: number | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['producto_fichas_tecnicas']['Row'], 'id' | 'created_at'> & {
                    id?: string
                    created_at?: string
                }
                Update: Partial<Database['public']['Tables']['producto_fichas_tecnicas']['Insert']>
            }
            proyectos: {
                Row: {
                    id: string
                    titulo: string
                    slug: string
                    cliente: string | null
                    ciudad: string | null
                    region: string | null
                    pais: string
                    tipo_obra: string | null
                    fecha: string | null
                    reto: string | null
                    solucion: string | null
                    metricas: Json
                    destacado: boolean
                    publicado: boolean
                    orden: number
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['proyectos']['Row'], 'id' | 'created_at' | 'updated_at'> & {
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['proyectos']['Insert']>
            }
            proyecto_imagenes: {
                Row: {
                    id: string
                    proyecto_id: string
                    storage_path: string
                    url_publica: string
                    tipo: string | null
                    descripcion: string | null
                    orden: number
                }
                Insert: Omit<Database['public']['Tables']['proyecto_imagenes']['Row'], 'id'> & { id?: string }
                Update: Partial<Database['public']['Tables']['proyecto_imagenes']['Insert']>
            }
            proyecto_productos: {
                Row: {
                    proyecto_id: string
                    producto_id: string
                    nombre_producto: string
                }
                Insert: Database['public']['Tables']['proyecto_productos']['Row']
                Update: Partial<Database['public']['Tables']['proyecto_productos']['Insert']>
            }
            leads: {
                Row: {
                    id: string
                    nombre: string
                    empresa: string | null
                    email: string
                    telefono: string
                    tipo_proyecto: string | null
                    producto_id: string | null
                    producto_nombre: string | null
                    metros_cuadrados: number | null
                    tiempo_ejecucion: string | null
                    servicio_requerido: string | null
                    mensaje: string | null
                    acepto_politica: boolean
                    canal: string
                    estado: string
                    notas_internas: string | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at'> & {
                    id?: string
                    created_at?: string
                }
                Update: Partial<Database['public']['Tables']['leads']['Insert']>
            }
            certificaciones: {
                Row: {
                    id: string
                    nombre: string
                    emisor: string | null
                    logo_storage_path: string | null
                    logo_url: string | null
                    pdf_storage_path: string | null
                    pdf_url: string | null
                    vigencia: string | null
                    descripcion: string | null
                    activa: boolean
                    orden: number
                }
                Insert: Omit<Database['public']['Tables']['certificaciones']['Row'], 'id'> & { id?: string }
                Update: Partial<Database['public']['Tables']['certificaciones']['Insert']>
            }
            configuracion_sitio: {
                Row: {
                    clave: string
                    valor: Json
                    descripcion: string | null
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['configuracion_sitio']['Row'], 'updated_at'> & {
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['configuracion_sitio']['Insert']>
            }
            page_views: {
                Row: {
                    id: string
                    slug_pagina: string
                    tipo_pagina: string
                    dispositivo: string
                    referrer: string | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['page_views']['Row'], 'id' | 'created_at'> & {
                    id?: string
                    created_at?: string
                }
                Update: Partial<Database['public']['Tables']['page_views']['Insert']>
            }
            profiles: {
                Row: {
                    id: string
                    rol: string
                    nombre: string | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'> & {
                    created_at?: string
                }
                Update: Partial<Database['public']['Tables']['profiles']['Insert']>
            }
        }
    }
}

/* ===================================================================
 * Tipos derivados de conveniencia
 * =================================================================== */

export type Categoria = Database['public']['Tables']['categorias']['Row']
export type Subcategoria = Database['public']['Tables']['subcategorias']['Row']
export type Producto = Database['public']['Tables']['productos']['Row']
export type ProductoImagen = Database['public']['Tables']['producto_imagenes']['Row']
export type ProductoFichaTecnica = Database['public']['Tables']['producto_fichas_tecnicas']['Row']
export type Proyecto = Database['public']['Tables']['proyectos']['Row']
export type ProyectoImagen = Database['public']['Tables']['proyecto_imagenes']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type Certificacion = Database['public']['Tables']['certificaciones']['Row']
export type ConfiguracionSitio = Database['public']['Tables']['configuracion_sitio']['Row']
export type PageView = Database['public']['Tables']['page_views']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

/** Producto con relaciones anidadas */
export type ProductoConRelaciones = Producto & {
    producto_imagenes: ProductoImagen[]
    producto_fichas_tecnicas: ProductoFichaTecnica[]
    categorias: Categoria | null
    subcategorias: Subcategoria | null
}

/** Proyecto con relaciones anidadas */
export type ProyectoConRelaciones = Proyecto & {
    proyecto_imagenes: ProyectoImagen[]
    proyecto_productos: { nombre_producto: string }[]
}

/** Especificación de un producto */
export interface Especificacion {
    propiedad: string
    valor: string
    unidad: string
}

/** Métrica de un proyecto */
export interface Metrica {
    indicador: string
    valor: string
}
