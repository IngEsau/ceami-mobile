import { captureConfig } from './photo-capture.types';

describe('capture configuration', () => {
  it('uses the rear camera for INE and housing evidence, and the front camera for selfie', () => {
    expect(captureConfig.ine_front.facing).toBe('back');
    expect(captureConfig.ine_back.facing).toBe('back');
    expect(captureConfig.house_front.facing).toBe('back');
    expect(captureConfig.selfie.facing).toBe('front');
  });
});
