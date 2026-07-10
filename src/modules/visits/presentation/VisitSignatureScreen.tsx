import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppHeader, AppIcon, AppScreen, InfoNotice, OutlineButton, PrimaryButton, SectionCard, SignaturePadCard, StickyActionFooter } from '../../../shared/ui';
import { colors, spacing } from '../../../shared/theme';
import { canCompleteVisit } from '../domain/visit.rules';
import { useVisitStore } from '../application/visit.store';
import { MockSignatureCaptureSource } from '../../signature/infrastructure/MockSignatureCaptureSource';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitSignature'>;

export const VisitSignatureScreen = ({ navigation }: Props) => {
  const visit = useVisitStore((state) => state.currentVisit);
  const saveSignature = useVisitStore((state) => state.saveSignature);
  const finish = useVisitStore((state) => state.finish);
  const source = useMemo(() => new MockSignatureCaptureSource(), []);
  const [data, setData] = useState<string | undefined>(visit?.signature?.data);
  const register = async () => setData(await source.capture());
  const canFinish = Boolean(visit && canCompleteVisit({ ...visit, signature: data ? { data, capturedAt: new Date().toISOString() } : undefined }));
  const finalize = async () => { if (!data || !canFinish) return; await saveSignature(data); await finish(); navigation.replace('VisitSuccess'); };
  return <AppScreen footer={<StickyActionFooter><PrimaryButton label="Finalizar visita" disabled={!canFinish} onPress={() => void finalize()} /></StickyActionFooter>}><AppHeader title="Firma de visita" showBack onBack={() => navigation.goBack()} /><SectionCard><Text style={styles.heading}>Firma del cliente</Text><Text style={styles.body}>Registra la firma para confirmar que la evidencia de la visita es correcta.</Text><SignaturePadCard captured={Boolean(data)} onPress={() => void register()} /><View style={styles.actions}><View style={styles.action}><OutlineButton label="Limpiar" onPress={() => setData(undefined)} /></View><View style={styles.action}><PrimaryButton label="Confirmar firma" icon={<AppIcon name="check" size={18} color={colors.surface} />} disabled={!data} onPress={() => void saveSignature(data ?? '')} /></View></View><InfoNotice>La visita no puede finalizarse hasta contar con documentos, fotos obligatorias, formulario y firma.</InfoNotice></SectionCard></AppScreen>;
};

const styles = StyleSheet.create({ heading: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: spacing.sm }, body: { color: colors.textSecondary, fontSize: 16, lineHeight: 23, marginBottom: spacing.lg }, actions: { flexDirection: 'row', gap: spacing.md }, action: { flex: 1 } });
