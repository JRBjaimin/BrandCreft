/**
 * BullMQ queue names. Workers for these are added in later phases
 * (see docs/03 phases 7-13). Kept here so producers and workers agree.
 */
export const QUEUE = {
  AI: 'ai',
  WHATSAPP: 'whatsapp',
  INSTAGRAM: 'instagram',
  RATE: 'rate',
  NOTIFICATION: 'notification',
  MEDIA: 'media',
} as const;

export type QueueName = (typeof QUEUE)[keyof typeof QUEUE];
