import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppScreen, CeamiWordmark, FormTextInput, PrimaryButton, SectionCard } from '../../../shared/ui';
import { colors, spacing } from '../../../shared/theme';
import { useAuthStore } from '../application/auth.store';

const schema = z.object({ email: z.string().email('Ingresa un correo válido'), password: z.string().min(6, 'Mínimo 6 caracteres') });
type Form = z.infer<typeof schema>;
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const { control, handleSubmit } = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  return <AppScreen><View style={styles.intro}><CeamiWordmark /><Text style={styles.title}>Acceso a la plataforma</Text><Text style={styles.subtitle}>Gestiona solicitudes de manera{`\n`}segura y eficiente.</Text></View><SectionCard style={styles.formCard}><FormTextInput control={control} name="email" label="Correo electrónico" placeholder="example@example.com" keyboardType="email-address" autoCapitalize="none" /><View style={styles.passwordWrap}><FormTextInput control={control} name="password" label="Contraseña" placeholder="••••••••" secureTextEntry={!showPassword} /><Pressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onPress={() => setShowPassword((value) => !value)} style={styles.show}><Text style={styles.showText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text></Pressable></View><Pressable accessibilityRole="button" accessibilityLabel="Recuperar contraseña" onPress={() => undefined}><Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text></Pressable><PrimaryButton label="Iniciar sesión" onPress={handleSubmit(({ email }) => { login(email); navigation.replace('Home'); })} /></SectionCard></AppScreen>;
};

const styles = StyleSheet.create({ intro: { paddingTop: spacing['2xl'], paddingBottom: spacing['3xl'] }, title: { color: colors.textPrimary, fontSize: 29, lineHeight: 35, fontWeight: '800', marginTop: spacing['2xl'] }, subtitle: { color: colors.textSecondary, fontSize: 17, lineHeight: 25, marginTop: spacing.md }, formCard: { paddingTop: spacing['2xl'] }, passwordWrap: { position: 'relative' }, show: { position: 'absolute', right: spacing.lg, top: 40, minHeight: 34, justifyContent: 'center' }, showText: { color: colors.brandBlue, fontSize: 14, fontWeight: '800' }, forgot: { color: colors.brandBlue, textAlign: 'right', fontSize: 14, fontWeight: '700', marginTop: spacing.xs, marginBottom: spacing.md } });
