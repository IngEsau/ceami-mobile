import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppHeader, AppIcon, AppScreen, BrandHeroCard, InfoNotice, PrimaryButton, SectionCard, SignaturePadCard } from '../../../shared/ui';
import { colors, spacing } from '../../../shared/theme';
import { useApplicationStore } from '../../applications/application/application.store';
import { canSubmitApplication } from '../../applications/domain/application.rules';
import { useSignatureCapture } from './useSignatureCapture';

type Props = NativeStackScreenProps<RootStackParamList, 'Signature'>;

export const SignatureScreen = ({ navigation }: Props) => {
  const application = useApplicationStore((state) => state.currentApplication);
  const captureSignature = useSignatureCapture();
  const submit = useApplicationStore((state) => state.submit);
  const [captured, setCaptured] = useState(Boolean(application?.signature?.status === 'captured'));
  const [accepted, setAccepted] = useState(false);
  const register = async () => setCaptured(await captureSignature());
  const canSend = Boolean(application && canSubmitApplication({ ...application, signature: captured ? { status: 'captured' } : application.signature }, accepted));
  const send = async () => {
    if (!canSend) return;
    await submit(accepted);
    navigation.replace('Success');
  };

  return (
    <AppScreen>
      <AppHeader title="Firma" showBack onBack={() => navigation.goBack()} />
      <BrandHeroCard title="Finaliza tu solicitud" subtitle="Registra tu firma y acepta los términos para continuar." centered />
      <SectionCard>
        <Text style={styles.heading}>Firma del solicitante</Text>
        <SignaturePadCard captured={captured} onPress={() => void register()} />
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: accepted }} onPress={() => setAccepted((value) => !value)} style={styles.checkRow}>
          <View style={[styles.checkbox, accepted && styles.checked]}>{accepted && <AppIcon name="check" size={18} color={colors.surface} />}</View>
          <Text style={styles.checkText}>Confirmo que la información capturada es correcta y acepto continuar con el proceso.</Text>
        </Pressable>
        <InfoNotice>Revisa tu información antes de finalizar esta etapa.</InfoNotice>
        <PrimaryButton label="Enviar solicitud" disabled={!canSend} onPress={() => void send()} />
      </SectionCard>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  heading: { color: colors.textPrimary, fontSize: 25, fontWeight: '800', marginBottom: spacing.lg },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.lg },
  checkbox: { width: 26, height: 26, borderWidth: 2, borderColor: colors.secondaryNavy, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  checked: { backgroundColor: colors.secondaryNavy },
  checkText: { flex: 1, color: colors.textSecondary, fontSize: 15, lineHeight: 22 },
});
