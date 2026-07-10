import { create } from 'zustand';

export type MockUser = { id: string; email: string; firstName: string; company: string };
type AuthState = { user?: MockUser; login: (email: string) => void; logout: () => void };
export const useAuthStore = create<AuthState>((set) => ({ user: undefined, login: (email) => set({ user: { id: 'mock-user-1', email, firstName: 'Alejandra', company: 'CEAMI Grupo Multiservicios' } }), logout: () => set({ user: undefined }) }));
