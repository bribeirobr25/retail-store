import { test, expect } from '@playwright/test';

test.describe('critical user flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Reset session storage so each test starts fresh
    await page.evaluate(() => sessionStorage.clear());
    await page.goto('/');
  });

  test('page loads with the correct title and default store', async ({ page }) => {
    await expect(page).toHaveTitle('Retail Store - Manager Planner');

    // Heading text is "Berlin Taui" — uppercase styling is CSS only
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText(/berlin taui/i);
  });

  test('renders all 7 section titles in German by default', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pausen' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aufgaben' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tagesfokus' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kassen' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Abendschicht' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Notizen' })).toBeVisible();
  });

  test('switching to English updates section titles', async ({ page }) => {
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    // Wait for the heading to render in English
    await expect(page.getByRole('heading', { name: 'Breaks' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Breaks' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Daily Focus' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Registers' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Evening Shift' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible();
  });

  test('language preference persists in localStorage', async ({ page }) => {
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    const stored = await page.evaluate(() => localStorage.getItem('lang'));
    expect(stored).toBe('en');
  });

  test('add team member, edit name, persist after reload', async ({ page }) => {
    const teamSection = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Team' }) });

    // Click on the placeholder to enter edit mode
    await teamSection.getByText('Name', { exact: true }).first().click();

    // Type in the textarea
    const textarea = teamSection.locator('textarea').first();
    await textarea.fill('Anna');
    await textarea.press('Enter');

    // Reload the page (same tab) — sessionStorage should preserve the data
    await page.reload();

    const teamSectionAfter = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Team' }) });
    await expect(teamSectionAfter.getByText('Anna')).toBeVisible();
  });

  test('share button reveals copy/whatsapp/email options', async ({ page }) => {
    // Click the floating Share button (use exact match — "Teilen" wraps an SVG)
    await page.getByRole('button', { name: 'Teilen' }).click();

    await expect(page.getByRole('button', { name: /link kopieren/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /whatsapp/i })).toBeVisible();
    // German label is "E-Mail" with hyphen
    await expect(page.getByRole('button', { name: /e-mail/i })).toBeVisible();
  });

  test('shared mode hides language switcher and dropdown chevrons', async ({ page }) => {
    await page.goto('/?mode=shared&lang=de');

    // Use exact name matching — other buttons (Teilen, PDF erstellen) contain "en" substring
    await expect(page.getByRole('button', { name: 'DE', exact: true })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'EN', exact: true })).not.toBeVisible();
  });

  test('shared mode with lang=en respects the URL parameter', async ({ page }) => {
    await page.goto('/?mode=shared&lang=en');

    await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Breaks' })).toBeVisible();
  });
});
