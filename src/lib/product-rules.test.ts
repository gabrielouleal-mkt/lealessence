import { describe, expect, it } from 'vitest';
import { productInput } from './product-rules';
const valid = { name: 'Asad Bourbon', brand: 'Lattafa', description: '', category: 'masculinos', price: 220, original_price: 250, image: '/__l5e/assets-v1/original/asad.jpg', featured: true, available: null, stock: null };
describe('Product business rules', () => {
  it('preserves supplied Asad Bourbon normal and promotional prices', () => { const p = productInput.parse(valid); expect(p.price).toBe(220); expect(p.original_price).toBe(250); });
  it('requires a promotion below the normal price', () => { expect(productInput.safeParse({ ...valid, price: 250, original_price: 220 }).success).toBe(false); });
  it('keeps unspecified availability and stock unknown', () => { expect(productInput.parse(valid).available).toBeNull(); expect(productInput.parse(valid).stock).toBeNull(); });
  it('rejects negative stock quantities', () => { expect(productInput.safeParse({ ...valid, stock: -1 }).success).toBe(false); });
});