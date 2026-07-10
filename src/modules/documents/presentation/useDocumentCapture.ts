import { useMemo } from 'react';
import { captureDocumentFromSource } from '../application/capture-document';
import { ExpoImagePickerDocumentSource } from '../infrastructure/ExpoImagePickerDocumentSource';
import { RequiredDocumentType } from '../../applications/domain/application.types';
import { useApplicationStore } from '../../applications/application/application.store';

export const useDocumentCapture = () => {
  const persist = useApplicationStore((state) => state.captureDocument);
  const source = useMemo(() => new ExpoImagePickerDocumentSource(), []);

  return async (type: RequiredDocumentType) => captureDocumentFromSource(source, type, persist);
};
