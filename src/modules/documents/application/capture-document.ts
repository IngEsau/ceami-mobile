import { RequiredDocumentType } from '../../applications/domain/application.types';
import { DocumentCaptureSource } from '../domain/document-capture.port';

export type PersistCapturedDocument = (type: RequiredDocumentType, uri: string) => Promise<void>;

export const captureDocumentFromSource = async (
  source: DocumentCaptureSource,
  type: RequiredDocumentType,
  persist: PersistCapturedDocument,
) => {
  const uri = await source.selectImage(type);
  if (!uri) return false;
  await persist(type, uri);
  return true;
};
