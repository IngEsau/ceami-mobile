import { CapturedPhoto, CaptureTarget } from '../../capture/domain/photo-capture.types';

export type VisitStatus = 'draft' | 'documents_pending' | 'housing_photos_pending' | 'form_in_progress' | 'signature_pending' | 'completed';

export type VisitGeneralData = { date: string; clientName: string; curp: string; rfc: string; phoneType: string; phone: string; address: string; housingType: string; email: string; maritalStatus: string };
export type VisitFamilyData = { spouseName?: string; address?: string; phone?: string; incomeSource?: string; position?: string; seniority?: string };
export type VisitWorkData = { job: string; workAddress: string; seniority: string; income: number; householdExpenses: number; otherExpenses?: number; ownsCar: boolean; bankDebt: number };
export type VisitReference = { name: string; address: string; phone: string };
export type VisitReferencesData = { reference1: VisitReference; reference2: VisitReference };

export type VisitDraft = {
  id: string;
  folio: string;
  status: VisitStatus;
  createdAt: string;
  updatedAt: string;
  clientDocuments: { ineFront?: CapturedPhoto; ineBack?: CapturedPhoto; selfie?: CapturedPhoto };
  housingPhotos: { front?: CapturedPhoto; interior1?: CapturedPhoto; interior2?: CapturedPhoto; extra?: CapturedPhoto };
  generalData?: VisitGeneralData;
  familyData?: VisitFamilyData;
  workData?: VisitWorkData;
  references?: VisitReferencesData;
  signature?: { data: string; capturedAt: string };
};

export const visitPhotoRequirements = { house_front: true, house_interior_1: true, house_interior_2: true, house_extra: false } as const;
export const visitDocumentTargets: CaptureTarget[] = ['ine_front', 'ine_back', 'selfie'];
export const visitHousingTargets: CaptureTarget[] = ['house_front', 'house_interior_1', 'house_interior_2', 'house_extra'];
