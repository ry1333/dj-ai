import { test, expect } from '@playwright/test'

test('Create preview flow (stub)', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  // This assumes you add a link to /create in your app navigation later.
  // For now, visiting /create directly:
  await page.goto('http://localhost:5173/create')
  await page.getByTestId('generate').click()
  const preview = page.getByTestId('preview')
  await expect(preview).toBeVisible()
})
