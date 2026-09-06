import { ApiClient } from '@brandcraft/api-client';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

/**
 * Shared client instance for the admin app. Auth token wiring is added in
 * Phase 3; for now it is an unauthenticated client used by the health widget.
 */
export const api = new ApiClient({ baseUrl });
