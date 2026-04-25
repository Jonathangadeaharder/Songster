import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
	test('renders the Wordmark and navigation buttons', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Songster').first()).toBeVisible();
		await expect(page.getByText('Music trivia timeline game')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Create Room' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Join Room' })).toBeVisible();
	});

	test('Create Room link navigates to lobby', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: 'Create Room' }).click();
		await expect(page).toHaveURL(/\/lobby\/DEMO/);
	});

	test('Join Room link navigates to lobby', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: 'Join Room' }).click();
		await expect(page).toHaveURL(/\/lobby\/DEMO/);
	});
});

test.describe('Lobby page', () => {
	test('shows room code and player chips', async ({ page }) => {
		await page.goto('/lobby/TEST12');
		await expect(page.getByRole('heading', { name: 'Room TEST12' })).toBeVisible();
		await expect(page.getByText('Waiting for players')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible();
	});

	test('Start Game navigates to game page', async ({ page }) => {
		await page.goto('/lobby/TEST12');
		await page.getByRole('button', { name: 'Start Game' }).click();
		await expect(page).toHaveURL(/\/game\/TEST12/);
	});
});

test.describe('Game page', () => {
	test('renders game chrome with room code', async ({ page }) => {
		await page.goto('/lobby/E2E');
		await page.getByRole('button', { name: 'Start Game' }).click();
		await expect(page).toHaveURL(/\/game\/E2E/);
		await expect(page.getByText(/Game · E2E/)).toBeVisible();
	});

	test('shows player chips for all 4 players', async ({ page }) => {
		await page.goto('/lobby/E2E');
		await page.getByRole('button', { name: 'Start Game' }).click();
		const playerRail = page.locator('.player-rail');
		await expect(playerRail.getByText('You')).toBeVisible();
		await expect(playerRail.getByText('Marlo')).toBeVisible();
		await expect(playerRail.getByText('June')).toBeVisible();
		await expect(playerRail.getByText('Kaz')).toBeVisible();
	});

	test('displays "Your Timeline" section', async ({ page }) => {
		await page.goto('/lobby/E2E');
		await page.getByRole('button', { name: 'Start Game' }).click();
		await expect(page.getByText('Your Timeline')).toBeVisible();
	});

	test('shows vinyl component', async ({ page }) => {
		await page.goto('/lobby/E2E');
		await page.getByRole('button', { name: 'Start Game' }).click();
		const svg = page.locator('.vinyl-wrap svg');
		await expect(svg).toBeVisible();
	});

	test('card can be tapped to start play phase', async ({ page }) => {
		await page.goto('/lobby/E2E');
		await page.getByRole('button', { name: 'Start Game' }).click();
		await page.locator('.card-wrapper button').click();
		await expect(page.getByText(/Listening/)).toBeVisible({ timeout: 3000 });
	});
});

test.describe('Results page', () => {
	test('shows winner section', async ({ page }) => {
		await page.goto('/results/E2E');
		await expect(page.getByText('Winner')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Play Again' })).toBeVisible();
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
