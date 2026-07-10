import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TemporaryPhoto } from '../domain/photo-capture.types';
import { AppIcon, OutlineButton, PrimaryButton } from '../../../shared/ui';
import { colors, radius, spacing } from '../../../shared/theme';

type Props = { photo: TemporaryPhoto; onRetake: () => void; onUsePhoto: () => void; onChooseGallery: () => void; onCancel: () => void; loading?: boolean; error?: string | null };

export const PhotoPreview = ({ photo, onRetake, onUsePhoto, onChooseGallery, onCancel, loading, error }: Props) => <View style={styles.container}><Image source={{ uri: photo.uri }} style={styles.image} resizeMode="cover" /><View style={styles.actions}>{error && <Text style={styles.error}>{error}</Text>}<PrimaryButton label="Usar foto" icon={<AppIcon name="check" size={20} color={colors.surface} />} loading={loading} onPress={onUsePhoto} /><OutlineButton label="Repetir foto" onPress={onRetake} /><OutlineButton label="Seleccionar de galería" onPress={onChooseGallery} /><OutlineButton label="Cancelar" onPress={onCancel} /></View></View>;

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background }, image: { flex: 1, width: '100%', backgroundColor: colors.blueDark }, actions: { padding: spacing.xl, backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl }, error: { color: colors.error, fontSize: 14, fontWeight: '700', lineHeight: 20, marginBottom: spacing.sm } });
