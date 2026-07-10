import { CaptureTarget, CapturedPhoto, TemporaryPhoto } from './photo-capture.types';

export interface CameraCapturePort {
  persist(target: CaptureTarget, temporary: TemporaryPhoto): Promise<CapturedPhoto>;
  discard(temporaryUri: string): Promise<void>;
  pickFromGallery(target: CaptureTarget): Promise<TemporaryPhoto | null>;
}
