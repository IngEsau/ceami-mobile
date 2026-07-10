export interface SignatureCaptureSource {
  capture(): Promise<string | null>;
}
