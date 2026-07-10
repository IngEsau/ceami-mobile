export type CaptureTarget =
  | 'ine_front'
  | 'ine_back'
  | 'selfie'
  | 'house_front'
  | 'house_interior_1'
  | 'house_interior_2'
  | 'house_extra';

export type CapturedPhoto = {
  target: CaptureTarget;
  uri: string;
  status: 'captured';
  capturedAt: string;
  width?: number;
  height?: number;
};

export type TemporaryPhoto = {
  uri: string;
  width?: number;
  height?: number;
};

export const captureConfig: Record<CaptureTarget, { title: string; description: string; facing: 'front' | 'back'; overlay: 'document' | 'face' | 'none' }> = {
  ine_front: { title: 'INE frente', description: 'Alinea la parte frontal dentro del marco.', facing: 'back', overlay: 'document' },
  ine_back: { title: 'INE reverso', description: 'Alinea la parte posterior dentro del marco.', facing: 'back', overlay: 'document' },
  selfie: { title: 'Selfie', description: 'Coloca el rostro dentro de la guía.', facing: 'front', overlay: 'face' },
  house_front: { title: 'Foto frontal', description: 'Captura la fachada completa.', facing: 'back', overlay: 'none' },
  house_interior_1: { title: 'Interior 1', description: 'Captura una vista amplia del interior.', facing: 'back', overlay: 'none' },
  house_interior_2: { title: 'Interior 2', description: 'Captura una segunda vista del interior.', facing: 'back', overlay: 'none' },
  house_extra: { title: 'Foto adicional', description: 'Captura evidencia complementaria.', facing: 'back', overlay: 'none' },
};
