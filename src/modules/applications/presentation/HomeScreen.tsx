import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppScreen, CeamiWordmark, QuickActionCard } from '../../../shared/ui';
import { colors, spacing } from '../../../shared/theme';
import { useApplicationStore } from '../application/application.store';
import { useAuthStore } from '../../auth/application/auth.store';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const load = useApplicationStore((state) => state.load);
  const createDraft = useApplicationStore((state) => state.createDraft);
  const currentApplication = useApplicationStore((state) => state.currentApplication);
  const user = useAuthStore((state) => state.user);
  useEffect(() => { void load(); }, [load]);

  const startApplication = async () => {
    if (!currentApplication || currentApplication.status === 'submitted') await createDraft();
    navigation.navigate('ApplicationIntro');
  };

  return <AppScreen><View style={styles.intro}><CeamiWordmark /><Text style={styles.greeting}>Buenos días,{`\n`}{user?.firstName ?? 'Daniel'}</Text><Text style={styles.description}>Gestiona tus solicitudes y visitas{`\n`}desde un solo lugar.</Text></View><View style={styles.actions}><QuickActionCard variant="primary" title="Nueva solicitud" subtitle={'Inicia un nuevo proceso\nde crédito.'} icon="▤" onPress={() => void startApplication()} /><View style={styles.secondaryRow}><QuickActionCard title="Generar visita" subtitle="Captura una visita." icon="⌂" onPress={() => navigation.navigate('Placeholder', { title: 'Generar visita', subtitle: 'Esta función estará disponible en una siguiente fase del MVP.' })} /><View style={styles.secondaryGap} /><QuickActionCard title="Solicitudes" subtitle="Consulta tus registros." icon="▭" onPress={() => navigation.navigate('ApplicationsList')} /></View></View></AppScreen>;
};

const styles = StyleSheet.create({ intro: { paddingTop: spacing.lg, paddingBottom: spacing['2xl'] }, greeting: { color: colors.textPrimary, fontSize: 30, lineHeight: 36, fontWeight: '800', marginTop: spacing['2xl'] }, description: { color: colors.textSecondary, fontSize: 17, lineHeight: 25, marginTop: spacing.md }, actions: { width: '100%' }, secondaryRow: { flexDirection: 'row', alignItems: 'stretch', width: '100%' }, secondaryGap: { width: spacing.md } });
