import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithI18n, screen, userEvent, within, fireEvent } from './test/helpers';
import App from './App';
import { usePlanStore } from './domains/plan/planStore';
import { analytics } from './shared/services/analytics';

function setUrl(url: string) {
  window.history.replaceState({}, '', url);
}

const initialPlanState = usePlanStore.getState();

describe('App', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    // Reset the Zustand store between tests so state from one test doesn't
    // leak into the next. The store is a module-level singleton.
    usePlanStore.setState(initialPlanState, true);
    setUrl('/');
  });

  describe('initial render (default language)', () => {
    it('shows the default Berlin Taui store name in the header', () => {
      renderWithI18n(<App />);

      // textContent is the raw text — uppercase comes from CSS
      expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/Berlin Taui/i);
    });

    it('renders all 7 section titles in German by default', () => {
      renderWithI18n(<App />);

      expect(screen.getByRole('heading', { name: 'Team' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Pausen' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Aufgaben' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Tagesfokus' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Kassen' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Abendschicht' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Notizen' })).toBeInTheDocument();
    });

    it('renders the language switcher when not in shared mode', () => {
      renderWithI18n(<App />);

      expect(screen.getByRole('button', { name: 'DE' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument();
    });

    it('renders Share and Generate PDF floating action buttons', () => {
      renderWithI18n(<App />);

      expect(screen.getByRole('button', { name: /teilen/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /pdf erstellen/i })).toBeInTheDocument();
    });
  });

  describe('language switching', () => {
    it('updates section titles when switching to English', async () => {
      const user = userEvent.setup();
      renderWithI18n(<App />);

      await user.click(screen.getByRole('button', { name: 'EN' }));

      expect(screen.getByRole('heading', { name: 'Breaks' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Daily Focus' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Registers' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Evening Shift' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument();
    });

    it('updates the floating action button labels when switching to English', async () => {
      const user = userEvent.setup();
      renderWithI18n(<App />);

      await user.click(screen.getByRole('button', { name: 'EN' }));

      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /generate pdf/i })).toBeInTheDocument();
    });

    it('emits a language_switched analytics event when toggling DE -> EN', async () => {
      const user = userEvent.setup();
      const trackSpy = vi.spyOn(analytics, 'track');
      renderWithI18n(<App />);

      await user.click(screen.getByRole('button', { name: 'EN' }));

      expect(trackSpy).toHaveBeenCalledWith('language_switched', { from: 'de', to: 'en' });
      trackSpy.mockRestore();
    });
  });

  describe('section content editing', () => {
    it('allows clicking the team add button to insert a second item', () => {
      renderWithI18n(<App />);

      const teamSection = screen.getByRole('heading', { name: 'Team' }).closest('section') as HTMLElement;
      const teamScope = within(teamSection);

      // Initially: 1 add + 1 trash = 2 buttons
      const initialButtons = teamScope.getAllByRole('button');
      expect(initialButtons).toHaveLength(2);

      // Click the + button (first button in the section header)
      fireEvent.click(initialButtons[0]!);

      // After click: 1 add + 2 trash = 3 buttons. Section now lives at module
      // scope, so the section ref is stable across the re-render.
      expect(teamScope.getAllByRole('button')).toHaveLength(3);
    });

    it('persists user edits to sessionStorage', async () => {
      const user = userEvent.setup();
      renderWithI18n(<App />);

      const teamSection = screen.getByRole('heading', { name: 'Team' }).closest('section');
      const teamScope = within(teamSection as HTMLElement);

      // Click on the team placeholder to enter edit mode
      await user.click(teamScope.getByText('Name'));

      // The textarea should now be visible inside the team section
      const textarea = teamScope.getByRole('textbox');
      await user.type(textarea, 'Anna');
      // Blur to save
      await user.tab();

      // Verify saved to sessionStorage. Zustand persist middleware wraps
      // the state under { state: ..., version: ... }
      const stored = sessionStorage.getItem('retail-store');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored as string);
      expect(parsed.state.team[0].text).toBe('Anna');
    });
  });

  describe('shared mode (?mode=shared)', () => {
    beforeEach(() => {
      setUrl('/?mode=shared');
    });

    it('hides the language switcher in shared mode', () => {
      renderWithI18n(<App />);

      expect(screen.queryByRole('button', { name: 'DE' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'EN' })).not.toBeInTheDocument();
    });

    it('hides the section + buttons in shared mode (no add controls)', () => {
      renderWithI18n(<App />);

      const teamSection = screen.getByRole('heading', { name: 'Team' }).closest('section');
      const teamScope = within(teamSection as HTMLElement);

      // The team section in shared mode should have no buttons (no + or trash)
      expect(teamScope.queryAllByRole('button')).toHaveLength(0);
    });
  });

  describe('shared mode with explicit language (?mode=shared&lang=en)', () => {
    beforeEach(() => {
      setUrl('/?mode=shared&lang=en');
    });

    it('respects the lang URL parameter and renders English titles', () => {
      renderWithI18n(<App />);

      expect(screen.getByRole('heading', { name: 'Team' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Breaks' })).toBeInTheDocument();
    });
  });
});
