import { SignatureCaptureSource } from '../domain/signature-capture.port';

/** Replace this adapter with react-native-signature-canvas when a handwritten canvas is required. */
export class MockSignatureCaptureSource implements SignatureCaptureSource {
  async capture(): Promise<string> {
    return `mock-signature-${Date.now()}`;
  }
}
