/**
 * Minimal typed API client shared by the admin and customer apps.
 * Wraps fetch, injects the bearer token, and normalizes error responses.
 */
import type { ApiError, AuthTokens, HealthResponse, UserSummary } from '@brandcraft/types';

export interface ApiClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | null | undefined;
  fetchImpl?: typeof fetch;
}

export class ApiClientError extends Error {
  readonly statusCode: number;
  readonly body: ApiError | undefined;

  constructor(statusCode: number, message: string, body?: ApiError) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.body = body;
  }
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly getAccessToken: () => string | null | undefined;
  private readonly fetchImpl: typeof fetch;

  constructor(opts: ApiClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, '');
    this.getAccessToken = opts.getAccessToken ?? (() => null);
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = this.getAccessToken();
    const headers = new Headers(init.headers);
    headers.set('accept', 'application/json');
    if (init.body && !headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }
    if (token) headers.set('authorization', `Bearer ${token}`);

    const res = await this.fetchImpl(`${this.baseUrl}${path}`, { ...init, headers });
    const text = await res.text();
    const data = text ? JSON.parse(text) : undefined;

    if (!res.ok) {
      const body = data as ApiError | undefined;
      throw new ApiClientError(res.status, body?.message ?? res.statusText, body);
    }
    return data as T;
  }

  health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  login(email: string, password: string): Promise<AuthTokens> {
    return this.request<AuthTokens>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  me(): Promise<UserSummary> {
    return this.request<UserSummary>('/auth/me');
  }
}
