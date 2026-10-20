import { expect, type Page } from '@playwright/test';

// Complete the actual teaching flow; do not jump to quizzes through storage.
export async function startQuiz(page: Page) {
  await expect(page.getByTestId('lesson-reader')).toBeVisible();
  await page.getByRole('button', { name: 'Continue to visual →', exact: true }).click();
  await expect(page.getByText('WORKED EXAMPLE', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Continue to practice →', exact: true }).click();
  await page.getByRole('radio').first().click();
  await page.getByRole('button', { name: 'Check practice', exact: true }).click();
  await page.getByRole('button', { name: 'Continue to recap →', exact: true }).click();
  await page.getByRole('button', { name: 'Start quiz →', exact: true }).click();
}
