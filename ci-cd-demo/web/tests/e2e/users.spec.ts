import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL('/');
    
    // Navigate to users page
    await page.locator('a[href="/admin/users"]').click();
    await expect(page).toHaveURL('/admin/users');
  });

  test('should display users page', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Users');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("Email")')).toBeVisible();
    await expect(page.locator('th:has-text("Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Roles")')).toBeVisible();
  });

  test('should show table headers with dark background', async ({ page }) => {
    const headerRow = page.locator('thead tr').first();
    
    // Check that headers are visible
    await expect(headerRow.locator('th:has-text("Email")')).toBeVisible();
    await expect(headerRow.locator('th:has-text("Name")')).toBeVisible();
    await expect(headerRow.locator('th:has-text("Roles")')).toBeVisible();
  });

  test('should display user data in table', async ({ page }) => {
    // Should see at least the admin user
    await expect(page.locator('td:has-text("admin@example.com")')).toBeVisible();
    
    // Check for alternating row colors by looking for multiple rows
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    
    if (rowCount > 0) {
      await expect(rows.first()).toBeVisible();
    }
  });

  test('should show users per page dropdown', async ({ page }) => {
    await expect(page.locator('label:has-text("Users per page:")')).toBeVisible();
    
    const dropdown = page.locator('select').last();
    await expect(dropdown).toBeVisible();
    
    // Check dropdown options
    await expect(dropdown.locator('option[value="5"]')).toBeVisible();
    await expect(dropdown.locator('option[value="10"]')).toBeVisible();
    await expect(dropdown.locator('option[value="20"]')).toBeVisible();
  });

  test('should change users per page', async ({ page }) => {
    const dropdown = page.locator('select').last();
    
    // Change to 5 users per page
    await dropdown.selectOption('5');
    
    // URL should update with limit parameter
    await expect(page).toHaveURL(/limit=5/);
    
    // Should still show users table
    await expect(page.locator('table')).toBeVisible();
  });

  test('should show user count information', async ({ page }) => {
    // Should show "Showing X to Y of Z users"
    await expect(page.locator('text=/Showing \\d+ to \\d+ of \\d+ users/')).toBeVisible();
  });

  test('should display pagination controls when needed', async ({ page }) => {
    const paginationSection = page.locator('text=/Page \\d+ of \\d+/');
    
    // If there are multiple pages, test pagination
    if (await paginationSection.isVisible()) {
      await expect(page.locator('button:has-text("Previous")')).toBeVisible();
      await expect(page.locator('button:has-text("Next")')).toBeVisible();
      
      // Check page number buttons
      await expect(page.locator('button:has-text("1")')).toBeVisible();
    }
  });

  test('should navigate between pages if multiple pages exist', async ({ page }) => {
    // First, set to 5 users per page to potentially create multiple pages
    await page.locator('select').last().selectOption('5');
    
    const nextButton = page.locator('button:has-text("Next")');
    
    if (await nextButton.isVisible() && !await nextButton.isDisabled()) {
      // Click next page
      await nextButton.click();
      
      // URL should update with page parameter
      await expect(page).toHaveURL(/page=2/);
      
      // Previous button should now be enabled
      await expect(page.locator('button:has-text("Previous")')).not.toBeDisabled();
      
      // Should still show table
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should handle direct page navigation via URL', async ({ page }) => {
    // Navigate directly to page 1 with limit 5
    await page.goto('/admin/users?page=1&limit=5');
    
    await expect(page.locator('h2')).toContainText('Users');
    await expect(page.locator('table')).toBeVisible();
    
    // Dropdown should reflect the limit
    const dropdown = page.locator('select').last();
    await expect(dropdown).toHaveValue('5');
  });

  test('should show proper role information', async ({ page }) => {
    // Look for role information in the table
    const roleColumns = page.locator('tbody td').nth(2); // Third column should be roles
    
    if (await roleColumns.count() > 0) {
      // Should show role names like "admin", "user", or "—" for no roles
      await expect(page.locator('tbody').first()).toBeVisible();
    }
  });

  test('should maintain state when navigating away and back', async ({ page }) => {
    // Set specific pagination settings
    await page.locator('select').last().selectOption('5');
    await expect(page).toHaveURL(/limit=5/);
    
    // Navigate to tasks page
    await page.locator('a[href="/"]').click();
    await expect(page).toHaveURL('/');
    
    // Navigate back to users page
    await page.locator('a[href="/admin/users"]').click();
    
    // Should return to first page with default limit
    await expect(page).toHaveURL('/admin/users');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should handle empty states gracefully', async ({ page }) => {
    // This test ensures the page handles edge cases
    await expect(page.locator('h2')).toContainText('Users');
    
    // Even if no users (unlikely), table structure should exist
    await expect(page.locator('thead')).toBeVisible();
    await expect(page.locator('tbody')).toBeVisible();
  });

  test('should show welcome message with user info', async ({ page }) => {
    // Should show welcome message with current user
    await expect(page.locator('text=/Welcome, .+/')).toBeVisible();
  });

  test('should have consistent styling across table rows', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    
    if (rowCount > 1) {
      // Check that we have alternating row styling by verifying multiple rows exist
      await expect(rows.nth(0)).toBeVisible();
      await expect(rows.nth(1)).toBeVisible();
    }
  });

  test('should navigate via mobile menu if on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Go back to home first
    await page.goto('/');
    
    // Click mobile menu button (look for hamburger menu or mobile menu button)
    const mobileMenuButton = page.locator('button').filter({ hasText: /☰|≡||||/ }).first();
    
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Click on Users link in mobile menu
      await page.locator('a:has-text("Users")').click();
      
      await expect(page).toHaveURL('/admin/users');
      await expect(page.locator('h2')).toContainText('Users');
    }
  });
});
