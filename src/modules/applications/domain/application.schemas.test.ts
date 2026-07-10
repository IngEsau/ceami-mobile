import { generalDataSchema, referencesDataSchema } from './application.schemas';

describe('application schemas', () => {
  it('rejects an invalid CURP and phone', () => { const result = generalDataSchema.safeParse({ date: '2026-07-09', clientName: 'Alejandra', curp: 'ABC', rfc: 'ABC123456789', phoneType: 'mobile', phone: '123', address: 'Centro 1', housingType: 'owned', email: 'ale@example.com', maritalStatus: 'single' }); expect(result.success).toBe(false); });
  it('accepts two valid references', () => { const result = referencesDataSchema.safeParse({ reference1: { name: 'Ana Pérez', address: 'Calle 1', phone: '5512345678' }, reference2: { name: 'Luis Pérez', address: 'Calle 2', phone: '5587654321' } }); expect(result.success).toBe(true); });
});
