export class Order {
  id: number;
  customer_id: number;
  total?: number;
  status?: string; // pending, preparing, ready, delivered
  address_id?: number; // Relación 1:1 con Address
  created_at?: string;
}
