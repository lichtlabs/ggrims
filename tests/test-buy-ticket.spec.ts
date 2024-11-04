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
  await page.getByRole('button', { name: /Next/i }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Next/i }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Next/i }).click();

  // Wait for ticket form to be visible
  await page.waitForSelector('form');

  // Set ticket count first
  await page.getByTestId('ticket_amount').fill('1');

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

  // Add more attendees
  for (let i = 1; i < attendees.length -1; i++) {
    await page.getByRole('button', { name: /Add Another/i }).click();
    await page.waitForTimeout(500);
  }

  // Fill remaining attendees
  for (let i = 0; i < attendees.length -1; i++) {
    await page.getByTestId(`attendees.${i}.name`).fill(attendees[i].name);
    await page.getByTestId(`attendees.${i}.id_line`).fill(attendees[i].id_line);
    await page.waitForTimeout(500);
  }

  // Submit the form
  await page.getByTestId('submit-button').click();

  // Wait for success dialog
  await page.waitForTimeout(8000)

  // Click the go to payment page button
  await page.getByRole('button', { name: /Go to Payment Page/i }).click();

  // Wait for payment page to be loaded
  await page.waitForTimeout(8000)

  // fill email and nama lengkap then click bayar button
  await page.getByTestId('email').fill('dhiya@gmail.com');
  await page.getByTestId('nama_lengkap').fill('Dhiya');
  await page.getByRole('button', { name: /Bayar/i }).click();
});