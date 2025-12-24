import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: /Year Bingo/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Click here to log in/i })).toBeVisible()
})

test('login page without token shows guidance', async ({ page }) => {
  await page.goto('/login', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: /Year Bingo Login/i })).toBeVisible()
  await expect(
    page.getByText('No login token found in URL. Please use the login link provided to you.'),
  ).toBeVisible()
})

