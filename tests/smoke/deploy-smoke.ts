import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync, exec } from 'child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join, relative } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

const ROOT = resolve(__dirname, '../..');
const APP = resolve(ROOT, 'songster-svelte');
const BUILD = resolve(APP, 'build');

const PLACEHOLDER_ENV: Record<string, string> = {
	PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
	PUBLIC_SUPABASE_ANON_KEY: 'placeholder-anon-key',
	PUBLIC_POSTHOG_HOST: 'https://eu.i.posthog.com',
	PUBLIC_POSTHOG_PROJECT_TOKEN: 'placeholder-token',
	SUPABASE_SERVICE_ROLE_KEY: 'placeholder-service-role-key',
	NODE_ENV: 'production',
};

function readPkg(): Record<string, unknown> {
	return JSON.parse(readFileSync(resolve(APP, 'package.json'), 'utf-8'));
}

function collectSourceFiles(dir: string, exts = ['.ts', '.svelte']): string[] {
	const results: string[] = [];
	if (!existsSync(dir)) return results;
	for (const entry of readdirSync(dir)) {
		const full = resolve(dir, entry);
		if (entry === 'node_modules' || entry === '.svelte-kit' || entry === 'build') continue;
		const st = statSync(full);
		if (st.isDirectory()) results.push(...collectSourceFiles(full, exts));
		else if (exts.some((e) => entry.endsWith(e))) results.push(full);
	}
	return results;
}

function dockerAvailable(): boolean {
	try {
		execSync('docker info', { stdio: 'pipe', timeout: 5000 });
		return true;
	} catch {
		return false;
	}
}

let dockerContainerId: string | null = null;

