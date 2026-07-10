import { ApplicationStatus, CreditApplication } from '../../domain/application.types';

export type ApplicationDto = { id: string; folio: string; status: ApplicationStatus; applicant_name?: string; created_at: string; updated_at: string; documents: Array<{ type: string; status: string; uri?: string }>; payload?: Record<string, unknown> };
export type ApplicationApiClient = { createApplication(payload: unknown): Promise<ApplicationDto>; updateApplication(id: string, payload: unknown): Promise<ApplicationDto>; getApplications(): Promise<ApplicationDto[]>; getApplication(id: string): Promise<ApplicationDto>; };
export type ApplicationMapper = { toApplicationDto(application: CreditApplication): ApplicationDto; fromApplicationDto(dto: ApplicationDto): CreditApplication };
