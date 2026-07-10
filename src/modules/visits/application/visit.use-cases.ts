import { CapturedPhoto } from '../../capture/domain/photo-capture.types';
import { assertCanCompleteVisit, hasRequiredHousingPhotos, hasRequiredVisitDocuments, hasCompleteVisitWizard } from '../domain/visit.rules';
import { VisitDraft, VisitFamilyData, VisitGeneralData, VisitReferencesData, VisitStatus, VisitWorkData } from '../domain/visit.types';
import { VisitRepository } from './ports/visit.repository';

const touch = (visit: VisitDraft): VisitDraft => ({ ...visit, updatedAt: new Date().toISOString() });
const nextStatus = (visit: VisitDraft): VisitStatus => {
  if (!hasRequiredVisitDocuments(visit)) return 'documents_pending';
  if (!hasRequiredHousingPhotos(visit)) return 'housing_photos_pending';
  if (!hasCompleteVisitWizard(visit)) return 'form_in_progress';
  return 'signature_pending';
};
const save = async (repository: VisitRepository, visit: VisitDraft) => { const next = touch({ ...visit, status: nextStatus(visit) }); await repository.save(next); return next; };

export const createOrResumeVisitDraft = async (repository: VisitRepository) => (await repository.findAll()).find((visit) => visit.status !== 'completed') ?? repository.createDraft();
export const getVisits = (repository: VisitRepository) => repository.findAll();
export const getVisitById = (repository: VisitRepository, id: string) => repository.findById(id);
export const saveVisitPhoto = async (repository: VisitRepository, visit: VisitDraft, photo: CapturedPhoto) => {
  let next = visit;
  if (photo.target === 'ine_front') next = { ...visit, clientDocuments: { ...visit.clientDocuments, ineFront: photo } };
  if (photo.target === 'ine_back') next = { ...visit, clientDocuments: { ...visit.clientDocuments, ineBack: photo } };
  if (photo.target === 'selfie') next = { ...visit, clientDocuments: { ...visit.clientDocuments, selfie: photo } };
  if (photo.target === 'house_front') next = { ...visit, housingPhotos: { ...visit.housingPhotos, front: photo } };
  if (photo.target === 'house_interior_1') next = { ...visit, housingPhotos: { ...visit.housingPhotos, interior1: photo } };
  if (photo.target === 'house_interior_2') next = { ...visit, housingPhotos: { ...visit.housingPhotos, interior2: photo } };
  if (photo.target === 'house_extra') next = { ...visit, housingPhotos: { ...visit.housingPhotos, extra: photo } };
  return save(repository, next);
};
export const saveVisitGeneralData = (repository: VisitRepository, visit: VisitDraft, generalData: VisitGeneralData) => save(repository, { ...visit, generalData });
export const saveVisitFamilyData = (repository: VisitRepository, visit: VisitDraft, familyData: VisitFamilyData) => save(repository, { ...visit, familyData });
export const saveVisitWorkData = (repository: VisitRepository, visit: VisitDraft, workData: VisitWorkData) => save(repository, { ...visit, workData });
export const saveVisitReferences = (repository: VisitRepository, visit: VisitDraft, references: VisitReferencesData) => save(repository, { ...visit, references });
export const saveVisitSignature = async (repository: VisitRepository, visit: VisitDraft, data: string) => { const next = touch({ ...visit, status: 'signature_pending', signature: { data, capturedAt: new Date().toISOString() } }); await repository.save(next); return next; };
export const completeVisit = async (repository: VisitRepository, visit: VisitDraft) => { assertCanCompleteVisit(visit); const next = touch({ ...visit, status: 'completed' }); await repository.save(next); return next; };
