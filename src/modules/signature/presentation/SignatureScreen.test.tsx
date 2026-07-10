import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SignatureScreen } from './SignatureScreen';
import { useApplicationStore } from '../../applications/application/application.store';
import { CreditApplication, emptyDocuments } from '../../applications/domain/application.types';

const incomplete: CreditApplication = { id: 'draft-1', folio: 'SOL-000001', status: 'signature_pending', createdAt: '2026-07-10T00:00:00.000Z', updatedAt: '2026-07-10T00:00:00.000Z', documents: emptyDocuments(), signature: { status: 'pending' } };

describe('SignatureScreen', () => {
  beforeEach(() => useApplicationStore.setState({ currentApplication: incomplete }));

  it('keeps submission disabled until the application meets domain requirements', () => {
    const { getByRole } = render(<SafeAreaProvider><SignatureScreen navigation={{ goBack: jest.fn(), replace: jest.fn() } as never} route={{} as never} /></SafeAreaProvider>);
    expect(getByRole('button', { name: 'Enviar solicitud' })).toBeDisabled();
  });
});
