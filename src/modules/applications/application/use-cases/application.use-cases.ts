import { ApplicationRepository } from '../ports/application.repository';
import { ApplicantFamilyData, ApplicantGeneralData, ApplicantReferencesData, ApplicantWorkData, CreditApplication, RequiredDocumentType } from '../../domain/application.types';

const touch = (application: CreditApplication): CreditApplication => ({ ...application, updatedAt: new Date().toISOString() });
export const createApplicationDraft = (repository: ApplicationRepository) => repository.createDraft();
export const updateApplicationDocuments = async (repository: ApplicationRepository, application: CreditApplication, type: RequiredDocumentType, uri: string) => { const next = touch({ ...application, status: 'documents_pending', documents: application.documents.map((document) => document.type === type ? { ...document, uri, status: 'captured', capturedAt: new Date().toISOString() } : document) }); await repository.save(next); return next; };
const savePart = async <K extends keyof CreditApplication>(repository: ApplicationRepository, application: CreditApplication, key: K, data: CreditApplication[K]) => { const next = touch({ ...application, status: 'form_in_progress', [key]: data }); await repository.save(next); return next; };
export const updateGeneralData = (repository: ApplicationRepository, application: CreditApplication, data: ApplicantGeneralData) => savePart(repository, application, 'generalData', data);
export const updateFamilyData = (repository: ApplicationRepository, application: CreditApplication, data: ApplicantFamilyData) => savePart(repository, application, 'familyData', data);
export const updateWorkData = (repository: ApplicationRepository, application: CreditApplication, data: ApplicantWorkData) => savePart(repository, application, 'workData', data);
export const updateReferencesData = (repository: ApplicationRepository, application: CreditApplication, data: ApplicantReferencesData) => savePart(repository, application, 'referencesData', data);
export const captureSignature = async (repository: ApplicationRepository, application: CreditApplication, data: string) => { const next = touch({ ...application, status: 'signature_pending', signature: { status: 'captured', data, capturedAt: new Date().toISOString() } }); await repository.save(next); return next; };
export const submitApplication = async (repository: ApplicationRepository, application: CreditApplication) => { const next = touch({ ...application, status: 'submitted' }); await repository.save(next); return next; };
export const getApplications = (repository: ApplicationRepository) => repository.findAll();
export const getApplicationById = (repository: ApplicationRepository, id: string) => repository.findById(id);
