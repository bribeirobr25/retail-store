import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithI18n, screen, userEvent } from '../test/helpers';
import { useTranslation } from './index';

function ConsumerProbe() {
  const { lang, t, tArray, setLang, locale } = useTranslation();

  return (
    <div>
      <p data-testid="lang">{lang}</p>
      <p data-testid="locale">{locale}</p>
      <p data-testid="team-title">{t('sections.team')}</p>
      <p data-testid="breaks-title">{t('sections.breaks')}</p>
      <p data-testid="team-defaults-count">{tArray('defaults.team').length}</p>
      <p data-testid="missing-key">{t('does.not.exist')}</p>
      <button onClick={() => setLang('en')}>switch to en</button>
      <button onClick={() => setLang('de')}>switch to de</button>
    </div>
  );
}

describe('I18nProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('defaults to German', () => {
    renderWithI18n(<ConsumerProbe />);

    expect(screen.getByTestId('lang').textContent).toBe('de');
    expect(screen.getByTestId('locale').textContent).toBe('de-DE');
  });

  it('returns German section titles by default', () => {
    renderWithI18n(<ConsumerProbe />);

    expect(screen.getByTestId('breaks-title').textContent).toBe('Pausen');
  });

  it('returns the same value for keys that match in both languages', () => {
    renderWithI18n(<ConsumerProbe />);

    expect(screen.getByTestId('team-title').textContent).toBe('Team');
  });

  it('exposes default content arrays via tArray', () => {
    renderWithI18n(<ConsumerProbe />);

    // After the recent product change, defaults arrays only contain 1 entry
    expect(screen.getByTestId('team-defaults-count').textContent).toBe('1');
  });

  it('returns the key itself when a translation is missing', () => {
    renderWithI18n(<ConsumerProbe />);

    expect(screen.getByTestId('missing-key').textContent).toBe('does.not.exist');
  });

  it('switches to English without reloading the page', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ConsumerProbe />);

    await user.click(screen.getByText('switch to en'));

    expect(screen.getByTestId('lang').textContent).toBe('en');
    expect(screen.getByTestId('locale').textContent).toBe('en-US');
    expect(screen.getByTestId('breaks-title').textContent).toBe('Breaks');
  });

  it('persists the chosen language in localStorage', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ConsumerProbe />);

    await user.click(screen.getByText('switch to en'));

    expect(localStorage.getItem('lang')).toBe('en');
  });
});
