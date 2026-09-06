import { ApiStatus } from './api-status';

export default function HomePage() {
  return (
    <main>
      <h1>BrandCraft Admin</h1>
      <p>
        Phase 1 skeleton. This console will host Super Admin platform operations and Business Admin
        management (see <code>docs/02_TECHNICAL_WORK_BREAKDOWN.md</code>).
      </p>
      <ApiStatus />
    </main>
  );
}
