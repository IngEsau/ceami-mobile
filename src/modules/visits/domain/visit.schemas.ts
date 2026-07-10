import { createFamilyDataSchema, createReferencesDataSchema, generalDataSchema, workDataSchema } from '../../applications/domain/application.schemas';

/** The client-data validation is intentionally shared because it is identical in both guided flows. */
export const visitGeneralDataSchema = generalDataSchema;
export const visitWorkDataSchema = workDataSchema;
export const createVisitFamilyDataSchema = createFamilyDataSchema;
export const createVisitReferencesDataSchema = createReferencesDataSchema;
