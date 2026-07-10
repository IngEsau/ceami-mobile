import { useMemo } from 'react';
import { ExpoCameraCaptureAdapter } from '../infrastructure/ExpoCameraCaptureAdapter';

export const usePhotoCapture = () => useMemo(() => new ExpoCameraCaptureAdapter(), []);
