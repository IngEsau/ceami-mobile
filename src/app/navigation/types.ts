import { CaptureTarget } from '../../modules/capture/domain/photo-capture.types';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ApplicationIntro: undefined;
  Documents: undefined;
  Wizard: undefined;
  Signature: undefined;
  Success: undefined;
  ApplicationsList: undefined;
  ApplicationDetail: { id: string };
  VisitDocuments: undefined;
  VisitHousingPhotos: undefined;
  VisitWizard: undefined;
  VisitSignature: undefined;
  VisitSuccess: undefined;
  CameraCapture: { target: CaptureTarget; owner: 'application' | 'visit'; returnTo: 'Documents' | 'VisitDocuments' | 'VisitHousingPhotos' };
  Placeholder: { title: string; subtitle: string };
};
