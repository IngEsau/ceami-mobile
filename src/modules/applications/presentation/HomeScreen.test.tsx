import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './HomeScreen';
import { useApplicationStore } from '../application/application.store';

describe('HomeScreen', () => {
  beforeEach(() => {
    useApplicationStore.setState({
      currentApplication: undefined,
      applications: [],
      repository: { findAll: jest.fn().mockResolvedValue([]) } as never,
    });
  });

  it('shows only the three active CEAMI actions', () => {
    const { getByRole, queryByText } = render(<SafeAreaProvider><HomeScreen navigation={{ navigate: jest.fn() } as never} route={{} as never} /></SafeAreaProvider>);
    expect(getByRole('button', { name: 'Nueva solicitud' })).toBeTruthy();
    expect(getByRole('button', { name: 'Generar visita' })).toBeTruthy();
    expect(getByRole('button', { name: 'Solicitudes' })).toBeTruthy();
    expect(queryByText('Perfil')).toBeNull();
    expect(queryByText('Configuración')).toBeNull();
  });
});
