import { RequiredDocumentType } from '../../applications/domain/application.types';

/** Port for a document source. The implementation may use camera, gallery or a future remote KYC SDK. */
export interface DocumentCaptureSource {
  selectImage(type: RequiredDocumentType): Promise<string | null>;
}
