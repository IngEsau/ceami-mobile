import React, { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { colors, fontSize, radius, spacing } from '../theme';
import { AppIcon } from './AppIcon';

export { AppIcon };
export type { AppIconName } from './AppIcon';

const uiColors = {
  brand: colors.royalBlue,
  accent: colors.cyan,
  dark: colors.secondaryNavy,
  success: colors.success,
  softBlue: colors.muted,
  softCyan: '#E4F7FC',
  softSuccess: '#F0F8DF',
  softDanger: '#F5F2ED',
  error: '#D64B5A',
  overlay: 'rgba(3, 60, 104, 0.42)',
} as const;

export const CeamiWordmark = ({ light = false, compact = false }: { light?: boolean; compact?: boolean }) => (
  <Text accessibilityLabel="CEAMI" style={[styles.wordmark, light && styles.wordmarkLight, compact && styles.wordmarkCompact]}>CEAMI</Text>
);

export const AppScreen = ({ children, scroll = true, footer, noPadding = false }: { children: ReactNode; scroll?: boolean; footer?: ReactNode; noPadding?: boolean }) => {
  const entrance = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(entrance, { toValue: 1, duration: 180, useNativeDriver: true }).start(); }, [entrance]);
  const contentStyle = [styles.content, noPadding && styles.noPadding];
  return <SafeAreaView style={styles.safe}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><Animated.View style={[styles.flex, { opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }]}>{scroll ? <ScrollView contentContainerStyle={contentStyle} keyboardShouldPersistTaps="handled">{children}</ScrollView> : <View style={contentStyle}>{children}</View>}{footer}</Animated.View></KeyboardAvoidingView></SafeAreaView>;
};

export const AppHeader = ({ title, showBack = false, onBack }: { title: string; showBack?: boolean; onBack?: () => void }) => <View style={styles.header}>{showBack ? <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={onBack} style={styles.back}><AppIcon name="arrow-left" size={26} color={uiColors.brand} /></Pressable> : <View style={styles.headerSpacer} />}<Text style={styles.headerTitle}>{title}</Text><View style={styles.headerSpacer} /></View>;

export const BrandHeroCard = ({ eyebrow, title, subtitle, centered = false, showLogos = true, children }: { eyebrow?: string; title: string; subtitle?: string; centered?: boolean; showLogos?: boolean; children?: ReactNode }) => <View style={[styles.hero, centered && styles.heroCentered]}><View style={styles.heroDecorOne} /><View style={styles.heroDecorTwo} />{showLogos && <CeamiWordmark light compact />}{eyebrow && <Text style={[styles.heroEyebrow, centered && styles.centerText]}>{eyebrow}</Text>}<Text style={[styles.heroTitle, centered && styles.centerText]}>{title}</Text>{subtitle && <Text style={[styles.heroSubtitle, centered && styles.centerText]}>{subtitle}</Text>}{children}</View>;

export const PrimaryButton = ({ label, icon, disabled, loading, onPress }: { label: string; icon?: ReactElement; disabled?: boolean; loading?: boolean; onPress: () => void }) => <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled || loading} onPress={onPress} style={({ pressed }) => [styles.button, (disabled || loading) && styles.disabled, pressed && styles.buttonPressed]}><View style={styles.buttonSurface}>{loading ? <ActivityIndicator color={colors.surface} /> : <>{icon}<Text style={styles.buttonText}>{label}</Text></>}</View></Pressable>;
export const OutlineButton = ({ label, onPress }: { label: string; onPress: () => void }) => <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.outlineButton, pressed && styles.buttonPressed]}><Text style={styles.outlineText}>{label}</Text></Pressable>;

export const SectionCard = ({ children, style }: { children: ReactNode; style?: object }) => <View style={[styles.sectionCard, style]}>{children}</View>;
export const StickyActionFooter = ({ children }: { children: ReactNode }) => <View style={styles.stickyActionFooter}>{children}</View>;
export const InfoNotice = ({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'danger' | 'success' }) => <View style={[styles.notice, tone === 'danger' && styles.dangerNotice, tone === 'success' && styles.successNotice]}><AppIcon name={tone === 'success' ? 'check-circle' : 'info'} size={20} color={tone === 'success' ? uiColors.dark : uiColors.brand} /><Text style={styles.noticeText}>{children}</Text></View>;
export const StatusBadge = ({ status }: { status: string }) => <View style={styles.statusBadge}><Text style={styles.statusText}>{status === 'submitted' || status === 'in_review' ? 'En revisión' : status === 'draft' ? 'Borrador' : status}</Text></View>;
export const EmptyState = ({ title, subtitle }: { title: string; subtitle: string }) => <SectionCard style={styles.empty}><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.secondary}>{subtitle}</Text></SectionCard>;

