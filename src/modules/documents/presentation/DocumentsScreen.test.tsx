import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DocumentsScreen } from './DocumentsScreen';
import { useApplicationStore } from '../../applications/application/application.store';
import { CreditApplication, emptyDocuments } from '../../applications/domain/application.types';

const draft: CreditApplication = { id: 'draft-1', folio: 'SOL-000001', status: 'draft', createdAt: '2026-07-10T00:00:00.000Z', updatedAt: '2026-07-10T00:00:00.000Z', documents: emptyDocuments(), signature: { status: 'pending' } };

describe('DocumentsScreen', () => {
  beforeEach(() => useApplicationStore.setState({ currentApplication: draft }));

  it('does not expose the next action before three files are captured', () => {
    const { getByText, queryByRole } = render(<SafeAreaProvider><DocumentsScreen navigation={{ goBack: jest.fn(), navigate: jest.fn() } as never} route={{} as never} /></SafeAreaProvider>);
    expect(getByText('0 de 3 archivos listos')).toBeTruthy();
    expect(queryByRole('button', { name: 'Siguiente' })).toBeNull();
  });
});
