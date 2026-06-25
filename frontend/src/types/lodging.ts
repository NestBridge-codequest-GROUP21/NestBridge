export type LodgingCategory = 'HOTEL' | 'GUESTHOUSE' | 'PARTNER';

export type LodgingCategoryFilter = 'ALL' | LodgingCategory;

export interface LodgingListing {
  id: string;
  name: string;
  category: LodgingCategory;
  city: string;
  area: string;
  priceHint: string;
  rating: number;
  phone?: string;
  email?: string;
  bookingUrl?: string;
  description: string;
  icon?: string;
}

export interface SavedLodgingContact {
  listingId: string;
  savedAt: string;
  notes?: string;
}
