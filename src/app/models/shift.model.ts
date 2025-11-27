import { Driver } from './driver.model';
import { Motorcycle } from './motorcycle.model';

export class Shift {
  id: number;
  driver_id: number;
  motorcycle_id: number;
  start_time: string;
  end_time: string;
  status: string; // active, completed, cancelled
  created_at?: string;
  driver?: Driver;
  motorcycle?: Motorcycle;
}
