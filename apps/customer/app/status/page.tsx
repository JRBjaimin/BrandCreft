import { ApiStatus } from '../api-status';

/** Dev-only connectivity check, moved here now that `/` is the storefront directory. */
export default function StatusPage() {
  return (
    <main className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>Backend status</h1>
      <ApiStatus />
    </main>
  );
}
