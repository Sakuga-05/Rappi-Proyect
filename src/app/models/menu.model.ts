import { Restaurant } from "./restaurant.model";

export class Menu {
  id: number;
  restaurant_id?: number;
  product_id?: number;
  price?: number;
  available?: boolean;
}
