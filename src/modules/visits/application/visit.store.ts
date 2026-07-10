import { create } from 'zustand';
import { CapturedPhoto } from '../../capture/domain/photo-capture.types';
import { VisitRepository } from './ports/visit.repository';
import { completeVisit, createOrResumeVisitDraft, getVisits, saveVisitFamilyData, saveVisitGeneralData, saveVisitPhoto, saveVisitReferences, saveVisitSignature, saveVisitWorkData } from './visit.use-cases';
import { VisitDraft, VisitFamilyData, VisitGeneralData, VisitReferencesData, VisitWorkData } from '../domain/visit.types';

type VisitState = { repository: VisitRepository; currentVisit?: VisitDraft; visits: VisitDraft[]; currentStep: number; load: () => Promise<void>; startDraft: () => Promise<VisitDraft>; setStep: (step: number) => void; savePhoto: (photo: CapturedPhoto) => Promise<void>; saveGeneral: (data: VisitGeneralData) => Promise<void>; saveFamily: (data: VisitFamilyData) => Promise<void>; saveWork: (data: VisitWorkData) => Promise<void>; saveReferences: (data: VisitReferencesData) => Promise<void>; saveSignature: (data: string) => Promise<void>; finish: () => Promise<VisitDraft | undefined>; };

export const useVisitStore = create<VisitState>((set, get) => ({
  repository: {} as VisitRepository, visits: [], currentStep: 0,
  load: async () => set({ visits: await getVisits(get().repository) }),
  startDraft: async () => { const visit = await createOrResumeVisitDraft(get().repository); set({ currentVisit: visit, currentStep: 0, visits: [visit, ...get().visits.filter((item) => item.id !== visit.id)] }); return visit; },
  setStep: (currentStep) => set({ currentStep }),
  savePhoto: async (photo) => { const visit = get().currentVisit; if (!visit) return; set({ currentVisit: await saveVisitPhoto(get().repository, visit, photo) }); },
  saveGeneral: async (data) => { const visit = get().currentVisit; if (!visit) return; set({ currentVisit: await saveVisitGeneralData(get().repository, visit, data) }); },
  saveFamily: async (data) => { const visit = get().currentVisit; if (!visit) return; set({ currentVisit: await saveVisitFamilyData(get().repository, visit, data) }); },
  saveWork: async (data) => { const visit = get().currentVisit; if (!visit) return; set({ currentVisit: await saveVisitWorkData(get().repository, visit, data) }); },
  saveReferences: async (data) => { const visit = get().currentVisit; if (!visit) return; set({ currentVisit: await saveVisitReferences(get().repository, visit, data) }); },
  saveSignature: async (data) => { const visit = get().currentVisit; if (!visit) return; set({ currentVisit: await saveVisitSignature(get().repository, visit, data) }); },
  finish: async () => { const visit = get().currentVisit; if (!visit) return undefined; const next = await completeVisit(get().repository, visit); set({ currentVisit: next, visits: get().visits.map((item) => item.id === next.id ? next : item) }); return next; },
}));

export const configureVisitStore = (repository: VisitRepository) => useVisitStore.setState({ repository });
