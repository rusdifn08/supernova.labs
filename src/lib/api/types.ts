export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface Tenant {
  id: string;
  slug: string;
  code: string;
  name: string;
  business_type: string;
  city?: string;
  phone?: string;
  plan: string;
  trial_expires_at: string;
  days_remaining: number;
  is_trial_active: boolean;
}

export interface Session {
  token: string;
  user: User;
  tenant: Tenant;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
  };
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[] | Record<string, unknown> | null;
  };
}

export interface ResourceItem {
  id: string;
  name: string;
  category: string;
  hourly_rate: number;
  capacity: number;
  description?: string;
  is_active: boolean;
}

export interface ReservationItem {
  id: string;
  code: string;
  resource_id: string;
  resource_name: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  total_amount: number;
  down_payment: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'dp_paid' | 'paid';
  payment_method?: string;
  notes?: string;
  created_at: string;
}

export interface BookingStats {
  revenue_today: number;
  reservations_today: number;
  occupancy_pct: number;
  upcoming_count: number;
  pending_payment_count: number;
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category_id?: string;
  unit: string;
  buy_price: number;
  sell_price: number;
  stock_quantity: number;
  min_stock_alert: number;
  is_active: boolean;
}

export interface PosOrderItem {
  id: string;
  invoice_number: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  change_amount: number;
  payment_method: string;
  created_at: string;
}

export interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: string;
  loyalty_points: number;
  total_spent: number;
}

export interface EmployeeItem {
  id: string;
  name: string;
  role: string;
  phone?: string;
  shift: string;
  status: string;
}

export interface RestoTableItem {
  id: string;
  table_number: string;
  qr_token: string;
  section_area: string;
  capacity: number;
  status: 'empty' | 'occupied' | 'ordered' | 'calling_waiter' | 'reserved';
  is_active: boolean;
}

export interface RestoMenuItem {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  is_available: boolean;
}

export interface KitchenTicketItem {
  name: string;
  quantity: number;
  variant?: string;
  notes?: string;
}

export interface KitchenTicket {
  id: string;
  order_code: string;
  table_number: string;
  section_area: string;
  status: 'pending' | 'cooking' | 'served' | 'completed' | 'cancelled';
  time_elapsed: string;
  items: KitchenTicketItem[];
  created_at: string;
}

export interface ServiceRequestItem {
  id: string;
  table_number: string;
  section_area: string;
  request_type: string;
  note?: string;
  status: string;
  created_at: string;
}
