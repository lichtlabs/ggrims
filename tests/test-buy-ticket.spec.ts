import { test, expect } from '@playwright/test';

test('buy tickets flow', async ({ page }) => {
  // Navigate to the base URL (defined in playwright.config.ts)
  await page.goto("http://localhost:3000");
  
  // Wait for page to be fully loaded
  await expect(page).toHaveURL('http://localhost:3000/');
  
  // Click on upcoming events link and wait for navigation
  await page.getByRole('link', { name: /See our upcoming events/i }).click();
  await expect(page).toHaveURL('http://localhost:3000/upcoming');
  
  // Wait for events to be loaded (assuming there's a loading state)
  await page.waitForLoadState('networkidle');
  
  // Click first event's ticket button and wait for navigation
  await page.getByRole('button', { name: /Get Ticket/i }).first().click();

  // Click the carousel-next button until the ticket name is #HCPB28-VVIP
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: /Next/i }).click();
    // Wait for carousel transition to complete
    await page.waitForTimeout(300);
  }

  // Set and verify ticket count
  await page.getByTestId('ticket_amount').fill('1');
  await expect(page.getByTestId('ticket_amount')).toHaveValue('1');

  // Add attendees data
  const attendees = [
    { name: 'dhiya', id_line: 'dhhiiyyaa' },
    { name: 'naya', id_line: 'nayyuhuuu' },
    { name: 'evan', id_line: 'evannns03' },
    { name: 'phonix', id_line: 'punikss' },
    { name: 'acha', id_line: 'achasivila' },
    { name: 'randi', id_line: 'uranglahtausob' },
    { name: 'yoandi', id_line: 'kwkwkwlol' },
    { name: 'justin', id_line: '08192920216616052006' },
    { name: 'sandy', id_line: 'addakuya.' },
    { name: 'saquile', id_line: 'sakilsuck' },
    { name: 'hendric', id_line: 'hein.hace' },
    { name: 'alden', id_line: 'aldenweidanto' }
  ];

  // Add attendee fields more efficiently
  const totalAttendees = attendees.length;
  for (let i = 0; i < totalAttendees - 1; i++) {
    await page.getByRole('button', { name: /Add Another/i }).click();
    await page.waitForTimeout(500);
    await page.waitForSelector(`[data-testid="attendees.${i}.name"]`, { state: 'visible' });
  }

  // Add additional wait to ensure all fields are ready
  await page.waitForTimeout(1000);

  // Fill attendee information more efficiently
  for (let i = 0; i < totalAttendees; i++) {
    await page.getByTestId(`attendees.${i}.name`).fill(attendees[i].name);
    await page.getByTestId(`attendees.${i}.id_line`).fill(attendees[i].id_line);
  }

  // Verify form is filled correctly
  for (let i = 0; i < totalAttendees; i++) {
    await expect(page.getByTestId(`attendees.${i}.name`)).toHaveValue(attendees[i].name);
    await expect(page.getByTestId(`attendees.${i}.id_line`)).toHaveValue(attendees[i].id_line);
  }

  // Submit and wait for success
  await page.getByTestId('submit-button').click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });

  // Navigate to payment
  await page.getByRole('button', { name: /Go to Payment Page/i }).click();
  
  // Wait for payment form and fill details
  await page.waitForSelector('[data-testid="email"]');
  await page.getByTestId('email').fill('dhiya@gmail.com');
  await page.getByTestId('nama_lengkap').fill('Dhiya');
  
  // Verify payment form fields
  await expect(page.getByTestId('email')).toHaveValue('dhiya@gmail.com');
  await expect(page.getByTestId('nama_lengkap')).toHaveValue('Dhiya');
  
  await page.getByRole('button', { name: /Bayar/i }).click();
});