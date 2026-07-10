import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppScreen, BrandHeroCard, FormTextInput, GradientButton, SectionCard, styles as ui } from '../../../shared/ui';
import { colors, spacing } from '../../../shared/theme';
import { useAuthStore } from '../application/auth.store';

const schema = z.object({ email: z.string().email('Ingresa un correo válido'), password: z.string().min(6, 'Mínimo 6 caracteres') });
type Form = z.infer<typeof schema>;
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
export const LoginScreen = ({ navigation }: Props) => { const [showPassword, setShowPassword] = useState(false); const login = useAuthStore((state) => state.login); const { control, handleSubmit } = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } }); return <AppScreen><BrandHeroCard eyebrow="RGC GOCA" title="Soluciones que avanzan contigo" subtitle="CEAMI Grupo Multiservicios" centered /><SectionCard><View style={styles.accent} /><Text style={styles.title}>Bienvenido</Text><Text style={[ui.secondary, styles.subtitle]}>Ingresa tus credenciales para continuar.</Text><FormTextInput control={control} name="email" label="Correo electrónico" placeholder="example@example.com" icon="♙" keyboardType="email-address" autoCapitalize="none" /><View><FormTextInput control={control} name="password" label="Contraseña" placeholder="••••••••" icon="▣" secureTextEntry={!showPassword} /><Pressable onPress={() => setShowPassword((value) => !value)} style={styles.show}><Text style={styles.showText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text></Pressable></View><Pressable onPress={() => {}}><Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text></Pressable><GradientButton label="Iniciar sesión" onPress={handleSubmit(({ email }) => { login(email); navigation.replace('Home'); })} /></SectionCard><Text style={styles.footer}>CEAMI Grupo Multiservicios</Text></AppScreen>; };
const styles = StyleSheet.create({ title: { color: colors.textPrimary, fontSize: 34, fontWeight: '800', textAlign: 'center', marginTop: spacing.md }, subtitle: { textAlign: 'center', marginVertical: spacing.xl }, accent: { height: 8, width: 108, borderRadius: 5, alignSelf: 'center', backgroundColor: colors.cyan }, show: { position: 'absolute', right: 12, bottom: 30 }, showText: { color: colors.secondaryNavy, fontWeight: '700' }, forgot: { color: colors.secondaryNavy, textAlign: 'right', fontSize: 15, fontWeight: '700', marginBottom: spacing.md }, footer: { color: colors.textSecondary, textAlign: 'center', fontWeight: '700', marginTop: spacing.sm } });
