import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './LoginScreen';
import { useAuthStore } from '../application/auth.store';

describe('LoginScreen', () => {
  beforeEach(() => useAuthStore.setState({ user: undefined }));

  it('stores a mock user and opens Home with valid credentials', async () => {
    const navigation = { replace: jest.fn() } as never;
    const { getByPlaceholderText, getByRole } = render(<SafeAreaProvider><LoginScreen navigation={navigation} route={{} as never} /></SafeAreaProvider>);
    fireEvent.changeText(getByPlaceholderText('example@example.com'), 'alejandra@ceami.mx');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'secreto');
    fireEvent.press(getByRole('button', { name: 'Iniciar sesión' }));
    await waitFor(() => expect((navigation as { replace: jest.Mock }).replace).toHaveBeenCalledWith('Home'));
    expect(useAuthStore.getState().user?.email).toBe('alejandra@ceami.mx');
  });
});
