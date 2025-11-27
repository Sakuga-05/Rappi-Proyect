export class Order {
  id: number;
  customer_id: number;
  total?: number;
  status?: string; // pending, preparing, ready, delivered
  created_at?: string;
}
