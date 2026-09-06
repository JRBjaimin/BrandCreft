import { ApiClient } from '@brandcraft/api-client';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

/** Public storefront client (unauthenticated). */
export const api = new ApiClient({ baseUrl });
