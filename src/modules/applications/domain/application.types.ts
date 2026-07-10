export type ApplicationId = string;
export type ApplicationStatus = 'draft' | 'documents_pending' | 'form_in_progress' | 'signature_pending' | 'submitted' | 'in_review' | 'approved' | 'rejected';
export type RequiredDocumentType = 'ine_front' | 'ine_back' | 'selfie';
export type DocumentStatus = 'pending' | 'captured' | 'error';

export type ApplicantGeneralData = { date: string; clientName: string; curp: string; rfc: string; phoneType: string; phone: string; address: string; housingType: string; email: string; maritalStatus: string };
export type ApplicantFamilyData = { spouseName?: string; address?: string; phone?: string; incomeSource?: string; position?: string; seniority?: string };
export type ApplicantWorkData = { job: string; workAddress: string; seniority: string; income: number; householdExpenses: number; otherExpenses?: number; ownsCar: boolean; bankDebt: number };
export type ApplicantReference = { name: string; address: string; phone: string };
export type ApplicantReferencesData = { reference1: ApplicantReference; reference2: ApplicantReference };
export type ApplicationDocument = { type: RequiredDocumentType; status: DocumentStatus; uri?: string; capturedAt?: string };
export type CreditApplication = {
  id: ApplicationId; folio: string; status: ApplicationStatus; applicantName?: string; createdAt: string; updatedAt: string;
  documents: ApplicationDocument[]; generalData?: ApplicantGeneralData; familyData?: ApplicantFamilyData; workData?: ApplicantWorkData; referencesData?: ApplicantReferencesData;
  signature?: { status: 'pending' | 'captured'; data?: string; capturedAt?: string };
};

export const requiredDocumentTypes: RequiredDocumentType[] = ['ine_front', 'ine_back', 'selfie'];
export const emptyDocuments = (): ApplicationDocument[] => requiredDocumentTypes.map((type) => ({ type, status: 'pending' }));
