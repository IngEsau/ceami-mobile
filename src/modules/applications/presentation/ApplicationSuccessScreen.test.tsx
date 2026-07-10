import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationSuccessScreen } from './ApplicationSuccessScreen';

describe('ApplicationSuccessScreen', () => {
  it('shows the review result promised by the flow', () => {
    const { getAllByText, getByText } = render(<SafeAreaProvider><ApplicationSuccessScreen navigation={{ navigate: jest.fn(), replace: jest.fn() } as never} route={{} as never} /></SafeAreaProvider>);
    expect(getAllByText('Solicitud recibida')).toHaveLength(2);
    expect(getByText('En revisión')).toBeTruthy();
  });
});
