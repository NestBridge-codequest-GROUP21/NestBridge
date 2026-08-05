import React, { useEffect, useState } from 'react';
import AppAlertModal, {
  type AppAlertPayload,
} from '../components/AppAlertModal';
import { registerAppAlertListener } from '../utils/appAlert';

/**
 * Hosts the branded NestBridge dialog. Mount once near the app root
 * (inside ThemeProvider) so `appAlert()` works from any screen or service.
 */
export function AppAlertProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<AppAlertPayload | null>(null);

  // Register during render (not useEffect) so child mount effects never hit a
  // null listener and fall through to a system dialog.
  registerAppAlertListener(setPayload);

  useEffect(() => {
    registerAppAlertListener(setPayload);
    return () => registerAppAlertListener(null);
  }, []);

  return (
    <>
      {children}
      <AppAlertModal
        visible={payload != null}
        title={payload?.title ?? ''}
        message={payload?.message}
        buttons={payload?.buttons}
        options={payload?.options}
        onRequestClose={() => {
          setPayload(null);
        }}
      />
    </>
  );
}
