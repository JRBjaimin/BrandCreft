'use client';

import { Badge, type BadgeTone } from './ui';
import type {
  BusinessStatus,
  CampaignStatus,
  CreativeStatus,
  IntegrationState,
  ProductStatus,
} from '../lib/types';

const CREATIVE: Record<CreativeStatus, [BadgeTone, string]> = {
  GENERATING: ['blue', 'Generating'],
  GENERATED: ['violet', 'Generated'],
  PENDING_APPROVAL: ['amber', 'Pending approval'],
  APPROVED: ['blue', 'Approved'],
  REJECTED: ['red', 'Rejected'],
  PUBLISHING: ['blue', 'Publishing'],
  PUBLISHED: ['green', 'Published'],
  FAILED: ['red', 'Failed'],
  EXPIRED: ['grey', 'Expired'],
};

const CAMPAIGN: Record<CampaignStatus, [BadgeTone, string]> = {
  draft: ['grey', 'Draft'],
  scheduled: ['blue', 'Scheduled'],
  running: ['green', 'Running'],
  completed: ['violet', 'Completed'],
  archived: ['grey', 'Archived'],
};

const PRODUCT: Record<ProductStatus, [BadgeTone, string]> = {
  draft: ['grey', 'Draft'],
  active: ['green', 'Active'],
  archived: ['grey', 'Archived'],
};

const INTEGRATION: Record<IntegrationState, [BadgeTone, string]> = {
  connected: ['green', 'Connected'],
  disconnected: ['grey', 'Not connected'],
  error: ['red', 'Action needed'],
};

export function CreativeStatusBadge({ status }: { status: CreativeStatus }) {
  const [tone, label] = CREATIVE[status];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const [tone, label] = CAMPAIGN[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const [tone, label] = PRODUCT[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function BusinessStatusBadge({ status }: { status: BusinessStatus }) {
  return status === 'ACTIVE' ? <Badge tone="green" dot>Active</Badge> : <Badge tone="grey" dot>Disabled</Badge>;
}

export function IntegrationBadge({ state }: { state: IntegrationState }) {
  const [tone, label] = INTEGRATION[state];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}
