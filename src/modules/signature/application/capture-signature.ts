import { SignatureCaptureSource } from '../domain/signature-capture.port';

export type PersistSignature = (data: string) => Promise<void>;

export const captureSignatureFromSource = async (source: SignatureCaptureSource, persist: PersistSignature) => {
  const data = await source.capture();
  if (!data) return false;
  await persist(data);
  return true;
};
