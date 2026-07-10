import AsyncStorage from '@react-native-async-storage/async-storage';
import { VisitRepository } from '../../application/ports/visit.repository';
import { VisitDraft } from '../../domain/visit.types';

const STORAGE_KEY = '@ceami/visits';

export class LocalVisitRepository implements VisitRepository {
  async findAll(): Promise<VisitDraft[]> { const raw = await AsyncStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) as VisitDraft[] : []; }
  async findById(id: string): Promise<VisitDraft | null> { return (await this.findAll()).find((visit) => visit.id === id) ?? null; }
  async save(visit: VisitDraft) { const all = await this.findAll(); const next = all.some((item) => item.id === visit.id) ? all.map((item) => item.id === visit.id ? visit : item) : [visit, ...all]; await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
  async createDraft(): Promise<VisitDraft> { const all = await this.findAll(); const sequence = all.reduce((max, item) => Math.max(max, Number(item.folio.replace('VIS-', '')) || 0), 0) + 1; const now = new Date().toISOString(); const visit: VisitDraft = { id: `visit-${Date.now()}`, folio: `VIS-${String(sequence).padStart(6, '0')}`, status: 'draft', createdAt: now, updatedAt: now, clientDocuments: {}, housingPhotos: {} }; await this.save(visit); return visit; }
}
