import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { AppIcon, AppScreen, PrimaryButton } from '../../../shared/ui';
import { colors, radius, spacing } from '../../../shared/theme';
import { CaptureTarget, TemporaryPhoto, captureConfig } from '../domain/photo-capture.types';
import { PhotoPreview } from './PhotoPreview';
import { usePhotoCapture } from './usePhotoCapture';
import { useApplicationStore } from '../../applications/application/application.store';
import { RequiredDocumentType } from '../../applications/domain/application.types';
import { useVisitStore } from '../../visits/application/visit.store';

type Props = NativeStackScreenProps<RootStackParamList, 'CameraCapture'>;
const applicationTargets: RequiredDocumentType[] = ['ine_front', 'ine_back', 'selfie'];
const isApplicationTarget = (target: CaptureTarget): target is RequiredDocumentType => applicationTargets.includes(target as RequiredDocumentType);

export const CameraCaptureScreen = ({ navigation, route }: Props) => {
  const { target, owner, returnTo } = route.params;
  const config = captureConfig[target];
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [facing, setFacing] = useState<'front' | 'back'>(config.facing);
  const [preview, setPreview] = useState<TemporaryPhoto | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const capture = usePhotoCapture();
  const saveApplicationDocument = useApplicationStore((state) => state.captureDocument);
  const saveVisitPhoto = useVisitStore((state) => state.savePhoto);

  useEffect(() => { setFacing(config.facing); setReady(false); setPreview(null); }, [config.facing, target]);

  const takePhoto = async () => {
    if (!cameraRef.current || !ready || processing) return;
    setCameraError(null);
    setProcessing(true);
    try {
      const picture = await cameraRef.current.takePictureAsync({ quality: 0.8, exif: false, skipProcessing: false });
      if (picture?.uri) setPreview({ uri: picture.uri, width: picture.width, height: picture.height });
    } catch {
      setCameraError('No fue posible tomar la fotografía. Intenta nuevamente.');
    } finally { setProcessing(false); }
  };

  const chooseGallery = async () => {
    setCameraError(null);
    try {
      const photo = await capture.pickFromGallery(target);
      if (photo) setPreview(photo);
    } catch {
      setCameraError('No fue posible abrir la galería. Intenta tomar la foto con la cámara.');
    }
  };

  const retake = async () => {
    if (preview) await capture.discard(preview.uri);
    setPreview(null);
    setReady(false);
    setCameraError(null);
  };

  const cancelPreview = async () => {
    if (preview) await capture.discard(preview.uri);
    navigation.goBack();
  };

  const confirmPhoto = async () => {
    if (!preview || processing) return;
    setProcessing(true);
    try {
      const photo = await capture.persist(target, preview);
      if (owner === 'application' && isApplicationTarget(target)) await saveApplicationDocument(target, photo.uri);
      if (owner === 'visit') await saveVisitPhoto(photo);
      navigation.replace(returnTo);
    } catch {
      setCameraError('No fue posible guardar la fotografía. Verifica el espacio disponible e intenta nuevamente.');
    } finally { setProcessing(false); }
  };

  if (!permission) return <AppScreen scroll={false}><View style={styles.permission}><ActivityIndicator color={colors.brandBlue} /></View></AppScreen>;
  if (!permission.granted) return <AppScreen><View style={styles.permission}><View style={styles.permissionIcon}><AppIcon name="camera" size={32} color={colors.brandBlue} /></View><Text style={styles.permissionTitle}>Permiso de cámara requerido</Text><Text style={styles.permissionBody}>{permission.canAskAgain ? 'CEAMI necesita acceso a la cámara para capturar la identificación, la selfie y la evidencia de la visita.' : 'El permiso fue rechazado. Abre los ajustes del dispositivo para habilitar la cámara y continuar.'}</Text><PrimaryButton label={permission.canAskAgain ? 'Permitir cámara' : 'Abrir ajustes'} onPress={() => void (permission.canAskAgain ? requestPermission() : Linking.openSettings())} /><Pressable accessibilityRole="button" accessibilityLabel="Volver" style={styles.permissionBack} onPress={() => navigation.goBack()}><Text style={styles.permissionBackText}>Volver</Text></Pressable></View></AppScreen>;
  if (preview) return <SafeAreaView style={styles.fullscreen}><PhotoPreview photo={preview} error={cameraError} loading={processing} onRetake={() => void retake()} onUsePhoto={() => void confirmPhoto()} onChooseGallery={() => void chooseGallery()} onCancel={() => void cancelPreview()} /></SafeAreaView>;

  return <SafeAreaView style={styles.fullscreen}>{isFocused && <CameraView ref={cameraRef} style={styles.camera} facing={facing} flash={torchEnabled ? 'on' : 'off'} enableTorch={torchEnabled} active={isFocused} onCameraReady={() => setReady(true)} onMountError={() => setCameraError('La cámara no pudo iniciar. Revisa el permiso e intenta nuevamente.')} />}<View style={styles.overlay}><View style={styles.floatingHeader}><Pressable accessibilityRole="button" accessibilityLabel="Volver" style={styles.roundButton} onPress={() => navigation.goBack()}><AppIcon name="arrow-left" size={24} color={colors.surface} /></Pressable><View style={styles.headerCopy}><Text style={styles.captureTitle}>{config.title}</Text><Text style={styles.captureDescription}>{config.description}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={torchEnabled ? 'Apagar flash' : 'Encender flash'} style={styles.roundButton} onPress={() => setTorchEnabled((value) => !value)}><AppIcon name={torchEnabled ? 'flashlight-off' : 'flashlight'} size={22} color={colors.surface} /></Pressable></View><View style={styles.guideArea}>{config.overlay !== 'none' && <View style={[styles.captureGuide, config.overlay === 'face' && styles.faceGuide]} />}</View>{cameraError && <View style={styles.error}><Text style={styles.errorText}>{cameraError}</Text></View>}<View style={styles.controls}>{target === 'selfie' && <Pressable accessibilityRole="button" accessibilityLabel="Cambiar cámara" style={styles.controlButton} onPress={() => { setReady(false); setFacing((value) => value === 'front' ? 'back' : 'front'); }}><AppIcon name="camera-switch" size={24} color={colors.surface} /></Pressable>}<Pressable accessibilityRole="button" accessibilityLabel="Tomar foto" disabled={!ready || processing} onPress={() => void takePhoto()} style={[styles.shutter, (!ready || processing) && styles.shutterDisabled]}>{processing ? <ActivityIndicator color={colors.brandBlue} /> : <View style={styles.shutterInner} />}</Pressable><Pressable accessibilityRole="button" accessibilityLabel="Seleccionar de galería" style={styles.controlButton} onPress={() => void chooseGallery()}><AppIcon name="image-plus" size={24} color={colors.surface} /></Pressable></View></View></SafeAreaView>;
};

