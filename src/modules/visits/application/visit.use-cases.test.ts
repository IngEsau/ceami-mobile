import { CapturedPhoto, CaptureTarget } from '../../capture/domain/photo-capture.types';
import { VisitDraft } from '../domain/visit.types';
import { VisitRepository } from './ports/visit.repository';
import { createOrResumeVisitDraft, saveVisitFamilyData, saveVisitGeneralData, saveVisitPhoto, saveVisitReferences, saveVisitWorkData } from './visit.use-cases';

class MemoryVisitRepository implements VisitRepository {
  items: VisitDraft[] = [];

  async findAll() { return this.items; }
  async findById(id: string) { return this.items.find((item) => item.id === id) ?? null; }
  async createDraft() {
    const draft: VisitDraft = { id: `visit-${this.items.length + 1}`, folio: `VIS-${String(this.items.length + 1).padStart(6, '0')}`, status: 'draft', createdAt: '', updatedAt: '', clientDocuments: {}, housingPhotos: {} };
    this.items.unshift(draft);
    return draft;
  }
  async save(visit: VisitDraft) { this.items = this.items.map((item) => item.id === visit.id ? visit : item); }
}

const photo = (target: CaptureTarget): CapturedPhoto => ({ target, uri: `file:///captures/${target}.jpg`, status: 'captured', capturedAt: '2026-07-10T00:00:00.000Z' });

describe('visit use cases', () => {
  it('creates a persistent visit draft and resumes it while it is incomplete', async () => {
    const repository = new MemoryVisitRepository();
    const draft = await createOrResumeVisitDraft(repository);
    expect(draft.folio).toBe('VIS-000001');
    expect((await createOrResumeVisitDraft(repository)).id).toBe(draft.id);
  });

  it('does not advance past document validation when only housing evidence exists', async () => {
    const repository = new MemoryVisitRepository();
    const draft = await createOrResumeVisitDraft(repository);
    const updated = await saveVisitPhoto(repository, draft, photo('house_front'));
    expect(updated.status).toBe('documents_pending');
    expect(updated.housingPhotos.front?.uri).toBe('file:///captures/house_front.jpg');
  });

  it('retains prior wizard sections as later sections are saved', async () => {
    const repository = new MemoryVisitRepository();
    const draft = await createOrResumeVisitDraft(repository);
    const general = await saveVisitGeneralData(repository, draft, { date: '10/07/2026', clientName: 'Alejandra Ruiz', curp: 'RUXA900101MDFXXX01', rfc: 'RUXA900101ABC', phoneType: 'mobile', phone: '5512345678', address: 'Calle Uno 1', housingType: 'owned', email: 'alejandra@ceami.mx', maritalStatus: 'single' });
    const family = await saveVisitFamilyData(repository, general, { spouseName: 'Mario Ruiz', phone: '5587654321' });
    const work = await saveVisitWorkData(repository, family, { job: 'Comerciante', workAddress: 'Centro 10', seniority: '2 años', income: 12000, householdExpenses: 4000, ownsCar: false, bankDebt: 0 });
    const references = await saveVisitReferences(repository, work, { reference1: { name: 'Ana', address: 'Calle Dos 2', phone: '5587654321' }, reference2: { name: 'Luis', address: 'Calle Tres 3', phone: '5567890123' } });

    expect(references.generalData?.clientName).toBe('Alejandra Ruiz');
    expect(references.familyData?.spouseName).toBe('Mario Ruiz');
    expect(references.workData?.income).toBe(12000);
    expect(references.references?.reference2.name).toBe('Luis');
  });
});
