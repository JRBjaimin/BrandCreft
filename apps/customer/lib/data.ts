import { createStorefrontDataProvider } from '@brandcraft/storefront-data';

/**
 * Single seam every page/component reads through. Swapping to a real backend
 * later means adding an 'api' branch inside createStorefrontDataProvider —
 * nothing here or in app/ changes.
 */
export const dataProvider = createStorefrontDataProvider('mock');
