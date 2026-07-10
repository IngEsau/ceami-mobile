import * as ImagePicker from 'expo-image-picker';
import { RequiredDocumentType } from '../../applications/domain/application.types';
import { DocumentCaptureSource } from '../domain/document-capture.port';

/**
 * Expo adapter for the MVP. A deterministic mock URI is returned when the gallery
 * permission is unavailable so the guided demo is never blocked by device setup.
 */
export class ExpoImagePickerDocumentSource implements DocumentCaptureSource {
  async selectImage(type: RequiredDocumentType): Promise<string | null> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return `mock://${type}-${Date.now()}`;

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    return result.canceled ? null : result.assets[0]?.uri ?? null;
  }
}
