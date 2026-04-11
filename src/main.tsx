import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from './i18n';
import { ErrorBoundary } from './shared/ErrorBoundary';
import { usePlanStore } from './domains/plan/planStore';
// MVP-SHARE-URL: hydrate the plan store from the share URL if one is
// present. Phase 1 cloud sharing replaces this entire block — see
// docs/FUTURE_VISION.md → Phase 1 → MVP Cleanup Tasks.
import { decodePlanStateFromUrl } from './domains/sharing/encodeShareUrl';
import App from './App.tsx';
import './index.css';

// Apply shared state BEFORE the first render so the user never sees a flash
// of template defaults. The decoder returns null if there's no share data
// or if the payload fails Zod validation, in which case we fall through to
// whatever sessionStorage / defaults the store would normally use.
const sharedState = decodePlanStateFromUrl(window.location.href);
if (sharedState) {
  usePlanStore.setState(sharedState);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ErrorBoundary>
  </StrictMode>,
);
