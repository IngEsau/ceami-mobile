import { CreditApplication, requiredDocumentTypes } from './application.types';

export const documentsProgress = (application: CreditApplication) => application.documents.filter((document) => document.status === 'captured').length;
export const hasCompleteDocuments = (application: CreditApplication) => requiredDocumentTypes.every((type) => application.documents.some((document) => document.type === type && document.status === 'captured'));
export const wizardProgress = (application: CreditApplication) => [application.generalData, application.familyData, application.workData, application.referencesData].filter(Boolean).length;
export const hasCompleteWizard = (application: CreditApplication) => wizardProgress(application) === 4;
export const hasDuplicateReferencePhones = (application: CreditApplication) => { const phone = application.generalData?.phone; const references = application.referencesData; return Boolean(references && (references.reference1.phone === references.reference2.phone || references.reference1.phone === phone || references.reference2.phone === phone)); };
export const canSubmitApplication = (application: CreditApplication, signatureAccepted: boolean) => hasCompleteDocuments(application) && hasCompleteWizard(application) && application.signature?.status === 'captured' && signatureAccepted && !hasDuplicateReferencePhones(application);
