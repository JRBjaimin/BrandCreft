/** Builds a wa.me deep link with a prefilled message — no backend needed for this step. */
export function buildWhatsAppLink(phone: string, message: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryMessage(businessName: string, productName: string): string {
  return `Hi ${businessName}, I'm interested in "${productName}" — could you share more details?`;
}

export function generalEnquiryMessage(businessName: string): string {
  return `Hi ${businessName}, I'd like to know more about your products.`;
}
