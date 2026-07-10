import { VisitDraft } from '../../domain/visit.types';

export interface VisitRepository {
  createDraft(): Promise<VisitDraft>;
  save(visit: VisitDraft): Promise<void>;
  findById(id: string): Promise<VisitDraft | null>;
  findAll(): Promise<VisitDraft[]>;
}
