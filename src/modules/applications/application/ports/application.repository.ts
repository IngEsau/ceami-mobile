import { CreditApplication } from '../../domain/application.types';

export interface ApplicationRepository { createDraft(): Promise<CreditApplication>; save(application: CreditApplication): Promise<void>; findAll(): Promise<CreditApplication[]>; findById(id: string): Promise<CreditApplication | null>; }
