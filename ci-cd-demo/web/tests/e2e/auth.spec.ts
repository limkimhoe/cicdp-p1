import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.only('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page).toHaveTitle(/Vite \+ React/);
    await expect(page.locator('h1')).toContainText('Welcome Back');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test.only('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    
    await page.locator('text=Sign up here').click();
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1')).toContainText('Create Account');
  });

  test.only('should show error for invalid email', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit with empty email
    await page.locator('button[type="submit"]').click();
    
    // Check for HTML5 validation or custom error
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeFocused();
  });

  test.only('should successfully login with admin@example.com', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in the login form
    await page.fill('input[name="email"]', 'admin@example.com');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Should redirect to tasks page
    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toContainText('Tasks');
    await expect(page.locator('text=Welcome,')).toBeVisible();
  });

  test.only('should successfully register new user', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    
    await page.goto('/register');
    
    // Fill in the registration form
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="username"]', 'Test User');
    await page.fill('input[name="password"]', 'testpassword123');
    await page.fill('input[name="confirmPassword"]', 'testpassword123');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Should redirect to tasks page
    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toContainText('Tasks');
    await expect(page.locator('text=Welcome, Test User')).toBeVisible();
  });

  test('should show error for mismatched passwords', async ({ page }) => {
    await page.goto('/register');
    
    // Fill in the registration form with mismatched passwords
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="username"]', 'Test User');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'different123');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Should show error message
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.locator('button[type="submit"]').click();
    
    await expect(page).toHaveURL('/');
    
    // Logout
    await page.locator('button:has-text("Logout")').click();
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });

  test('should show mobile navigation menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.locator('button[type="submit"]').click();
    
    await expect(page).toHaveURL('/');
    
    // Click hamburger menu
    await page.locator('button').filter({ hasText: /☰|≡/ }).or(page.locator('[data-testid="mobile-menu"]')).first().click();
    
    // Should show mobile navigation
    await expect(page.locator('nav').nth(1)).toBeVisible();
    await expect(page.locator('text=Tasks')).toBeVisible();
    await expect(page.locator('text=Users')).toBeVisible();
  });
});
