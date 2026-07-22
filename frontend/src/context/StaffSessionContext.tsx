import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { PrimaryIntent } from '../types/accountProfile';
import { useAuth } from './AuthContext';
import { recordStaffAudit } from '../services/api';

export type StaffPreviewRole = PrimaryIntent;

export interface StaffPreviewState {
  role: StaffPreviewRole;
  enteredAt: string;
}

interface StaffSessionContextValue {
  /** Authenticated user has staff flag. */
  isStaff: boolean;
  /** Staff ops shell is active (staff and not previewing consumer app). */
  isStaffShell: boolean;
  /** Read-only consumer app preview for a role. */
  preview: StaffPreviewState | null;
  isPreviewLocked: boolean;
  enterAppPreview: (role: StaffPreviewRole) => Promise<void>;
  exitAppPreview: () => Promise<void>;
}

const StaffSessionContext = createContext<StaffSessionContextValue | undefined>(undefined);

export function StaffSessionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isStaff = Boolean(user?.isStaff);
  const [preview, setPreview] = useState<StaffPreviewState | null>(null);

  useEffect(() => {
    if (!isStaff) {
      setPreview(null);
    }
  }, [isStaff, user?.userId]);

  const enterAppPreview = useCallback(async (role: StaffPreviewRole) => {
    if (!isStaff) return;
    const next: StaffPreviewState = {
      role,
      enteredAt: new Date().toISOString(),
    };
    setPreview(next);
    try {
      await recordStaffAudit('PREVIEW_ENTER', role);
    } catch {
      // Preview still works offline; audit is best-effort.
    }
  }, [isStaff]);

  const exitAppPreview = useCallback(async () => {
    if (!preview) return;
    const role = preview.role;
    setPreview(null);
    try {
      await recordStaffAudit('PREVIEW_EXIT', role);
    } catch {
      // ignore
    }
  }, [preview]);

  const value = useMemo<StaffSessionContextValue>(
    () => ({
      isStaff,
      isStaffShell: isStaff && !preview,
      preview,
      isPreviewLocked: Boolean(isStaff && preview),
      enterAppPreview,
      exitAppPreview,
    }),
    [isStaff, preview, enterAppPreview, exitAppPreview],
  );

  return (
    <StaffSessionContext.Provider value={value}>{children}</StaffSessionContext.Provider>
  );
}

export function useStaffSession(): StaffSessionContextValue {
  const context = useContext(StaffSessionContext);
  if (!context) {
    throw new Error('useStaffSession must be used within StaffSessionProvider');
  }
  return context;
}
