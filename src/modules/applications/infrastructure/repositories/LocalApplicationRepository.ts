import AsyncStorage from '@react-native-async-storage/async-storage';
import { emptyDocuments, CreditApplication } from '../../domain/application.types';
import { ApplicationRepository } from '../../application/ports/application.repository';

const STORAGE_KEY = '@ceami/applications';
const now = () => new Date().toISOString();

export class LocalApplicationRepository implements ApplicationRepository {
  async findAll(): Promise<CreditApplication[]> { const raw = await AsyncStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) as CreditApplication[] : []; }
  async save(application: CreditApplication) { const all = await this.findAll(); const next = all.some((item) => item.id === application.id) ? all.map((item) => item.id === application.id ? application : item) : [application, ...all]; await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
  async findById(id: string) { return (await this.findAll()).find((application) => application.id === id) ?? null; }
  async createDraft() { const all = await this.findAll(); const sequence = all.reduce((max, item) => Math.max(max, Number(item.folio.replace('SOL-', '')) || 0), 0) + 1; const timestamp = now(); const application: CreditApplication = { id: `app-${Date.now()}`, folio: `SOL-${String(sequence).padStart(6, '0')}`, status: 'draft', createdAt: timestamp, updatedAt: timestamp, documents: emptyDocuments(), signature: { status: 'pending' } }; await this.save(application); return application; }
}
