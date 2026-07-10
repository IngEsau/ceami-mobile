import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

let mockPermission = { granted: false, canAskAgain: true, status: 'undetermined' };
const mockRequestPermission = jest.fn();

jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  useCameraPermissions: () => [mockPermission, mockRequestPermission],
}));

jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => true,
}));

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

import { CameraCaptureScreen } from './CameraCaptureScreen';

describe('CameraCaptureScreen', () => {
  beforeEach(() => {
    mockPermission = { granted: false, canAskAgain: true, status: 'undetermined' };
    mockRequestPermission.mockReset();
  });

  it('offers a recoverable permission action when camera access is denied', () => {
    const navigation = { goBack: jest.fn(), replace: jest.fn() } as never;
    const { getByRole, getByText } = render(
      <SafeAreaProvider>
        <CameraCaptureScreen navigation={navigation} route={{ params: { target: 'ine_front', owner: 'application', returnTo: 'Documents' } } as never} />
      </SafeAreaProvider>,
    );

    expect(getByText('Permiso de cámara requerido')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'Permitir cámara' }));
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });
});
