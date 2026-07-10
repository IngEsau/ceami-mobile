import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppHeader, AppIcon, AppScreen, BrandHeroCard, InfoNotice, PrimaryButton, SectionCard } from '../../../shared/ui';
import { colors, spacing } from '../../../shared/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ApplicationIntro'>;

const ProcessStep = ({ icon, title, children }: { icon: 'check-circle' | 'credit-card' | 'file-plus'; title: string; children: string }) => (
  <View style={styles.step}>
    <View style={styles.stepIcon}><AppIcon name={icon} size={20} /></View>
    <View style={styles.stepCopy}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  </View>
);

export const ApplicationIntroScreen = ({ navigation }: Props) => (
  <AppScreen>
    <AppHeader title="Nueva solicitud" showBack onBack={() => navigation.goBack()} />
    <BrandHeroCard title="Comencemos" subtitle="Estás por iniciar una nueva solicitud en CEAMI." centered />
    <SectionCard>
      <Text style={styles.heading}>Antes de continuar</Text>
      <Text style={styles.body}>Te guiaremos paso a paso para completar tu solicitud. Ten a la mano tu identificación oficial y verifica tu información antes de avanzar.</Text>
      <InfoNotice>Tu proceso será guiado y seguro dentro de la plataforma CEAMI.</InfoNotice>
    </SectionCard>
    <Text style={styles.heading}>Pasos del proceso</Text>
    <SectionCard>
      <ProcessStep icon="check-circle" title="Validación inicial">Se revisan los datos básicos del solicitante.</ProcessStep>
      <ProcessStep icon="credit-card" title="Documentación">Captura tu INE por ambos lados y una selfie.</ProcessStep>
      <ProcessStep icon="file-plus" title="Captura de información">Completa tus datos generales, familiares y laborales.</ProcessStep>
    </SectionCard>
    <PrimaryButton label="Continuar" onPress={() => navigation.navigate('Documents')} />
  </AppScreen>
);

const styles = StyleSheet.create({
  heading: { color: colors.textPrimary, fontSize: 27, fontWeight: '800', marginBottom: spacing.lg },
  body: { color: colors.textSecondary, fontSize: 17, lineHeight: 27, marginBottom: spacing.lg },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md },
  stepIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 19, backgroundColor: colors.blueSoft },
  stepCopy: { flex: 1 },
  stepTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '800', marginBottom: spacing.xs },
});