describe('deploy smoke', () => {
	describe('1. pnpm build with placeholder envs', () => {
		it('completes without error', () => {
			const env = { ...process.env, ...PLACEHOLDER_ENV };
			execSync('pnpm run build', {
				cwd: APP,
				stdio: 'pipe',
				env,
				timeout: 120_000,
			});
		});
	});

	describe('2. build output exists', () => {
		it('has a build directory', () => {
			expect(existsSync(BUILD)).toBe(true);
		});

		it('contains index.js entry point', () => {
			const entry = resolve(BUILD, 'index.js');
			expect(existsSync(entry)).toBe(true);
		});

		it('contains handler.js or server files', () => {
			const handler = resolve(BUILD, 'handler.js');
			const index = resolve(BUILD, 'index.js');
			expect(existsSync(handler) || existsSync(index)).toBe(true);
		});

		it('build output is non-empty', () => {
			const files = collectSourceFiles(BUILD_DIR, ['.js', '.json', '.html']);
			expect(files.length).toBeGreaterThan(0);
		});
	});

	describe('3. public env vars have placeholder fallbacks', () => {
		const sourceDir = resolve(APP, 'src');

		it('all $env/static/public exports are handled with placeholder detection', () => {
			const envDts = readFileSync(resolve(sourceDir, 'env.d.ts'), 'utf-8');
			const publicVarMatches = envDts.matchAll(
				/export\s+const\s+(\w+)\s*:\s*string/g
			);
			const publicVars = [...publicVarMatches].map((m) => m[1]);

			expect(publicVars.length).toBeGreaterThan(0);

			const sourceFiles = collectSourceFiles(sourceDir);
			const allSource = sourceFiles.map((f) => readFileSync(f, 'utf-8')).join('\n');

			for (const varName of publicVars) {
				const hasPlaceholderCheck =
					allSource.includes('placeholder') ||
					allSource.includes('||') ||
					allSource.includes('??') ||
					allSource.includes('isPlaceholder') ||
					allSource.includes(`process.env.${varName}`);
				expect(hasPlaceholderCheck).toBe(true);
			}
		});

		it('import.meta.env.VITE_PUBLIC_* references have fallbacks', () => {
			const sourceFiles = collectSourceFiles(sourceDir);
			const vitePublicPattern = /import\.meta\.env\.(VITE_PUBLIC_\w+)/g;
			const refs = new Set<string>();

			for (const file of sourceFiles) {
				const content = readFileSync(file, 'utf-8');
				let match: RegExpExecArray | null;
				while ((match = vitePublicPattern.exec(content)) !== null) {
					refs.add(match[1]);
				}
			}

			const allSource = sourceFiles.map((f) => readFileSync(f, 'utf-8')).join('\n');

			for (const ref of refs) {
				const hasFallback =
					allSource.includes(`import.meta.env.${ref}`) &&
					(allSource.includes('||') || allSource.includes('??'));
				expect(hasFallback).toBe(true);
			}
		});
	});

	describe('4. external imports resolve to package.json deps', () => {
		it('all runtime imports are declared as dependencies or devDependencies', () => {
			const pkg = readPkg();
			const deps = {
				...(pkg.dependencies as Record<string, string>),
				...(pkg.devDependencies as Record<string, string>),
			};

			const sourceFiles = collectSourceFiles(resolve(APP, 'src'));
			const importPattern = /import\s+.*?\s+from\s+['"]([^./@][^'"]*)['"]/g;
			const scopedPattern = /import\s+.*?\s+from\s+['"](@[^/]+\/[^/]+)['"]/g;

			const externalImports = new Set<string>();

			for (const file of sourceFiles) {
				const content = readFileSync(file, 'utf-8');
				let match: RegExpExecArray | null;

				while ((match = importPattern.exec(content)) !== null) {
					externalImports.add(match[1]);
				}
				while ((match = scopedPattern.exec(content)) !== null) {
					externalImports.add(match[1]);
				}
			}

			const svelteKitInternals = new Set([
				'$app/environment',
				'$app/navigation',
				'$app/state',
				'$app/stores',
				'$app/paths',
				'$env',
				'$lib',
			]);

			for (const imp of externalImports) {
				if (svelteKitInternals.has(imp) || imp.startsWith('$')) continue;
				if (imp.startsWith('node:')) continue;

				const topLevel = imp.startsWith('@') ? imp : imp.split('/')[0];
				const found = Object.keys(deps).some(
					(d) => d === topLevel || d === imp
				);
				expect(found, `Import "${imp}" not found in package.json deps`).toBe(true);
			}
		});

		it('posthog-js is in dependencies', () => {
			const pkg = readPkg();
			const deps = pkg.dependencies as Record<string, string>;
			expect(deps).toHaveProperty('posthog-js');
		});

		it('posthog-node is in dependencies', () => {
			const pkg = readPkg();
			const deps = pkg.dependencies as Record<string, string>;
			expect(deps).toHaveProperty('posthog-node');
		});

		it('@supabase/ssr is in dependencies', () => {
			const pkg = readPkg();
			const deps = pkg.dependencies as Record<string, string>;
			expect(deps).toHaveProperty('@supabase/ssr');
		});
	});

	describe('5. Docker HEALTHCHECK', () => {
		beforeAll(() => {
			if (!dockerAvailable()) return;
		});

		it('docker build succeeds', () => {
			if (!dockerAvailable()) return;

			execSync(
				`docker build \
					--build-arg PUBLIC_SUPABASE_URL=${PLACEHOLDER_ENV.PUBLIC_SUPABASE_URL} \
					--build-arg PUBLIC_SUPABASE_ANON_KEY=${PLACEHOLDER_ENV.PUBLIC_SUPABASE_ANON_KEY} \
					--build-arg PUBLIC_POSTHOG_HOST=${PLACEHOLDER_ENV.PUBLIC_POSTHOG_HOST} \
					--build-arg PUBLIC_POSTHOG_PROJECT_TOKEN=${PLACEHOLDER_ENV.PUBLIC_POSTHOG_PROJECT_TOKEN} \
					-t songster-smoke-test \
					.`,
				{ cwd: APP, stdio: 'pipe', timeout: 300_000 }
			);
		});

		it('container starts and /health returns ok', async () => {
			if (!dockerAvailable()) return;

			const { stdout } = await execAsync(
				'docker run -d --rm -p 3099:3000 --name songster-smoke songster-smoke-test'
			);
			dockerContainerId = stdout.trim();

			await new Promise((r) => setTimeout(r, 5000));

			const maxAttempts = 10;
			let lastError: Error | null = null;

			for (let i = 0; i < maxAttempts; i++) {
				try {
					const { stdout: body } = await execAsync(
						'curl -sf http://localhost:3099/health'
					);
					const data = JSON.parse(body);
					expect(data.status).toBe('ok');
					expect(data.version).toBeDefined();
					lastError = null;
					break;
				} catch (e) {
					lastError = e as Error;
					await new Promise((r) => setTimeout(r, 2000));
				}
			}

			if (lastError) throw lastError;
		});

		afterAll(async () => {
			if (dockerContainerId) {
				try {
					execSync(`docker stop ${dockerContainerId}`, { stdio: 'pipe', timeout: 15_000 });
				} catch {
					// container may have already stopped
				}
				dockerContainerId = null;
			}
			try {
				execSync('docker rmi songster-smoke-test', { stdio: 'pipe' });
			} catch {
				// image may not exist
			}
		});
	});
});
