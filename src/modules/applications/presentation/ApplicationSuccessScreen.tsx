import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppHeader, AppIcon, AppScreen, BrandHeroCard, InfoNotice, OutlineButton, PrimaryButton, SectionCard } from '../../../shared/ui';
import { colors, spacing } from '../../../shared/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

export const ApplicationSuccessScreen = ({ navigation }: Props) => (
  <AppScreen>
    <AppHeader title="Solicitud recibida" showBack onBack={() => navigation.navigate('Home')} />
    <BrandHeroCard title="La solicitud se recibió correctamente" subtitle="La información quedó registrada y será revisada para continuar con el proceso." centered>
      <View style={styles.check}><AppIcon name="check" size={40} color={colors.surface} /></View>
    </BrandHeroCard>
    <SectionCard>
      <Text style={styles.heading}>Resumen</Text>
      <Text style={styles.body}>La nueva solicitud fue registrada exitosamente. En breve podrá ser revisada para continuar con el proceso.</Text>
      <View style={styles.row}><Text style={styles.label}>Resultado</Text><Text style={styles.value}>Solicitud recibida</Text></View>
      <View style={styles.row}><Text style={styles.label}>Estatus</Text><Text style={styles.value}>En revisión</Text></View>
    </SectionCard>
    <InfoNotice>Puedes volver al inicio para consultar o comenzar otro proceso.</InfoNotice>
    <PrimaryButton label="Volver al inicio" onPress={() => navigation.replace('Home')} />
    <OutlineButton label="Ver solicitudes" onPress={() => navigation.navigate('ApplicationsList')} />
  </AppScreen>
);

const styles = StyleSheet.create({
  check: { width: 76, height: 76, borderRadius: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.12)', marginVertical: spacing.lg },
  heading: { color: colors.textPrimary, fontSize: 27, fontWeight: '800', marginBottom: spacing.lg },
  body: { color: colors.textSecondary, fontSize: 17, lineHeight: 27, marginBottom: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  label: { color: colors.textPrimary, fontSize: 17, fontWeight: '800', width: 130 },
  value: { color: colors.textSecondary, fontSize: 17, flex: 1 },
});
