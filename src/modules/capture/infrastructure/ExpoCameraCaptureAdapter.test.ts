jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///documents/',
  makeDirectoryAsync: jest.fn(),
  copyAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

import * as FileSystem from 'expo-file-system';
import { ExpoCameraCaptureAdapter } from './ExpoCameraCaptureAdapter';

describe('ExpoCameraCaptureAdapter', () => {
  beforeEach(() => jest.clearAllMocks());

  it('copies a confirmed photo into the app documents directory and returns that URI', async () => {
    const adapter = new ExpoCameraCaptureAdapter();
    const captured = await adapter.persist('ine_front', { uri: 'file:///cache/front.jpg', width: 1200, height: 800 });

    expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith('file:///documents/ceami-captures/', { intermediates: true });
    expect(FileSystem.copyAsync).toHaveBeenCalledWith({ from: 'file:///cache/front.jpg', to: captured.uri });
    expect(captured).toMatchObject({ target: 'ine_front', status: 'captured', width: 1200, height: 800 });
    expect(captured.uri).toMatch(/^file:\/\/\/documents\/ceami-captures\/ine_front-/);
  });

  it('discards a temporary camera file when the user repeats the capture', async () => {
    const adapter = new ExpoCameraCaptureAdapter();
    await adapter.discard('file:///cache/repeat.jpg');
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith('file:///cache/repeat.jpg', { idempotent: true });
  });
});
