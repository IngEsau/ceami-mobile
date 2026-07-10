import { useMemo } from 'react';
import { captureSignatureFromSource } from '../application/capture-signature';
import { MockSignatureCaptureSource } from '../infrastructure/MockSignatureCaptureSource';
import { useApplicationStore } from '../../applications/application/application.store';

export const useSignatureCapture = () => {
  const persist = useApplicationStore((state) => state.saveSignature);
  const source = useMemo(() => new MockSignatureCaptureSource(), []);

  return () => captureSignatureFromSource(source, persist);
};
