import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppHeader, AppIcon, AppScreen, PrimaryButton, SectionCard } from '../../../shared/ui';
import { colors, radius, spacing } from '../../../shared/theme';
import { useVisitStore } from '../application/visit.store';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitSuccess'>;

export const VisitSuccessScreen = ({ navigation }: Props) => {
  const visit = useVisitStore((state) => state.currentVisit);
  return <AppScreen><AppHeader title="Visita registrada" showBack onBack={() => navigation.replace('Home')} /><SectionCard style={styles.card}><View style={styles.icon}><AppIcon name="check-circle" size={42} color={colors.brandLime} /></View><Text style={styles.title}>Visita registrada</Text><Text style={styles.folio}>{visit?.folio ?? 'VIS-000001'}</Text><Text style={styles.body}>La información y la evidencia fueron guardadas correctamente.</Text><View style={styles.status}><Text style={styles.statusLabel}>Estado</Text><Text style={styles.statusValue}>Visita completada</Text></View></SectionCard><PrimaryButton label="Volver al inicio" onPress={() => navigation.replace('Home')} /></AppScreen>;
};

const styles = StyleSheet.create({ card: { alignItems: 'center', paddingVertical: spacing['3xl'] }, icon: { width: 80, height: 80, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.limeSoft, marginBottom: spacing.lg }, title: { color: colors.textPrimary, fontSize: 27, fontWeight: '800', textAlign: 'center' }, folio: { color: colors.brandBlue, fontSize: 18, fontWeight: '800', marginTop: spacing.sm }, body: { color: colors.textSecondary, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: spacing.lg }, status: { width: '100%', padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.blueSoft, marginTop: spacing.xl }, statusLabel: { color: colors.textSecondary, fontSize: 14, fontWeight: '700' }, statusValue: { color: colors.textPrimary, fontSize: 18, fontWeight: '800', marginTop: spacing.xs } });
