import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppHeader, AppScreen, DocumentUploadCard, InfoNotice, PrimaryButton, ProgressSegments, SectionCard, StickyActionFooter } from '../../../shared/ui';
import { colors, spacing } from '../../../shared/theme';
import { hasRequiredHousingPhotos, visitHousingPhotosProgress } from '../domain/visit.rules';
import { useVisitStore } from '../application/visit.store';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitHousingPhotos'>;
const photos = [
  { target: 'house_front' as const, title: 'Foto frontal', subtitle: 'Obligatoria · Captura la fachada completa.', key: 'front' as const },
  { target: 'house_interior_1' as const, title: 'Interior 1', subtitle: 'Obligatoria · Captura una vista amplia.', key: 'interior1' as const },
  { target: 'house_interior_2' as const, title: 'Interior 2', subtitle: 'Obligatoria · Captura una segunda vista.', key: 'interior2' as const },
  { target: 'house_extra' as const, title: 'Foto adicional', subtitle: 'Opcional · Agrega evidencia complementaria.', key: 'extra' as const },
];

export const VisitHousingPhotosScreen = ({ navigation }: Props) => {
  const visit = useVisitStore((state) => state.currentVisit);
  const progress = visit ? visitHousingPhotosProgress(visit) : 0;
  const complete = Boolean(visit && hasRequiredHousingPhotos(visit));
  return <AppScreen footer={<StickyActionFooter><PrimaryButton label="Continuar" disabled={!complete} onPress={() => navigation.navigate('VisitWizard')} /></StickyActionFooter>}><AppHeader title="Fotos de vivienda" showBack onBack={() => navigation.goBack()} /><SectionCard><Text style={styles.heading}>Evidencia de vivienda</Text><Text style={styles.body}>Las primeras tres fotos son obligatorias. La evidencia adicional es opcional.</Text><Text style={styles.progress}>{progress} de 4 fotos capturadas</Text><ProgressSegments current={progress - 1} total={4} /></SectionCard>{photos.map((item) => { const photo = visit?.housingPhotos[item.key]; return <DocumentUploadCard key={item.target} title={item.title} subtitle={item.subtitle} captured={Boolean(photo)} imageUri={photo?.uri} onPress={() => navigation.navigate('CameraCapture', { target: item.target, owner: 'visit', returnTo: 'VisitHousingPhotos' })} />; })}{!complete && <InfoNotice>Captura la foto frontal y los dos interiores para habilitar el avance.</InfoNotice>}</AppScreen>;
};

const styles = StyleSheet.create({ heading: { color: colors.textPrimary, fontSize: 22, fontWeight: '800', marginBottom: spacing.sm }, body: { color: colors.textSecondary, fontSize: 16, lineHeight: 23 }, progress: { color: colors.textPrimary, fontSize: 15, fontWeight: '700', marginTop: spacing.lg } });