export const QuickActionCard = ({ title, subtitle, icon, variant = 'secondary', onPress }: { title: string; subtitle: string; icon: ReactElement; variant?: 'primary' | 'secondary'; onPress: () => void }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (toValue: number) => Animated.timing(scale, { toValue, duration: 100, useNativeDriver: true }).start();
  const isPrimary = variant === 'primary';
  return <Animated.View style={[isPrimary ? styles.actionMotionPrimary : styles.actionMotionSecondary, { transform: [{ scale }] }]}><Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} onPressIn={() => animate(0.985)} onPressOut={() => animate(1)} style={({ pressed }) => [styles.quickCard, isPrimary ? styles.quickCardPrimary : styles.quickCardSecondary, pressed && styles.quickPressed]}>{isPrimary && <View style={styles.quickDecor} />}<View style={[styles.quickIcon, isPrimary && styles.quickIconPrimary]}>{icon}</View><View style={styles.quickCopy}><Text style={[styles.quickTitle, isPrimary && styles.quickTitlePrimary]}>{title}</Text><Text style={[styles.quickSubtitle, isPrimary && styles.quickSubtitlePrimary]}>{subtitle}</Text></View>{isPrimary && <AppIcon name="arrow-right" size={24} color={colors.surface} />}</Pressable></Animated.View>;
};

export const FormTextInput = <T extends FieldValues>({ control, name, label, placeholder, icon, ...props }: { control: Control<T>; name: Path<T>; label: string; placeholder?: string; icon?: ReactElement } & Omit<TextInputProps, 'value' | 'onChangeText'>) => <Controller control={control} name={name} render={({ field: { onChange, value }, fieldState: { error } }) => <View style={styles.inputWrap}><Text style={styles.inputLabel}>{label}</Text><View style={[styles.inputBox, error && styles.inputError]}>{icon && <View style={styles.inputIcon}>{icon}</View>}<TextInput {...props} style={styles.input} value={value == null ? '' : String(value)} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={colors.textSecondary} /></View>{error && <Text style={styles.errorText}>{error.message}</Text>}</View>} />;

type SelectOption = { label: string; value: string };
const FormSelectField = ({ value, onChange, options, placeholder, hasError, testID }: { value?: string; onChange: (value: string) => void; options: SelectOption[]; placeholder: string; hasError: boolean; testID: string }) => {
  const [visible, setVisible] = useState(false);
  const selected = options.find((option) => option.value === value)?.label;
  const select = (nextValue: string) => { onChange(nextValue); setVisible(false); };
  return <><Pressable testID={testID} accessibilityRole="button" accessibilityLabel={selected ?? placeholder} style={[styles.inputBox, hasError && styles.inputError]} onPress={() => setVisible(true)}><Text style={styles.input}>{selected ?? placeholder}</Text><AppIcon name="chevron-down" size={18} color={uiColors.brand} /></Pressable><Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}><Pressable style={styles.selectBackdrop} onPress={() => setVisible(false)}><Pressable style={styles.selectSheet} onPress={() => undefined}>{options.map((option) => <Pressable key={option.value} accessibilityRole="button" onPress={() => select(option.value)} style={[styles.selectOption, option.value === value && styles.selectOptionSelected]}><Text style={[styles.selectOptionText, option.value === value && styles.selectOptionTextSelected]}>{option.label}</Text></Pressable>)}</Pressable></Pressable></Modal></>;
};
export const FormSelect = <T extends FieldValues>({ control, name, label, options, placeholder = 'Selecciona una opción' }: { control: Control<T>; name: Path<T>; label: string; options: SelectOption[]; placeholder?: string }) => <Controller control={control} name={name} render={({ field: { onChange, value }, fieldState: { error } }) => <View style={styles.inputWrap}><Text style={styles.inputLabel}>{label}</Text><FormSelectField testID={`select-${String(name)}`} value={value} onChange={onChange} options={options} placeholder={placeholder} hasError={Boolean(error)} />{error && <Text style={styles.errorText}>{error.message}</Text>}</View>} />;

