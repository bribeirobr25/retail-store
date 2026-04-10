import { render, type RenderOptions } from '@testing-library/react';
import { I18nProvider } from '../i18n';
import type { ReactElement } from 'react';

export function renderWithI18n(ui: ReactElement, options?: RenderOptions) {
  return render(ui, {
    wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>,
    ...options,
  });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
