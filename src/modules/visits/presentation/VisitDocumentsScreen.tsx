import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppHeader, AppScreen, DocumentUploadCard, InfoNotice, PrimaryButton, ProgressSegments, SectionCard, StickyActionFooter } from '../../../shared/ui';
import { colors, spacing } from '../../../shared/theme';
import { visitDocumentsProgress, hasRequiredVisitDocuments } from '../domain/visit.rules';
import { useVisitStore } from '../application/visit.store';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitDocuments'>;
const documents = [
  { target: 'ine_front' as const, title: 'INE frente', subtitle: 'Captura el frente de la identificación.', key: 'ineFront' as const },
  { target: 'ine_back' as const, title: 'INE reverso', subtitle: 'Captura el reverso de la identificación.', key: 'ineBack' as const },
  { target: 'selfie' as const, title: 'Selfie', subtitle: 'Captura el rostro del cliente.', key: 'selfie' as const },
];

export const VisitDocumentsScreen = ({ navigation }: Props) => {
  const visit = useVisitStore((state) => state.currentVisit);
  const progress = visit ? visitDocumentsProgress(visit) : 0;
  const complete = Boolean(visit && hasRequiredVisitDocuments(visit));
  return <AppScreen footer={<StickyActionFooter><PrimaryButton label="Continuar" disabled={!complete} onPress={() => navigation.navigate('VisitHousingPhotos')} /></StickyActionFooter>}><AppHeader title="Documentos del cliente" showBack onBack={() => navigation.goBack()} /><SectionCard><Text style={styles.heading}>Identificación del cliente</Text><Text style={styles.body}>Captura los tres documentos requeridos para continuar con la visita.</Text><Text style={styles.progress}>{progress} de 3 documentos listos</Text><ProgressSegments current={progress - 1} total={3} /></SectionCard>{documents.map((document) => { const photo = visit?.clientDocuments[document.key]; return <DocumentUploadCard key={document.target} title={document.title} subtitle={document.subtitle} captured={Boolean(photo)} imageUri={photo?.uri} onPress={() => navigation.navigate('CameraCapture', { target: document.target, owner: 'visit', returnTo: 'VisitDocuments' })} />; })}{!complete && <InfoNotice>Los tres documentos son obligatorios.</InfoNotice>}</AppScreen>;
};

const styles = StyleSheet.create({ heading: { color: colors.textPrimary, fontSize: 22, fontWeight: '800', marginBottom: spacing.sm }, body: { color: colors.textSecondary, fontSize: 16, lineHeight: 23 }, progress: { color: colors.textPrimary, fontSize: 15, fontWeight: '700', marginTop: spacing.lg } });
