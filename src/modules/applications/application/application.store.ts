import { create } from 'zustand';
import { ApplicationRepository } from './ports/application.repository';
import { createApplicationDraft, getApplicationById, getApplications, updateApplicationDocuments, updateFamilyData, updateGeneralData, updateReferencesData, updateWorkData, captureSignature, submitApplication } from './use-cases/application.use-cases';
import { ApplicantFamilyData, ApplicantGeneralData, ApplicantReferencesData, ApplicantWorkData, CreditApplication, RequiredDocumentType } from '../domain/application.types';

type ApplicationState = { repository: ApplicationRepository; currentApplication?: CreditApplication; applications: CreditApplication[]; currentStep: number; load: () => Promise<void>; getById: (id: string) => Promise<CreditApplication | undefined>; createDraft: () => Promise<CreditApplication>; setStep: (step: number) => void; captureDocument: (type: RequiredDocumentType, uri: string) => Promise<void>; saveGeneral: (data: ApplicantGeneralData) => Promise<void>; saveFamily: (data: ApplicantFamilyData) => Promise<void>; saveWork: (data: ApplicantWorkData) => Promise<void>; saveReferences: (data: ApplicantReferencesData) => Promise<void>; saveSignature: (data: string) => Promise<void>; submit: (signatureAccepted: boolean) => Promise<CreditApplication | undefined>; };
export const useApplicationStore = create<ApplicationState>((set, get) => ({
  repository: {} as ApplicationRepository, applications: [], currentStep: 0,
  load: async () => { const { repository } = get(); set({ applications: await getApplications(repository) }); },
  getById: async (id) => get().applications.find((application) => application.id === id) ?? (await getApplicationById(get().repository, id)) ?? undefined,
  createDraft: async () => { const application = await createApplicationDraft(get().repository); set({ currentApplication: application, currentStep: 0, applications: [application, ...get().applications] }); return application; },
  setStep: (currentStep) => set({ currentStep }),
  captureDocument: async (type, uri) => { const application = get().currentApplication; if (!application) return; const next = await updateApplicationDocuments(get().repository, application, type, uri); set({ currentApplication: next }); },
  saveGeneral: async (data) => { const application = get().currentApplication; if (!application) return; set({ currentApplication: await updateGeneralData(get().repository, application, data) }); },
  saveFamily: async (data) => { const application = get().currentApplication; if (!application) return; set({ currentApplication: await updateFamilyData(get().repository, application, data) }); },
  saveWork: async (data) => { const application = get().currentApplication; if (!application) return; set({ currentApplication: await updateWorkData(get().repository, application, data) }); },
  saveReferences: async (data) => { const application = get().currentApplication; if (!application) return; set({ currentApplication: await updateReferencesData(get().repository, application, data) }); },
  saveSignature: async (data) => { const application = get().currentApplication; if (!application) return; set({ currentApplication: await captureSignature(get().repository, application, data) }); },
  submit: async (signatureAccepted) => { const application = get().currentApplication; if (!application) return undefined; const next = await submitApplication(get().repository, application, signatureAccepted); set({ currentApplication: next, applications: get().applications.map((item) => item.id === next.id ? next : item) }); return next; },
}));

export const configureApplicationStore = (repository: ApplicationRepository) => useApplicationStore.setState({ repository });
