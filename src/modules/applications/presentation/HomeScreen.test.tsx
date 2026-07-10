import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './HomeScreen';
import { useApplicationStore } from '../application/application.store';
import { useVisitStore } from '../../visits/application/visit.store';
import { VisitDraft } from '../../visits/domain/visit.types';

const visitDraft: VisitDraft = { id: 'visit-1', folio: 'VIS-000001', status: 'draft', createdAt: '', updatedAt: '', clientDocuments: {}, housingPhotos: {} };

describe('HomeScreen', () => {
  beforeEach(() => {
    useApplicationStore.setState({
      currentApplication: undefined,
      applications: [],
      repository: { findAll: jest.fn().mockResolvedValue([]) } as never,
    });
    useVisitStore.setState({
      currentVisit: undefined,
      visits: [],
      currentStep: 0,
      repository: { findAll: jest.fn().mockResolvedValue([]), createDraft: jest.fn().mockResolvedValue(visitDraft), save: jest.fn(), findById: jest.fn() } as never,
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

  it('creates a visit draft and opens the visit documents flow', async () => {
    const navigation = { dispatch: jest.fn() } as never;
    const { getByRole } = render(<SafeAreaProvider><HomeScreen navigation={navigation} route={{} as never} /></SafeAreaProvider>);
    fireEvent.press(getByRole('button', { name: 'Generar visita' }));
    await waitFor(() => expect((navigation as { dispatch: jest.Mock }).dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'PUSH', payload: { name: 'VisitDocuments', params: undefined } })));
    expect(useVisitStore.getState().currentVisit?.folio).toBe('VIS-000001');
  });
});
