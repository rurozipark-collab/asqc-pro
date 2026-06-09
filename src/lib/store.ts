'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Finding, Complaint, RCA, CAPA, Audit, Document, CustomerExperience, ChatMessage } from '@/types';
import type { Locale } from '@/lib/i18n/translations';
import type { SyncEntity } from '@/lib/supabase/config';
import type { SyncPayload } from '@/lib/supabase/data-service';
import { remoteDelete, remotePushAll, remoteUpsert, type SyncStatus } from '@/lib/supabase/client-sync';
import { emptySyncPayload, mergeSyncPayload } from '@/lib/supabase/merge';
import {
  mockFindings,
  mockComplaints,
  mockRCAs,
  mockCAPAs,
  mockAudits,
  mockDocuments,
  mockCX,
} from '@/lib/data/mock-data';

const STORE_VERSION = 3;

type SyncTask = () => Promise<void>;
const pendingSyncTasks: SyncTask[] = [];
let flushingQueue = false;

async function flushPendingSync(
  getStatus: () => SyncStatus,
  setStatus: (s: SyncStatus) => void,
) {
  if (flushingQueue || pendingSyncTasks.length === 0) return;
  const status = getStatus();
  if (status === 'local' || status === 'offline') return;

  flushingQueue = true;
  while (pendingSyncTasks.length > 0) {
    const task = pendingSyncTasks.shift();
    if (!task) break;
    try {
      await task();
      setStatus('synced');
    } catch {
      setStatus('error');
      break;
    }
  }
  flushingQueue = false;
}

function syncToCloud(
  getStatus: () => SyncStatus,
  setStatus: (s: SyncStatus) => void,
  task: SyncTask,
) {
  const status = getStatus();
  if (status === 'local' || status === 'offline') return;

  if (status === 'syncing') {
    pendingSyncTasks.push(task);
    return;
  }

  pendingSyncTasks.push(task);
  void flushPendingSync(getStatus, setStatus);
}

function getPayload(state: AppState): SyncPayload {
  return {
    findings: state.findings,
    complaints: state.complaints,
    rcas: state.rcas,
    capas: state.capas,
    audits: state.audits,
    customerExperiences: state.customerExperiences,
    documents: state.documents,
  };
}