const styles = StyleSheet.create({ fullscreen: { flex: 1, backgroundColor: colors.blueDark }, camera: { ...StyleSheet.absoluteFillObject }, overlay: { flex: 1, justifyContent: 'space-between', padding: spacing.lg, backgroundColor: 'rgba(3,60,104,0.14)' }, floatingHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }, roundButton: { width: 46, height: 46, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(16,43,60,0.5)' }, headerCopy: { flex: 1, paddingTop: spacing.xs }, captureTitle: { color: colors.surface, fontSize: 18, fontWeight: '800' }, captureDescription: { color: colors.cyanSoft, fontSize: 14, lineHeight: 19, marginTop: spacing.xs }, guideArea: { flex: 1, justifyContent: 'center', alignItems: 'center' }, captureGuide: { width: '86%', aspectRatio: 1.58, borderWidth: 2, borderColor: colors.surface, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.05)' }, faceGuide: { width: 220, aspectRatio: 0.82, borderRadius: radius.pill }, controls: { minHeight: 92, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl }, controlButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }, shutter: { width: 76, height: 76, borderRadius: radius.pill, padding: 6, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }, shutterDisabled: { opacity: 0.5 }, shutterInner: { width: 60, height: 60, borderRadius: radius.pill, backgroundColor: colors.brandCyan }, error: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginHorizontal: spacing.xl }, errorText: { color: colors.error, textAlign: 'center', fontWeight: '700' }, permission: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing['2xl'] }, permissionIcon: { width: 64, height: 64, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cyanSoft, marginBottom: spacing.lg }, permissionTitle: { color: colors.textPrimary, fontSize: 23, fontWeight: '800', textAlign: 'center' }, permissionBody: { color: colors.textSecondary, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: spacing.md }, permissionBack: { marginTop: spacing.lg, minHeight: 44, justifyContent: 'center' }, permissionBackText: { color: colors.brandBlue, fontWeight: '800' } });
