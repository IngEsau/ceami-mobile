import { z } from 'zod';

const phone = z.string().regex(/^\d{10}$/, 'Ingresa 10 dígitos');
const requiredText = (message: string) => z.string().trim().min(1, message);

export const generalDataSchema = z.object({
  date: requiredText('La fecha es requerida'), clientName: z.string().trim().min(3, 'Ingresa al menos 3 caracteres'), curp: z.string().length(18, 'La CURP debe tener 18 caracteres'), rfc: z.string().min(12).max(13, 'El RFC debe tener 12 o 13 caracteres'),
  phoneType: requiredText('Selecciona un tipo de teléfono'), phone, address: requiredText('El domicilio es requerido'), housingType: requiredText('Selecciona el tipo de vivienda'), email: z.string().email('Ingresa un correo válido'), maritalStatus: requiredText('Selecciona el estado civil'),
});
export const familyDataSchema = z.object({ spouseName: z.string().optional(), address: z.string().optional(), phone: z.string().optional().refine((value) => !value || /^\d{10}$/.test(value), 'Ingresa 10 dígitos'), incomeSource: z.string().optional(), position: z.string().optional(), seniority: z.string().optional() });
export const createFamilyDataSchema = (maritalStatus?: string) => familyDataSchema.superRefine((value, context) => {
  if ((maritalStatus === 'married' || maritalStatus === 'union') && !value.spouseName?.trim()) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['spouseName'], message: 'Ingresa el nombre del cónyuge' });
  }
});
export const workDataSchema = z.object({ job: requiredText('El trabajo es requerido'), workAddress: requiredText('La dirección es requerida'), seniority: requiredText('La antigüedad es requerida'), income: z.coerce.number().positive('Ingresa un monto válido'), householdExpenses: z.coerce.number().nonnegative('Ingresa un monto válido'), otherExpenses: z.coerce.number().nonnegative().optional(), ownsCar: z.boolean(), bankDebt: z.coerce.number().nonnegative('Ingresa un monto válido') });
export const referencesDataSchema = z.object({ reference1: z.object({ name: z.string().trim().min(3, 'Ingresa el nombre'), address: requiredText('Ingresa el domicilio'), phone }), reference2: z.object({ name: z.string().trim().min(3, 'Ingresa el nombre'), address: requiredText('Ingresa el domicilio'), phone }) });
export const createReferencesDataSchema = (clientPhone?: string) => referencesDataSchema.superRefine((value, context) => {
  if (value.reference1.phone === value.reference2.phone) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['reference2', 'phone'], message: 'Las referencias no pueden tener el mismo teléfono' });
  }
  if (clientPhone && value.reference1.phone === clientPhone) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['reference1', 'phone'], message: 'No puede coincidir con el teléfono del cliente' });
  }
  if (clientPhone && value.reference2.phone === clientPhone) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['reference2', 'phone'], message: 'No puede coincidir con el teléfono del cliente' });
  }
});
export const signatureSchema = z.object({ signature: z.string().min(1, 'Registra tu firma'), accepted: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar la confirmación' }) }) });

export type GeneralDataInput = z.infer<typeof generalDataSchema>;
export type FamilyDataInput = z.infer<typeof familyDataSchema>;
export type WorkDataInput = z.infer<typeof workDataSchema>;
export type ReferencesDataInput = z.infer<typeof referencesDataSchema>;