interface AppState {
  storeVersion: number;
  locale: Locale;
  syncStatus: SyncStatus;
  findings: Finding[];
  complaints: Complaint[];
  rcas: RCA[];
  capas: CAPA[];
  audits: Audit[];
  documents: Document[];
  customerExperiences: CustomerExperience[];
  chatMessages: ChatMessage[];
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  setLocale: (locale: Locale) => void;
  setSyncStatus: (status: SyncStatus) => void;
  hydrateFromCloud: (data: SyncPayload) => void;
  bootstrapFromCloud: () => Promise<void>;
  pushLocalToCloud: () => Promise<void>;
  refreshFromCloud: () => Promise<void>;
  addFinding: (finding: Finding) => void;
  addComplaint: (complaint: Complaint) => void;
  addRCA: (rca: RCA) => void;
  addCAPA: (capa: CAPA) => void;
  addAudit: (audit: Audit) => void;
  addDocument: (document: Document) => void;
  updateFinding: (id: string, data: Partial<Finding>) => void;
  updateCAPA: (id: string, data: Partial<CAPA>) => void;
  deleteFinding: (id: string) => void;
  deleteComplaint: (id: string) => void;
  deleteRCA: (id: string) => void;
  deleteCAPA: (id: string) => void;
  deleteAudit: (id: string) => void;
  deleteDocument: (id: string) => void;
  addCustomerExperience: (record: CustomerExperience) => void;
  deleteCustomerExperience: (id: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  loadDemoData: () => void;
  clearAllData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      storeVersion: STORE_VERSION,
      locale: 'id',
      syncStatus: 'local',
      findings: [],
      complaints: [],
      rcas: [],
      capas: [],
      audits: [],
      documents: [],
      customerExperiences: [],
      chatMessages: [
        {
          id: '0',
          role: 'assistant',
          content: 'Selamat datang di ASQC PRO AI Assistant. Saya dapat membantu Anda dengan analisis temuan, pembuatan RCA, laporan eksekutif, dan rekomendasi perbaikan layanan. Apa yang ingin Anda kerjakan hari ini?',
          timestamp: new Date().toISOString(),
        },
      ],
      sidebarOpen: true,
      mobileSidebarOpen: false,
      setLocale: (locale) => set({ locale }),
      setSyncStatus: (syncStatus) => set({ syncStatus }),
      hydrateFromCloud: (data) =>
        set({
          findings: data.findings,
          complaints: data.complaints,
          rcas: data.rcas,
          capas: data.capas,
          audits: data.audits,
          customerExperiences: data.customerExperiences,
          documents: data.documents,
        }),
      bootstrapFromCloud: async () => {
        set({ syncStatus: 'syncing' });
        try {
          const res = await fetch('/api/sync');
          const json = await res.json();

          if (!json.configured) {
            set({ syncStatus: 'local' });
            return;
          }
          if (json.error) {
            set({ syncStatus: 'error' });
            return;
          }

          const cloud = json.data ?? emptySyncPayload();
          const merged = mergeSyncPayload(getPayload(get()), cloud);
          get().hydrateFromCloud(merged);

          const hasLocalOnly = <T extends { id: string }>(mergedRows: T[], cloudRows: T[]) => {
            const cloudIds = new Set(cloudRows.map((row) => row.id));
            return mergedRows.some((row) => !cloudIds.has(row.id));
          };

          const needsPush =
            hasLocalOnly(merged.findings, cloud.findings) ||
            hasLocalOnly(merged.complaints, cloud.complaints) ||
            hasLocalOnly(merged.rcas, cloud.rcas) ||
            hasLocalOnly(merged.capas, cloud.capas) ||
            hasLocalOnly(merged.audits, cloud.audits) ||
            hasLocalOnly(merged.customerExperiences, cloud.customerExperiences) ||
            hasLocalOnly(merged.documents, cloud.documents);

          if (needsPush) await remotePushAll(merged);

          set({ syncStatus: 'synced' });
          await flushPendingSync(() => get().syncStatus, (syncStatus) => set({ syncStatus }));
        } catch {
          set({ syncStatus: 'offline' });
        }
      },
      pushLocalToCloud: async () => {
        set({ syncStatus: 'syncing' });
        try {
          await remotePushAll(getPayload(get()));
          set({ syncStatus: 'synced' });
        } catch {
          set({ syncStatus: 'error' });
        }
      },
      refreshFromCloud: async () => {
        set({ syncStatus: 'syncing' });
        try {
          const res = await fetch('/api/sync');
          const json = await res.json();
          if (!json.configured) {
            set({ syncStatus: 'local' });
            return;
          }
          if (json.error) {
            set({ syncStatus: 'error' });
            return;
          }
          const merged = mergeSyncPayload(getPayload(get()), json.data ?? emptySyncPayload());
          get().hydrateFromCloud(merged);
          set({ syncStatus: 'synced' });
          await flushPendingSync(() => get().syncStatus, (syncStatus) => set({ syncStatus }));
        } catch {
          set({ syncStatus: 'offline' });
        }
      },
      addFinding: (finding) => {
        set((s) => ({ findings: [finding, ...s.findings] }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteUpsert('findings', finding),
        );
      },
      addComplaint: (complaint) => {
        set((s) => ({ complaints: [complaint, ...s.complaints] }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteUpsert('complaints', complaint),
        );
      },
      addRCA: (rca) => {
        set((s) => ({ rcas: [rca, ...s.rcas] }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteUpsert('rcas', rca),
        );
      },
      addCAPA: (capa) => {
        set((s) => ({ capas: [capa, ...s.capas] }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteUpsert('capas', capa),
        );
      },
      addAudit: (audit) => {
        set((s) => ({ audits: [audit, ...s.audits] }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteUpsert('audits', audit),
        );
      },
      addDocument: (document) => {
        set((s) => ({ documents: [document, ...s.documents] }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteUpsert('documents', document),
        );
      },
      updateFinding: (id, data) => {
        let updated: Finding | undefined;
        set((s) => ({
          findings: s.findings.map((f) => {
            if (f.id === id) {
              updated = { ...f, ...data };
              return updated;
            }
            return f;
          }),
        }));
        if (updated) {
          syncToCloud(
            () => get().syncStatus,
            (syncStatus) => set({ syncStatus }),
            () => remoteUpsert('findings', updated!),
          );
        }
      },
      updateCAPA: (id, data) => {
        let updated: CAPA | undefined;
        set((s) => ({
          capas: s.capas.map((c) => {
            if (c.id === id) {
              updated = { ...c, ...data };
              return updated;
            }
            return c;
          }),
        }));
        if (updated) {
          syncToCloud(
            () => get().syncStatus,
            (syncStatus) => set({ syncStatus }),
            () => remoteUpsert('capas', updated!),
          );
        }
      },
      deleteFinding: (id) => {
        set((s) => ({ findings: s.findings.filter((f) => f.id !== id) }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteDelete('findings', id),
        );
      },
      deleteComplaint: (id) => {
        set((s) => ({ complaints: s.complaints.filter((c) => c.id !== id) }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteDelete('complaints', id),
        );
      },
      deleteRCA: (id) => {
        set((s) => ({ rcas: s.rcas.filter((r) => r.id !== id) }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteDelete('rcas', id),
        );
      },
      deleteCAPA: (id) => {
        set((s) => ({ capas: s.capas.filter((c) => c.id !== id) }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteDelete('capas', id),
        );
      },
      deleteAudit: (id) => {
        set((s) => ({ audits: s.audits.filter((a) => a.id !== id) }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteDelete('audits', id),
        );
      },
      deleteDocument: (id) => {
        set((s) => ({ documents: s.documents.filter((d) => d.id !== id) }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteDelete('documents', id),
        );
      },
      addCustomerExperience: (record) => {
        set((s) => ({ customerExperiences: [record, ...s.customerExperiences] }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteUpsert('customerExperiences', record),
        );
      },
      deleteCustomerExperience: (id) => {
        set((s) => ({ customerExperiences: s.customerExperiences.filter((c) => c.id !== id) }));
        syncToCloud(
          () => get().syncStatus,
          (syncStatus) => set({ syncStatus }),
          () => remoteDelete('customerExperiences', id),
        );
      },
      addChatMessage: (message) =>
        set((s) => ({ chatMessages: [...s.chatMessages, message] })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      loadDemoData: () => {
        set({
          storeVersion: STORE_VERSION,
          findings: mockFindings,
          complaints: mockComplaints,
          rcas: mockRCAs,
          capas: mockCAPAs,
          audits: mockAudits,
          documents: mockDocuments,
          customerExperiences: mockCX,
        });
        const status = get().syncStatus;
        if (status === 'synced' || status === 'error') {
          get().pushLocalToCloud();
        }
      },
      clearAllData: () =>
        set({
          findings: [],
          complaints: [],
          rcas: [],
          capas: [],
          audits: [],
          documents: [],
          customerExperiences: [],
        }),
    }),
    {
      name: 'asqc-pro-store',
      version: STORE_VERSION,
      migrate: (persisted, version) => {
        const state = persisted as Partial<AppState>;
        if (!version || version < STORE_VERSION) {
          return {
            ...state,
            storeVersion: STORE_VERSION,
            syncStatus: state.syncStatus ?? 'local',
            findings: state.findings ?? [],
            complaints: state.complaints ?? [],
            rcas: state.rcas ?? [],
            capas: state.capas ?? [],
            audits: state.audits ?? [],
            documents: state.documents ?? [],
            customerExperiences: state.customerExperiences ?? [],
          } as AppState;
        }
        return state as AppState;
      },
      partialize: (state) => ({
        storeVersion: state.storeVersion,
        locale: state.locale,
        findings: state.findings,
        complaints: state.complaints,
        rcas: state.rcas,
        capas: state.capas,
        audits: state.audits,
        documents: state.documents,
        customerExperiences: state.customerExperiences,
      }),
    },
  ),
);