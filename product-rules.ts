import { z } from 'zod';
const imageReference = z.string().min(1).refine(v => v.startsWith('/__l5e/assets-v1/') || /^storage:[a-zA-Z0-9/_\-.]+$/.test(v), 'Envie uma foto válida.');
export const productInput = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(120), brand: z.string().trim().min(1).max(100), description: z.string().max(5000),
  category: z.enum(['masculinos', 'femininos', 'unissex']), price: z.number().finite().nonnegative(), original_price: z.number().finite().positive().nullable(),
  image: imageReference,
  alternative_image: imageReference.nullable().optional(),
  featured: z.boolean(), available: z.boolean().nullable(), stock: z.number().int().nonnegative().nullable(),
}).refine(p => p.original_price === null || p.original_price > p.price, { message: 'O preço promocional deve ser menor que o preço normal.', path: ['original_price'] });