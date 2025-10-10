import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL('/');
  });

  test('should display tasks page', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Tasks');
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('select[name="assignedToId"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Add');
  });

  test('should create a new task', async ({ page }) => {
    const taskTitle = `Test Task ${Date.now()}`;
    
    // Fill in the task form
    await page.fill('input[name="title"]', taskTitle);
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Should see the new task in the list
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
  });

  test('should create task with user assignment', async ({ page }) => {
    const taskTitle = `Assigned Task ${Date.now()}`;
    
    // Fill in the task form
    await page.fill('input[name="title"]', taskTitle);
    
    // Select a user from dropdown
    await page.selectOption('select[name="assignedToId"]', { index: 1 });
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Should see the new task with assignment badge
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
    await expect(page.locator('text=Assigned to:')).toBeVisible();
  });

  test('should edit task title', async ({ page }) => {
    const originalTitle = `Original Task ${Date.now()}`;
    const editedTitle = `Edited Task ${Date.now()}`;
    
    // Create a task first
    await page.fill('input[name="title"]', originalTitle);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator(`text=${originalTitle}`)).toBeVisible();
    
    // Click edit button for the task
    await page.locator('li').filter({ hasText: originalTitle }).locator('button:has-text("Edit")').click();
    
    // Edit the title
    await page.fill('input[name="title"]', editedTitle);
    
    // Save changes
    await page.locator('button:has-text("Save")').click();
    
    // Should see updated title
    await expect(page.locator(`text=${editedTitle}`)).toBeVisible();
    await expect(page.locator(`text=${originalTitle}`)).not.toBeVisible();
  });

  test('should cancel task edit', async ({ page }) => {
    const taskTitle = `Cancel Edit Task ${Date.now()}`;
    
    // Create a task first
    await page.fill('input[name="title"]', taskTitle);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
    
    // Click edit button
    await page.locator('li').filter({ hasText: taskTitle }).locator('button:has-text("Edit")').click();
    
    // Edit the title
    await page.fill('input[name="title"]', 'Should Not Save');
    
    // Cancel editing
    await page.locator('button:has-text("Cancel")').click();
    
    // Should still see original title
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
    await expect(page.locator('text=Should Not Save')).not.toBeVisible();
  });

  test('should toggle task status', async ({ page }) => {
    const taskTitle = `Status Task ${Date.now()}`;
    
    // Create a task first
    await page.fill('input[name="title"]', taskTitle);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
    
    // Should initially show "Mark Done" button
    const taskItem = page.locator('li').filter({ hasText: taskTitle });
    await expect(taskItem.locator('button:has-text("Mark Done")')).toBeVisible();
    
    // Click to mark as done
    await taskItem.locator('button:has-text("Mark Done")').click();
    
    // Should now show "Mark Pending" button
    await expect(taskItem.locator('button:has-text("Mark Pending")')).toBeVisible();
    
    // Click to mark as pending again
    await taskItem.locator('button:has-text("Mark Pending")').click();
    
    // Should show "Mark Done" again
    await expect(taskItem.locator('button:has-text("Mark Done")')).toBeVisible();
  });

  test('should delete task with confirmation', async ({ page }) => {
    const taskTitle = `Delete Task ${Date.now()}`;
    
    // Create a task first
    await page.fill('input[name="title"]', taskTitle);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
    
    // Setup dialog handler to confirm deletion
    page.on('dialog', dialog => dialog.accept());
    
    // Click delete button
    await page.locator('li').filter({ hasText: taskTitle }).locator('button:has-text("Delete")').click();
    
    // Task should be removed
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible();
  });

  test('should cancel task deletion', async ({ page }) => {
    const taskTitle = `Cancel Delete Task ${Date.now()}`;
    
    // Create a task first
    await page.fill('input[name="title"]', taskTitle);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
    
    // Setup dialog handler to cancel deletion
    page.on('dialog', dialog => dialog.dismiss());
    
    // Click delete button
    await page.locator('li').filter({ hasText: taskTitle }).locator('button:has-text("Delete")').click();
    
    // Task should still be visible
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
  });

  test('should show task pagination controls', async ({ page }) => {
    // Check if pagination controls are visible (if there are enough tasks)
    const paginationSection = page.locator('text=Page').first();
    
    // If pagination exists, test it
    if (await paginationSection.isVisible()) {
      await expect(page.locator('button:has-text("Previous")')).toBeVisible();
      await expect(page.locator('button:has-text("Next")')).toBeVisible();
    }
  });

  test('should change tasks per page', async ({ page }) => {
    // Test changing the items per page dropdown
    const dropdown = page.locator('select').filter({ hasText: /Tasks per page/ }).or(page.locator('label:has-text("Tasks per page:") + select'));
    
    if (await dropdown.isVisible()) {
      await dropdown.selectOption('5');
      // Should update the display
      await expect(page.locator('text=Tasks per page:')).toBeVisible();
    }
  });

  test('should display task creation date', async ({ page }) => {
    const taskTitle = `Date Task ${Date.now()}`;
    
    // Create a task
    await page.fill('input[name="title"]', taskTitle);
    await page.locator('button[type="submit"]').click();
    
    // Should show creation date
    const taskItem = page.locator('li').filter({ hasText: taskTitle });
    await expect(taskItem.locator('text=Created:')).toBeVisible();
  });
});
