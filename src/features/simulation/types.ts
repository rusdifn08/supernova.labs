export interface BookingStudio {
  id: string;
  name: string;
  type: string;
  icon: string;
  from: number;
}

export interface BookingPackage {
  id: string;
  name: string;
  dur: string;
  add: number;
}

export interface CartItem {
  name: string;
  price: number;
}

export interface QrMenuItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
}

export type OrderStatus = 'new' | 'accepted' | 'cooking' | 'ready';
export type QrPhase = 'scan' | 'scanning' | 'menu' | 'status';
