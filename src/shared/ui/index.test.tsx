import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import { DocumentUploadCard, FormSelect, FormTextInput, GradientButton, QuickActionCard, SignaturePadCard } from './index';

const FormHarness = () => {
  const { control } = useForm<{ email: string; phoneType: string }>({ defaultValues: { email: '', phoneType: '' } });
  return <><FormTextInput control={control} name="email" label="Correo" placeholder="correo@ejemplo.com" /><FormSelect control={control} name="phoneType" label="Tipo" options={[{ label: 'Celular', value: 'mobile' }, { label: 'Casa', value: 'home' }]} /></>;
};

describe('shared mobile UI', () => {
  it('calls a gradient button action unless it is disabled', () => {
    const onPress = jest.fn();
    const { getByRole, rerender } = render(<GradientButton label="Continuar" onPress={onPress} />);
    fireEvent.press(getByRole('button', { name: 'Continuar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    rerender(<GradientButton label="Continuar" disabled onPress={onPress} />);
    fireEvent.press(getByRole('button', { name: 'Continuar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('allows filling an input and choosing an option', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<FormHarness />);
    fireEvent.changeText(getByPlaceholderText('correo@ejemplo.com'), 'ana@ceami.mx');
    expect(getByPlaceholderText('correo@ejemplo.com').props.value).toBe('ana@ceami.mx');
    fireEvent.press(getByTestId('select-phoneType'));
    fireEvent.press(getByText('Casa'));
    expect(getByText('Casa')).toBeTruthy();
  });

  it('exposes the primary action cards', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<><QuickActionCard title="Nueva solicitud" subtitle="Comenzar" icon="+" onPress={onPress} /><DocumentUploadCard title="INE frente" subtitle="Captura" captured={false} onPress={onPress} /><SignaturePadCard captured={false} onPress={onPress} /></>);
    fireEvent.press(getByRole('button', { name: 'Nueva solicitud' }));
    fireEvent.press(getByRole('button', { name: 'INE frente' }));
    fireEvent.press(getByRole('button', { name: 'Registrar firma' }));
    expect(onPress).toHaveBeenCalledTimes(3);
  });
});
