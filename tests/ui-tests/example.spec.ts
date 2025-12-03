import { test, expect } from '@playwright/test';

test('Create Test Article', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Sign in').click();
    await page.getByRole('textbox', { name: 'Email' }).fill("franktest@test.com");
    await page.getByRole('textbox', { name: 'password' }).fill("Test1234");
    await page.getByRole('button', { name: "Sign in" }).click();

    // blah blah
});