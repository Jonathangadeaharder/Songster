import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';
import { handlers } from './test-mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
