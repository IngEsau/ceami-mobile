import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppHeader, AppScreen, EmptyState, ProgressSegments, SectionCard, StatusBadge } from '../../../shared/ui';
import { colors, spacing } from '../../../shared/theme';
import { documentsProgress, wizardProgress } from '../domain/application.rules';
import { CreditApplication } from '../domain/application.types';
import { useApplicationStore } from '../application/application.store';

type Props = NativeStackScreenProps<RootStackParamList, 'ApplicationDetail'>;

export const ApplicationDetailScreen = ({ navigation, route }: Props) => {
  const getById = useApplicationStore((state) => state.getById);
  const [application, setApplication] = useState<CreditApplication | undefined>();

  useEffect(() => { void getById(route.params.id).then(setApplication); }, [getById, route.params.id]);

  if (!application) return <AppScreen><AppHeader title="Detalle de solicitud" showBack onBack={() => navigation.goBack()} /><EmptyState title="Solicitud no disponible" subtitle="No encontramos este registro en el almacenamiento local." /></AppScreen>;

  const name = application.applicantName ?? application.generalData?.clientName ?? 'Solicitante pendiente';
  return <AppScreen><AppHeader title="Detalle de solicitud" showBack onBack={() => navigation.goBack()} /><SectionCard><Text style={styles.folio}>{application.folio}</Text><Text style={styles.name}>{name}</Text><Text style={styles.date}>Creada el {new Date(application.createdAt).toLocaleDateString('es-MX')}</Text><StatusBadge status={application.status} /></SectionCard><SectionCard><Text style={styles.heading}>Avance de la solicitud</Text><View style={styles.progressBlock}><Text style={styles.label}>Documentación</Text><Text style={styles.value}>{documentsProgress(application)} de 3 archivos</Text></View><ProgressSegments current={documentsProgress(application) - 1} total={3} /><View style={styles.progressBlock}><Text style={styles.label}>Información capturada</Text><Text style={styles.value}>{wizardProgress(application)} de 4 pasos</Text></View><ProgressSegments current={wizardProgress(application) - 1} total={4} /></SectionCard><SectionCard><Text style={styles.heading}>Resumen</Text><Text style={styles.summaryLabel}>Firma</Text><Text style={styles.summaryValue}>{application.signature?.status === 'captured' ? 'Registrada' : 'Pendiente'}</Text><Text style={styles.summaryLabel}>Resultado</Text><Text style={styles.summaryValue}>{application.status === 'submitted' ? 'Solicitud recibida' : 'Pendiente de envío'}</Text></SectionCard></AppScreen>;
};

const styles = StyleSheet.create({ folio: { color: colors.secondaryNavy, fontSize: 15, fontWeight: '800' }, name: { color: colors.textPrimary, fontSize: 26, fontWeight: '800', marginTop: spacing.sm }, date: { color: colors.textSecondary, fontSize: 15, marginTop: spacing.sm }, heading: { color: colors.textPrimary, fontSize: 22, fontWeight: '800', marginBottom: spacing.md }, progressBlock: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg }, label: { color: colors.textPrimary, fontWeight: '700' }, value: { color: colors.textSecondary }, summaryLabel: { color: colors.textSecondary, fontSize: 15, marginTop: spacing.lg }, summaryValue: { color: colors.textPrimary, fontSize: 18, fontWeight: '800', marginTop: spacing.xs } });
