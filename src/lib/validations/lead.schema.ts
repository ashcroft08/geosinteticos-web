import { z } from 'zod'

export const leadSchema = z.object({
    nombre: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre es demasiado largo'),
    empresa: z.string().max(100).optional().default(''),
    email: z
        .string()
        .email('Ingresa un email válido'),
    telefono: z
        .string()
        .min(7, 'Ingresa un teléfono válido')
        .max(20),
    tipo_proyecto: z.string().optional().default(''),
    producto_nombre: z.string().optional().default(''),
    mensaje: z.string().max(1000).optional().default(''),
    acepto_politica: z.boolean().refine(val => val === true, {
        message: 'Debes aceptar la política de privacidad',
    }),
    canal: z.enum(['formulario', 'whatsapp', 'cotizacion']).default('formulario'),
})

export type LeadFormData = z.infer<typeof leadSchema>
