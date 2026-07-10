import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/types';
import { AppHeader, AppScreen, BrandHeroCard, InfoNotice } from '.';
import { colors, spacing } from '../theme';
type Props = NativeStackScreenProps<RootStackParamList, 'Placeholder'>;
export const PlaceholderScreen = ({ navigation, route }: Props) => <AppScreen><AppHeader title={route.params.title} showBack onBack={() => navigation.goBack()} /><BrandHeroCard title={route.params.title} subtitle={route.params.subtitle} centered /><InfoNotice>Esta pantalla queda preparada como extensión del MVP.</InfoNotice><Text style={styles.text}>La navegación ya está conectada y el contrato de esta función puede integrarse en la siguiente fase.</Text></AppScreen>;
const styles = StyleSheet.create({ text: { color: colors.textSecondary, fontSize: 17, lineHeight: 26, marginTop: spacing.xl, textAlign: 'center' } });
