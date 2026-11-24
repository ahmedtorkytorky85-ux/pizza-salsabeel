export interface PriceVariant {
  label: string; // e.g. "صغير", "وسط", "كبير", "صاروخ", "فينو", "سوري", "عادي"
  price: number; // e.g. 85
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  prices: PriceVariant[]; // Supports single price or multi-size (صغير/وسط/كبير)
  tags?: ('spicy' | 'popular' | 'special' | 'vegan' | 'combo')[];
  image?: string;
  isAvailable?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  subtitle?: string;
  sizeLabels?: string[]; // Column headers e.g. ['صغير', 'وسط', 'كبير'] or ['وسط', 'كبير', 'صاروخ']
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  deliveryPhones: string[];
  whatsappNumber: string;
  address: string;
  workingHours: string;
  announcement?: string;
}

export interface CartItem {
  cartId: string;
  itemId: string;
  name: string;
  variantLabel: string;
  price: number;
  quantity: number;
  notes?: string;
}
