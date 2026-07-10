import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppIcon, AppScreen, CeamiWordmark, QuickActionCard } from '../../../shared/ui';
import { colors, spacing } from '../../../shared/theme';
import { useApplicationStore } from '../application/application.store';
import { useAuthStore } from '../../auth/application/auth.store';
import { useVisitStore } from '../../visits/application/visit.store';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const load = useApplicationStore((state) => state.load);
  const createDraft = useApplicationStore((state) => state.createDraft);
  const currentApplication = useApplicationStore((state) => state.currentApplication);
  const startVisit = useVisitStore((state) => state.startDraft);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    void load();
  }, [load]);

  const startApplication = async () => {
    if (!currentApplication || currentApplication.status === 'submitted') await createDraft();
    navigation.navigate('ApplicationIntro');
  };

  const beginVisit = async () => {
    await startVisit();
    navigation.navigate('VisitDocuments');
  };

  return (
    <AppScreen>
      <View style={styles.intro}>
        <CeamiWordmark />
        <Text style={styles.greeting}>Buenos días,{`\n`}{user?.firstName ?? 'Daniel'}</Text>
        <Text style={styles.description}>Gestiona tus solicitudes y visitas{`\n`}desde un solo lugar.</Text>
      </View>
      <View style={styles.actions}>
        <QuickActionCard
          variant="primary"
          title="Nueva solicitud"
          subtitle={'Inicia un nuevo proceso\nde crédito.'}
          icon={<AppIcon name="file-plus" size={28} color={colors.surface} />}
          onPress={() => void startApplication()}
        />
        <View style={styles.secondaryRow}>
          <QuickActionCard
            title="Generar visita"
            subtitle="Captura una visita."
            icon={<AppIcon name="house" size={28} />}
            onPress={() => void beginVisit()}
          />
          <View style={styles.secondaryGap} />
          <QuickActionCard
            title="Solicitudes"
            subtitle="Consulta tus registros."
            icon={<AppIcon name="credit-card" size={28} />}
            onPress={() => navigation.navigate('ApplicationsList')}
          />
        </View>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  intro: { paddingTop: spacing.lg, paddingBottom: spacing['2xl'] },
  greeting: { color: colors.textPrimary, fontSize: 30, lineHeight: 36, fontWeight: '800', marginTop: spacing['2xl'] },
  description: { color: colors.textSecondary, fontSize: 17, lineHeight: 25, marginTop: spacing.md },
  actions: { width: '100%' },
  secondaryRow: { flexDirection: 'row', alignItems: 'stretch', width: '100%' },
  secondaryGap: { width: spacing.md },
});
