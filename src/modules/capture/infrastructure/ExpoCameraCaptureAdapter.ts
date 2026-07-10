import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { CameraCapturePort } from '../domain/photo-capture.port';
import { CaptureTarget, CapturedPhoto, TemporaryPhoto } from '../domain/photo-capture.types';

const extensionFrom = (uri: string) => uri.match(/\.(jpe?g|png|webp)(?:\?.*)?$/i)?.[1]?.toLowerCase() ?? 'jpg';

/** Persists confirmed photos outside cache and exposes gallery only as a secondary fallback. */
export class ExpoCameraCaptureAdapter implements CameraCapturePort {
  async persist(target: CaptureTarget, temporary: TemporaryPhoto): Promise<CapturedPhoto> {
    const root = FileSystem.documentDirectory;
    const capturedAt = new Date().toISOString();
    if (!root) return { target, uri: temporary.uri, status: 'captured', capturedAt, width: temporary.width, height: temporary.height };

    const directory = `${root}ceami-captures/`;
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    const destination = `${directory}${target}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFrom(temporary.uri)}`;
    await FileSystem.copyAsync({ from: temporary.uri, to: destination });
    return { target, uri: destination, status: 'captured', capturedAt, width: temporary.width, height: temporary.height };
  }

  async discard(temporaryUri: string): Promise<void> {
    if (temporaryUri.startsWith('file://')) await FileSystem.deleteAsync(temporaryUri, { idempotent: true });
  }

  async pickFromGallery(_target: CaptureTarget): Promise<TemporaryPhoto | null> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return null;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled || !result.assets[0]) return null;
    const asset = result.assets[0];
    return { uri: asset.uri, width: asset.width, height: asset.height };
  }
}
