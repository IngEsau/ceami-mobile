import { createFamilyDataSchema, createReferencesDataSchema, generalDataSchema, workDataSchema } from './application.schemas';
import { CreditApplication, requiredDocumentTypes } from './application.types';

export const documentsProgress = (application: CreditApplication) => application.documents.filter((document) => document.status === 'captured').length;
export const hasCompleteDocuments = (application: CreditApplication) => requiredDocumentTypes.every((type) => application.documents.some((document) => document.type === type && document.status === 'captured'));
export const wizardProgress = (application: CreditApplication) => [application.generalData, application.familyData, application.workData, application.referencesData].filter(Boolean).length;
export const hasCompleteWizard = (application: CreditApplication) => wizardProgress(application) === 4;
export const hasDuplicateReferencePhones = (application: CreditApplication) => { const phone = application.generalData?.phone; const references = application.referencesData; return Boolean(references && (references.reference1.phone === references.reference2.phone || references.reference1.phone === phone || references.reference2.phone === phone)); };

export type SubmissionIssue = 'documents_incomplete' | 'general_data_invalid' | 'family_data_invalid' | 'work_data_invalid' | 'references_invalid' | 'signature_missing' | 'confirmation_missing';

export const submissionIssues = (application: CreditApplication, signatureAccepted: boolean): SubmissionIssue[] => {
  const issues: SubmissionIssue[] = [];
  if (!hasCompleteDocuments(application)) issues.push('documents_incomplete');
  if (!application.generalData || !generalDataSchema.safeParse(application.generalData).success) issues.push('general_data_invalid');
  if (!application.familyData || !createFamilyDataSchema(application.generalData?.maritalStatus).safeParse(application.familyData).success) issues.push('family_data_invalid');
  if (!application.workData || !workDataSchema.safeParse(application.workData).success) issues.push('work_data_invalid');
  if (!application.referencesData || !createReferencesDataSchema(application.generalData?.phone).safeParse(application.referencesData).success) issues.push('references_invalid');
  if (application.signature?.status !== 'captured') issues.push('signature_missing');
  if (!signatureAccepted) issues.push('confirmation_missing');
  return issues;
};

export const canSubmitApplication = (application: CreditApplication, signatureAccepted: boolean) => submissionIssues(application, signatureAccepted).length === 0;

export class ApplicationSubmissionError extends Error {
  constructor(readonly issues: SubmissionIssue[]) {
    super('La solicitud no cumple los requisitos para enviarse');
    this.name = 'ApplicationSubmissionError';
  }
}

export const assertCanSubmitApplication = (application: CreditApplication, signatureAccepted: boolean) => {
  const issues = submissionIssues(application, signatureAccepted);
  if (issues.length) throw new ApplicationSubmissionError(issues);
};
