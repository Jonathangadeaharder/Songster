import { test, expect } from '@playwright/test';

async function startGame(page: import('@playwright/test').Page, code = 'DEMO') {
	await page.goto(`/lobby/${code}`);
	await page.getByRole('button', { name: 'Start Game' }).click();
	await expect(page).toHaveURL((url) => url.pathname === `/game/${code}`);
}

test.describe('Home page', () => {
	test('renders the Wordmark and navigation buttons', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Songster').first()).toBeVisible();
		await expect(page.getByText('Music trivia timeline game')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Create Room' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Join Room' })).toBeVisible();
		await expect(page.getByRole('link', { name: /play solo/i })).toBeVisible();
	});

	test('Create Room button navigates to lobby after filling name', async ({ page }) => {
		await page.goto('/');
		const createForm = page.locator('form').filter({ hasText: 'Create Room' });
		await createForm.getByPlaceholder('Your name').fill('Alice');
		await createForm.getByRole('button', { name: 'Create Room' }).click();
		await expect(page).toHaveURL(/\/lobby\/DEMO/);
	});

	test('Join Room button navigates to lobby after filling fields', async ({ page }) => {
		await page.goto('/');
		const joinForm = page.locator('form').filter({ hasText: 'Join Room' });
		await joinForm.getByPlaceholder('Room code').fill('ABC123');
		await joinForm.getByPlaceholder('Your name').fill('Bob');
		await joinForm.getByRole('button', { name: 'Join Room' }).click();
		await expect(page).toHaveURL(/\/lobby\/ABC123/);
	});

	test('Solo play link navigates to lobby', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: /play solo/i }).click();
		await expect(page).toHaveURL(/\/lobby\/DEMO/);
	});
});

test.describe('Lobby page', () => {
	test('shows room code and player chips', async ({ page }) => {
		await page.goto('/lobby/DEMO');
		await expect(page.getByRole('heading', { name: 'Solo Game' })).toBeVisible();
		await expect(page.getByText('AI opponents ready')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible();
	});

	test('Start Game navigates to game page', async ({ page }) => {
		await page.goto('/lobby/DEMO');
		await page.getByRole('button', { name: 'Start Game' }).click();
		await expect(page).toHaveURL(/\/game\/DEMO/);
	});
});

test.describe('Game page', () => {
	test('renders game chrome with room code', async ({ page }) => {
		await startGame(page, 'DEMO');
		await expect(page.getByText(/Game · DEMO/)).toBeVisible();
	});

	test('shows player chips for all 4 players', async ({ page }) => {
		await startGame(page);
		const playerRail = page.locator('.player-rail');
		await expect(playerRail.getByText('You')).toBeVisible();
		await expect(playerRail.getByText('Marlo')).toBeVisible();
		await expect(playerRail.getByText('June')).toBeVisible();
		await expect(playerRail.getByText('Kaz')).toBeVisible();
	});

	test('displays "Your Timeline" section', async ({ page }) => {
		await startGame(page);
		await expect(page.getByText('Your Timeline')).toBeVisible();
	});

	test('shows vinyl component', async ({ page }) => {
		await startGame(page);
		const svg = page.locator('.vinyl-wrap svg');
		await expect(svg).toBeVisible();
	});

	test('card can be tapped to start play phase', async ({ page }) => {
		await startGame(page);
		await page.getByRole('group', { name: 'Active card' }).getByRole('button').click();
		await expect(page.getByText(/Listening/)).toBeVisible();
	});
});

test.describe('Results page', () => {
	test('shows winner section', async ({ page }) => {
		await page.goto('/results/DEMO');
		await expect(page.getByText('Winner')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Back to Lobby' })).toBeVisible();
	});
});

test.describe('Auth login page', () => {
	test('renders email and password inputs', async ({ page }) => {
		await page.goto('/auth/login');
		await expect(page.getByPlaceholder('Email')).toBeVisible();
		await expect(page.getByPlaceholder('Password')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
	});
});
