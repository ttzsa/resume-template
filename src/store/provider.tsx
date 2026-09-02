'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore } from 'zustand';
import type { StoreApi } from 'zustand/vanilla';
import type { Resume } from '@/src/schema/types';
import { createResumeStore, type ResumeStoreState } from '@/src/store/resume-store';

const ResumeStoreContext = createContext<StoreApi<ResumeStoreState> | null>(null);

export function ResumeStoreProvider({ initialResume, children }: { initialResume: Resume; children: ReactNode }) {
  const storeRef = useRef<StoreApi<ResumeStoreState> | null>(null);
  if (!storeRef.current) storeRef.current = createResumeStore(initialResume);
  return <ResumeStoreContext.Provider value={storeRef.current}>{children}</ResumeStoreContext.Provider>;
}

export function useResumeStore<T>(selector: (state: ResumeStoreState) => T): T {
  const store = useContext(ResumeStoreContext);
  if (!store) throw new Error('useResumeStore must be used inside ResumeStoreProvider');
  return useStore(store, selector);
}
