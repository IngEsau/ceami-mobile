import { VisitDraft, visitPhotoRequirements } from './visit.types';

export const visitDocumentsProgress = (visit: VisitDraft) => [visit.clientDocuments.ineFront, visit.clientDocuments.ineBack, visit.clientDocuments.selfie].filter(Boolean).length;
export const hasRequiredVisitDocuments = (visit: VisitDraft) => visitDocumentsProgress(visit) === 3;
export const visitHousingPhotosProgress = (visit: VisitDraft) => [visit.housingPhotos.front, visit.housingPhotos.interior1, visit.housingPhotos.interior2, visit.housingPhotos.extra].filter(Boolean).length;
export const hasRequiredHousingPhotos = (visit: VisitDraft) => (!visitPhotoRequirements.house_front || Boolean(visit.housingPhotos.front)) && (!visitPhotoRequirements.house_interior_1 || Boolean(visit.housingPhotos.interior1)) && (!visitPhotoRequirements.house_interior_2 || Boolean(visit.housingPhotos.interior2)) && (!visitPhotoRequirements.house_extra || Boolean(visit.housingPhotos.extra));
export const visitWizardProgress = (visit: VisitDraft) => [visit.generalData, visit.familyData, visit.workData, visit.references].filter(Boolean).length;
export const hasCompleteVisitWizard = (visit: VisitDraft) => visitWizardProgress(visit) === 4;
export const canCompleteVisit = (visit: VisitDraft) => hasRequiredVisitDocuments(visit) && hasRequiredHousingPhotos(visit) && hasCompleteVisitWizard(visit) && Boolean(visit.signature?.data);

export class VisitCompletionError extends Error {
  constructor() { super('La visita aún no cumple los requisitos para finalizarse'); this.name = 'VisitCompletionError'; }
}

export const assertCanCompleteVisit = (visit: VisitDraft) => { if (!canCompleteVisit(visit)) throw new VisitCompletionError(); };
