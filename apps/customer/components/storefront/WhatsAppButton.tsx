'use client';

import { buildWhatsAppLink } from '../../lib/whatsapp';
import { dataProvider } from '../../lib/data';
import { LinkButton } from '../ui';

export function WhatsAppButton({
  businessId,
  productId,
  phone,
  message,
  label = 'Enquire on WhatsApp',
  size,
}: {
  businessId: string;
  productId: string | null;
  phone: string;
  message: string;
  label?: string;
  size?: 'sm';
}) {
  const href = buildWhatsAppLink(phone, message);

  return (
    <LinkButton
      variant="whatsapp"
      size={size}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        // Fire-and-forget local record of enquiry intent (see docs/03 Phase 6:
        // enquiry tracking moves server-side once the backend exists).
        void dataProvider.submitEnquiry({ businessId, productId, message });
      }}
    >
      <span aria-hidden>💬</span> {label}
    </LinkButton>
  );
}
