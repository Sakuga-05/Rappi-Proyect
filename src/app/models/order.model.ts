export class Order {
  id: number;
  customer_id?: number;
  menu_id?: number;
  motorcycle_id?: number;
  quantity?: number;
  total?: number;
  status?: string; // pending, preparing, ready, delivered
  created_at?: string;
}
