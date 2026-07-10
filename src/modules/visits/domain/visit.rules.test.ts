import { CapturedPhoto, CaptureTarget } from '../../capture/domain/photo-capture.types';
import { VisitDraft } from './visit.types';
import { VisitCompletionError, assertCanCompleteVisit, canCompleteVisit, hasRequiredHousingPhotos, hasRequiredVisitDocuments, visitHousingPhotosProgress } from './visit.rules';

const photo = (target: CaptureTarget): CapturedPhoto => ({ target, uri: `file:///captures/${target}.jpg`, status: 'captured', capturedAt: '2026-07-10T00:00:00.000Z' });
const baseVisit = (): VisitDraft => ({ id: 'visit-1', folio: 'VIS-000001', status: 'draft', createdAt: '', updatedAt: '', clientDocuments: {}, housingPhotos: {} });

describe('visit rules', () => {
  it('requires the three client documents before the visit can advance', () => {
    const visit = baseVisit();
    visit.clientDocuments.ineFront = photo('ine_front');
    visit.clientDocuments.ineBack = photo('ine_back');
    expect(hasRequiredVisitDocuments(visit)).toBe(false);
    visit.clientDocuments.selfie = photo('selfie');
    expect(hasRequiredVisitDocuments(visit)).toBe(true);
  });

  it('requires the front and two interiors, while the extra housing photo stays optional', () => {
    const visit = baseVisit();
    visit.housingPhotos.front = photo('house_front');
    visit.housingPhotos.interior1 = photo('house_interior_1');
    expect(hasRequiredHousingPhotos(visit)).toBe(false);
    visit.housingPhotos.interior2 = photo('house_interior_2');
    expect(hasRequiredHousingPhotos(visit)).toBe(true);
    expect(visitHousingPhotosProgress(visit)).toBe(3);
    visit.housingPhotos.extra = photo('house_extra');
    expect(visitHousingPhotosProgress(visit)).toBe(4);
  });

  it('refuses finalization without a signature even with documents, photos and wizard data', () => {
    const visit = baseVisit();
    visit.clientDocuments = { ineFront: photo('ine_front'), ineBack: photo('ine_back'), selfie: photo('selfie') };
    visit.housingPhotos = { front: photo('house_front'), interior1: photo('house_interior_1'), interior2: photo('house_interior_2') };
    visit.generalData = { date: '10/07/2026', clientName: 'Alejandra Ruiz', curp: 'RUXA900101MDFXXX01', rfc: 'RUXA900101ABC', phoneType: 'mobile', phone: '5512345678', address: 'Calle Uno 1', housingType: 'owned', email: 'alejandra@ceami.mx', maritalStatus: 'single' };
    visit.familyData = {};
    visit.workData = { job: 'Comerciante', workAddress: 'Centro 10', seniority: '2 años', income: 12000, householdExpenses: 4000, ownsCar: false, bankDebt: 0 };
    visit.references = { reference1: { name: 'Ana', address: 'Calle Dos 2', phone: '5587654321' }, reference2: { name: 'Luis', address: 'Calle Tres 3', phone: '5567890123' } };

    expect(canCompleteVisit(visit)).toBe(false);
    expect(() => assertCanCompleteVisit(visit)).toThrow(VisitCompletionError);
  });
});