export const ProgressSegments = ({ current, total }: { current: number; total: number }) => <View style={styles.progressRow}>{Array.from({ length: total }).map((_, index) => <View key={index} style={[styles.progressSegment, index <= current && styles.progressActive]} />)}</View>;
export const DocumentUploadCard = ({ title, subtitle, captured, imageUri, onPress }: { title: string; subtitle: string; captured: boolean; imageUri?: string; onPress: () => void }) => <Pressable accessibilityRole="button" accessibilityLabel={captured ? `Reemplazar ${title}` : title} onPress={onPress} style={styles.documentCard}>{imageUri ? <Image source={{ uri: imageUri }} style={styles.documentThumbnail} /> : <View style={[styles.documentIcon, captured && styles.capturedIcon]}><AppIcon name={captured ? 'check-circle' : 'image-plus'} size={28} color={captured ? uiColors.dark : uiColors.brand} /></View>}<View style={styles.documentCopy}><Text style={styles.documentTitle}>{title}</Text><Text style={styles.secondary}>{captured ? 'Listo · Reemplazar' : subtitle}</Text></View><AppIcon name={captured ? 'check-circle' : 'camera'} size={24} color={captured ? uiColors.success : colors.textSecondary} /></Pressable>;
export const SignaturePadCard = ({ captured, onPress }: { captured: boolean; onPress: () => void }) => <Pressable accessibilityRole="button" accessibilityLabel="Registrar firma" onPress={onPress} style={styles.signaturePad}><AppIcon name={captured ? 'check-circle' : 'signature'} size={28} color={uiColors.brand} /><Text style={styles.signatureTitle}>{captured ? 'Firma registrada' : 'Firma del solicitante'}</Text><Text style={styles.signatureLine}>{captured ? 'Puedes continuar con el envío' : 'Toca para registrar tu firma'}</Text></Pressable>;

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, flex: { flex: 1 }, content: { padding: spacing.xl, paddingBottom: 40 }, noPadding: { padding: 0 },
  wordmark: { color: uiColors.brand, fontSize: 25, fontWeight: '800', letterSpacing: 1.6 }, wordmarkLight: { color: colors.surface }, wordmarkCompact: { fontSize: 20, letterSpacing: 1.2 },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background, paddingHorizontal: spacing.lg }, headerTitle: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '800' }, headerSpacer: { width: 44 }, back: { width: 44, height: 44, alignItems: 'flex-start', justifyContent: 'center' },
  hero: { backgroundColor: uiColors.brand, borderRadius: radius.xl, padding: spacing.xl, minHeight: 210, overflow: 'hidden', marginBottom: spacing.xl }, heroCentered: { alignItems: 'center', justifyContent: 'center' }, heroDecorOne: { position: 'absolute', right: -34, top: -28, width: 146, height: 146, borderRadius: 80, backgroundColor: uiColors.accent, opacity: 0.12 }, heroDecorTwo: { position: 'absolute', left: -54, bottom: -68, width: 160, height: 118, borderRadius: 70, backgroundColor: colors.surface, opacity: 0.08 }, heroEyebrow: { color: uiColors.softCyan, fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.sm }, heroTitle: { color: colors.surface, fontSize: fontSize.xl, lineHeight: 34, fontWeight: '800', maxWidth: '95%' }, heroSubtitle: { color: uiColors.softCyan, fontSize: fontSize.md, lineHeight: 24, marginTop: spacing.sm }, centerText: { textAlign: 'center' },
  button: { borderRadius: radius.md, overflow: 'hidden', minHeight: 54, marginTop: spacing.lg }, buttonSurface: { flex: 1, minHeight: 54, backgroundColor: uiColors.brand, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xl }, buttonText: { color: colors.surface, fontSize: fontSize.md, fontWeight: '800' }, buttonPressed: { opacity: 0.96 }, disabled: { opacity: 0.46 },
  outlineButton: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center', marginTop: spacing.md }, outlineText: { color: uiColors.brand, fontWeight: '700', fontSize: fontSize.md },
  sectionCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border, shadowColor: uiColors.dark, shadowOpacity: 0.035, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  stickyActionFooter: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.lg },
  notice: { borderWidth: 1, borderColor: colors.border, backgroundColor: uiColors.softBlue, borderRadius: radius.md, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md }, dangerNotice: { borderColor: uiColors.error, backgroundColor: uiColors.softDanger }, successNotice: { borderColor: uiColors.success, backgroundColor: uiColors.softSuccess }, noticeText: { color: colors.textSecondary, fontSize: fontSize.md, lineHeight: 23, flex: 1 }, secondary: { color: colors.textSecondary, fontSize: fontSize.md, lineHeight: 24 },
  actionMotionPrimary: { width: '100%' }, actionMotionSecondary: { flex: 1, minWidth: 0 }, quickCard: { overflow: 'hidden', borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', alignItems: 'center' }, quickCardPrimary: { minHeight: 136, padding: spacing.xl, backgroundColor: uiColors.brand, borderColor: uiColors.brand, marginBottom: spacing.md }, quickCardSecondary: { minHeight: 154, flex: 1, padding: spacing.lg, backgroundColor: colors.surface, borderColor: colors.border, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }, quickPressed: { opacity: 0.96 }, quickDecor: { position: 'absolute', right: -28, top: -36, width: 132, height: 132, borderRadius: 70, backgroundColor: uiColors.accent, opacity: 0.14 }, quickIcon: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: uiColors.softCyan, marginBottom: spacing.md }, quickIconPrimary: { backgroundColor: 'rgba(255,255,255,0.16)', marginBottom: 0, marginRight: spacing.lg }, quickCopy: { flex: 1, minWidth: 0 }, quickTitle: { color: colors.textPrimary, fontSize: 18, lineHeight: 22, fontWeight: '800', flexShrink: 1 }, quickTitlePrimary: { color: colors.surface, fontSize: 21, lineHeight: 26 }, quickSubtitle: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 19, marginTop: spacing.xs, flexShrink: 1 }, quickSubtitlePrimary: { color: uiColors.softCyan, fontSize: fontSize.md, lineHeight: 21, maxWidth: 188 },
  inputWrap: { marginBottom: spacing.lg }, inputLabel: { color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: '800', marginBottom: spacing.sm }, inputBox: { minHeight: 54, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md }, inputError: { borderColor: uiColors.error }, inputIcon: { width: 24, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm }, input: { flex: 1, color: colors.textPrimary, fontSize: fontSize.md, paddingVertical: spacing.md }, placeholder: { color: colors.textSecondary }, errorText: { color: uiColors.error, fontSize: fontSize.sm, marginTop: spacing.xs },
  selectBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: uiColors.overlay }, selectSheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl, paddingBottom: spacing['3xl'] }, selectOption: { minHeight: 52, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.border }, selectOptionSelected: { backgroundColor: uiColors.softBlue, marginHorizontal: -spacing.md, paddingHorizontal: spacing.md, borderRadius: radius.sm }, selectOptionText: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '600' }, selectOptionTextSelected: { color: uiColors.brand, fontWeight: '800' },
  progressRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }, progressSegment: { flex: 1, height: 7, borderRadius: 4, backgroundColor: uiColors.softBlue }, progressActive: { backgroundColor: uiColors.success },
  documentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md }, documentIcon: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: uiColors.softCyan, alignItems: 'center', justifyContent: 'center' }, documentThumbnail: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: uiColors.softBlue }, capturedIcon: { backgroundColor: uiColors.softSuccess }, documentCopy: { flex: 1, paddingHorizontal: spacing.md }, documentTitle: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '800', marginBottom: spacing.xs },
  signaturePad: { minHeight: 150, borderWidth: 1, borderColor: uiColors.accent, borderStyle: 'dashed', borderRadius: radius.md, justifyContent: 'center', alignItems: 'center', backgroundColor: uiColors.softCyan, marginBottom: spacing.lg }, signatureTitle: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '800' }, signatureLine: { color: colors.textSecondary, marginTop: spacing.sm },
  empty: { alignItems: 'center', paddingVertical: spacing['3xl'] }, emptyTitle: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '800', marginBottom: spacing.sm }, statusBadge: { alignSelf: 'flex-start', marginTop: spacing.md, backgroundColor: uiColors.softSuccess, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs }, statusText: { color: uiColors.dark, fontWeight: '800', fontSize: fontSize.sm },
});
